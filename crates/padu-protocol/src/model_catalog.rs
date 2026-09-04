//! Provider fallback choices used before daemon-side discovery completes.

use crate::model::{ProviderAgentPreset, ProviderKind, ProviderModel, ProviderModelOption};

pub fn fallback_models(provider: ProviderKind) -> Vec<ProviderModel> {
    match provider {
        ProviderKind::Amp => [
            ProviderModel::new("low", tr!("model_option.low")),
            ProviderModel::new("medium", tr!("model_option.medium")).default(),
            ProviderModel::new("high", tr!("model_option.high")),
            ProviderModel::new("ultra", tr!("model_option.ultra")),
        ]
        .into_iter()
        .map(|model| {
            model.service_tiers(
                [ProviderModelOption::new("fast", tr!("model_option.fast"))
                    .description(tr!("model_option.amp_fast_description"))],
                "default",
            )
        })
        .collect(),
        ProviderKind::Cursor => {
            vec![ProviderModel::new("auto", tr!("model_option.auto")).default()]
        }
        // Claude's catalog is account-specific and reported by the installed
        // CLI's sessionless initialization probe (including CC-Switch role
        // mappings). An invented fallback would offer models the CLI rejects
        // and hide custom entries, so discovery is authoritative.
        //
        // Codex reports its own catalog over `model/list` on a throwaway
        // app-server, including effort ladders and service tiers per model,
        // so the same applies: discovery is authoritative.
        ProviderKind::Claude
        | ProviderKind::Codex
        | ProviderKind::DeepSeek
        | ProviderKind::Fx
        | ProviderKind::Grok
        | ProviderKind::Kimi
        | ProviderKind::OpenCode
        | ProviderKind::OhMyPi
        | ProviderKind::Pi => Vec::new(),
    }
}

pub fn fallback_agent_presets(provider: ProviderKind) -> Vec<ProviderAgentPreset> {
    if provider != ProviderKind::DeepSeek {
        return Vec::new();
    }
    vec![
        ProviderAgentPreset::new("standard", tr!("agent_preset.standard"))
            .description(tr!("agent_preset.standard_description"))
            .default(),
        ProviderAgentPreset::new("code", tr!("agent_preset.code"))
            .description(tr!("agent_preset.code_description")),
        ProviderAgentPreset::new("minimal", tr!("agent_preset.minimal"))
            .description(tr!("agent_preset.minimal_description")),
        ProviderAgentPreset::new("cordis", tr!("agent_preset.creator"))
            .description(tr!("agent_preset.creator_description")),
    ]
}

/// The exact Grok models the hardcoded reasoning menu is known to cover.
/// `grok models` also lists user-defined custom models, whose effort support
/// is not knowable from the ID, so they get no menu.
pub fn grok_model_reasoning_efforts(id: &str) -> Option<&'static [&'static str]> {
    match id.to_ascii_lowercase().as_str() {
        "grok-4.5" => Some(&["low", "medium", "high"]),
        "grok-4.6" => Some(&["low", "medium", "high", "xhigh"]),
        _ => None,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn grok_reasoning_menu_covers_only_exact_builtins() {
        assert_eq!(
            grok_model_reasoning_efforts("grok-4.5"),
            Some(&["low", "medium", "high"][..])
        );
        assert_eq!(
            grok_model_reasoning_efforts("grok-4.6"),
            Some(&["low", "medium", "high", "xhigh"][..])
        );
        // Custom models and unknown spellings get no menu.
        assert_eq!(grok_model_reasoning_efforts("grok-build"), None);
        assert_eq!(grok_model_reasoning_efforts("my-custom-test"), None);
        assert_eq!(grok_model_reasoning_efforts("grok-4-6"), None);
    }

    #[test]
    fn grok_fallback_catalog_is_empty() {
        // A fabricated fallback would offer a model the CLI rejects, so
        // discovery is authoritative and the pre-discovery picker is empty.
        assert!(fallback_models(ProviderKind::Grok).is_empty());
    }

    #[test]
    fn claude_fallback_catalog_is_empty() {
        // The catalog is account-specific and reported by the installed CLI,
        // so discovery is authoritative and the pre-discovery picker is empty.
        assert!(fallback_models(ProviderKind::Claude).is_empty());
    }

    #[test]
    fn codex_fallback_catalog_is_empty() {
        // The CLI reports its own catalog over `model/list`, so discovery is
        // authoritative and the pre-discovery picker is empty.
        assert!(fallback_models(ProviderKind::Codex).is_empty());
    }
}
