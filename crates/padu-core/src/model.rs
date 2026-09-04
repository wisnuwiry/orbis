//! Daemon-only provider discovery layered over shared protocol models.

use std::path::Path;

pub use padu_protocol::model::*;

pub fn provider_probe(provider: ProviderKind, binary_override: Option<&str>) -> ProviderProbe {
    let path = match binary_override {
        Some(binary) => crate::command_env::resolve_binary_override(binary),
        None => crate::command_env::find_executable(provider.command()),
    };
    let installed = path.is_some();
    // An uninstalled provider offers nothing to pick: seeding fallback models
    // here would let selection paths that forget to check `installed` offer a
    // provider with no CLI behind it.
    let (models, agent_presets) = if installed {
        (
            crate::model_catalog::fallback_models(provider),
            crate::model_catalog::fallback_agent_presets(provider),
        )
    } else {
        (Vec::new(), Vec::new())
    };
    ProviderProbe {
        provider,
        installed,
        path,
        models,
        agent_presets,
    }
}

/// Detect a provider and hydrate its catalog from the daemon-owned cache.
///
/// This is the fast half of stale-while-revalidate: clients can render the
/// last successful catalog immediately, then request live discovery to replace
/// it. Cache I/O stays in the daemon instead of leaking host filesystem access
/// into desktop or Web clients.
pub fn cached_provider_probe(
    provider: ProviderKind,
    binary_override: Option<&str>,
) -> ProviderProbe {
    let cached = crate::model_catalog::cached_models(provider);
    apply_cached_models(provider_probe(provider, binary_override), cached)
}

fn apply_cached_models(
    mut probe: ProviderProbe,
    cached_models: Option<Vec<ProviderModel>>,
) -> ProviderProbe {
    // A stale cache must not resurrect a catalog for a CLI that is no longer
    // on the machine; the picker hides uninstalled providers regardless, but
    // every other selection path should see the same empty catalog.
    if probe.installed
        && probe.provider.supports_model_discovery()
        && let Some(models) = cached_models
    {
        probe.models = models;
    }
    probe
}

pub fn discover_provider_models(mut probe: ProviderProbe) -> ProviderProbe {
    if !probe.installed {
        probe.models = Vec::new();
        probe.agent_presets = Vec::new();
        return probe;
    }
    if probe.provider.supports_model_discovery()
        && let Some(path) = probe.path.as_deref()
    {
        let (models, agent_presets) = crate::model_catalog::discover_catalog(probe.provider, path);
        probe.models = models;
        probe.agent_presets = agent_presets;
    }
    probe
}

/// Run `<cli> --version` on the daemon host and extract its first version-like
/// token. Provider CLIs decorate this output differently, so clients receive a
/// normalized value rather than subprocess output.
pub fn probe_provider_version(binary: &Path) -> Option<String> {
    let mut command = crate::command_env::command(binary);
    let command = command.arg("--version").stdin(std::process::Stdio::null());
    let output = crate::command_env::output(command).ok()?;
    let combined = format!(
        "{}\n{}",
        String::from_utf8_lossy(&output.stdout),
        String::from_utf8_lossy(&output.stderr)
    );
    parse_cli_version(&combined)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn cached_catalog_replaces_fallback_before_live_discovery() {
        let probe = ProviderProbe {
            provider: ProviderKind::Codex,
            installed: true,
            path: Some("/usr/bin/codex".into()),
            models: crate::model_catalog::fallback_models(ProviderKind::Codex),
            agent_presets: Vec::new(),
        };
        let cached = vec![ProviderModel::new("cached-model", "Cached model").default()];

        let probe = apply_cached_models(probe, Some(cached));

        assert_eq!(probe.models.len(), 1);
        assert_eq!(probe.models[0].id, "cached-model");
    }

    #[test]
    fn uninstalled_probe_offers_no_models_or_presets() {
        let probe = ProviderProbe {
            provider: ProviderKind::Claude,
            installed: false,
            path: None,
            models: crate::model_catalog::fallback_models(ProviderKind::Claude),
            agent_presets: crate::model_catalog::fallback_agent_presets(ProviderKind::Claude),
        };
        let cached = vec![ProviderModel::new("cached-model", "Cached model").default()];

        // A stale cache must not resurrect a catalog for a missing CLI, and
        // discovery must leave the probe empty so no selection path can offer
        // a provider with nothing behind it.
        let probe = apply_cached_models(probe, Some(cached));
        assert!(probe.models.is_empty());

        let probe = discover_provider_models(probe);
        assert!(probe.models.is_empty());
        assert!(probe.agent_presets.is_empty());
    }

    #[test]
    fn provider_probe_empties_uninstalled_providers_at_the_source() {
        // A binary override pointing nowhere resolves to "not installed": the
        // probe must carry no catalog, not even a fallback.
        let probe = provider_probe(ProviderKind::Claude, Some("/definitely/not/a-padu-cli"));
        assert!(!probe.installed);
        assert!(probe.path.is_none());
        assert!(probe.models.is_empty());
        assert!(probe.agent_presets.is_empty());

        // ...while an override pointing at a real file counts as installed and
        // keeps the discovery-owned fallback (empty for Claude) or the
        // provider-owned default (Cursor's `auto`).
        let path = std::env::temp_dir().join(format!("padu-probe-{}-cli", std::process::id()));
        std::fs::write(&path, b"#!/bin/sh\n").unwrap();
        let spec = path.to_string_lossy().into_owned();

        let probe = provider_probe(ProviderKind::Claude, Some(&spec));
        assert!(probe.installed);
        assert!(probe.models.is_empty());

        let probe = provider_probe(ProviderKind::Cursor, Some(&spec));
        assert!(probe.installed);
        assert_eq!(
            probe
                .models
                .iter()
                .map(|model| model.id.as_str())
                .collect::<Vec<_>>(),
            ["auto"]
        );

        // DeepSeek's presets are provider-owned, so they follow the same rule.
        let probe = provider_probe(ProviderKind::DeepSeek, Some("/definitely/not/a-padu-cli"));
        assert!(!probe.installed);
        assert!(probe.agent_presets.is_empty());

        let _ = std::fs::remove_file(path);
    }
}
