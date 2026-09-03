//! Example: ACP (Agent Client Protocol) Provider Registration
//!
//! When connecting an agent CLI that speaks the Agent Client Protocol (e.g. Cline,
//! Goose, Gemini CLI, Qwen Code, Cursor, Kimi, Grok), you DO NOT need to write a
//! custom process driver. Padu already embeds a full ACP runtime in `crates/padu-core/src/driver/acp.rs`.
//!
//! You only need to register the agent in 3 places:
//! 1. crates/padu-protocol/src/model.rs (ProviderKind enum)
//! 2. crates/padu-core/src/driver/acp.rs (launch_for)
//! 3. crates/padu-core/src/model_catalog.rs (fallback_models)

// ============================================================================
// 1. In `crates/padu-protocol/src/model.rs`:
// ============================================================================
/*
#[derive(Clone, Copy, Debug, Default, Deserialize, Eq, Hash, PartialEq, Serialize, TS)]
#[serde(rename_all = "camelCase")]
pub enum ProviderKind {
    Amp,
    Claude,
    Codex,
    Cursor,
    DeepSeek,
    Fx,
    OpenCode,
    Grok,
    Kimi,
    OhMyPi,
    Pi,
    // Add your new ACP provider here:
    MyAgent,
}

impl ProviderKind {
    pub const ALL: [Self; 12] = [
        Self::Amp,
        Self::Claude,
        Self::Codex,
        Self::Cursor,
        Self::DeepSeek,
        Self::Fx,
        Self::OpenCode,
        Self::Grok,
        Self::Kimi,
        Self::OhMyPi,
        Self::Pi,
        Self::MyAgent,
    ];

    pub fn id(self) -> &'static str {
        match self {
            // ...
            Self::MyAgent => "myagent",
        }
    }

    pub fn display_name(self) -> &'static str {
        match self {
            // ...
            Self::MyAgent => "My Agent CLI",
        }
    }

    pub fn short_name(self) -> &'static str {
        match self {
            // ...
            Self::MyAgent => "MyAgent",
        }
    }

    pub fn command(self) -> &'static str {
        match self {
            // The default executable name to detect in PATH:
            Self::MyAgent => "myagent",
        }
    }

    pub fn supports_conversation_rollback(self) -> bool {
        matches!(
            self,
            Self::Amp | Self::Claude | Self::Codex | Self::Cursor | Self::MyAgent
        )
    }

    pub fn supports_conversation_fork(self) -> bool {
        matches!(
            self,
            Self::Amp | Self::Claude | Self::Codex | Self::Cursor | Self::MyAgent
        )
    }

    pub fn supports_model_discovery(self) -> bool {
        matches!(
            self,
            Self::Claude | Self::Codex | Self::Cursor | Self::MyAgent
        )
    }
}
*/

// ============================================================================
// 2. In `crates/padu-core/src/driver/acp.rs`:
// ============================================================================
/*
// Inside `launch_for(provider: ProviderKind, reasoning_effort: Option<&str>)`:
fn launch_for(provider: ProviderKind, reasoning_effort: Option<&str>) -> anyhow::Result<AcpLaunch> {
    match provider {
        ProviderKind::Cursor => Ok(AcpLaunch {
            args: vec!["acp".into()],
            env: Vec::new(),
        }),
        // Add your launch specification here:
        ProviderKind::MyAgent => {
            let mut args = vec!["acp".into()];
            if let Some(effort) = reasoning_effort.filter(|e| !e.is_empty()) {
                args.push("--reasoning-effort".into());
                args.push(effort.to_owned());
            }
            Ok(AcpLaunch {
                args,
                env: Vec::new(),
            })
        }
        // ...
    }
}

// Inside `start_local(...)` in `crates/padu-core/src/driver/mod.rs`:
// Add `ProviderKind::MyAgent` to the match arm for AcpDriver:
ProviderKind::Cursor | ProviderKind::Fx | ProviderKind::Grok | ProviderKind::Kimi | ProviderKind::MyAgent => {
    Arc::new(acp::AcpDriver::start(provider, options, events)?)
}
*/

// ============================================================================
// 3. In `crates/padu-core/src/model_catalog.rs`:
// ============================================================================
/*
pub fn fallback_models(provider: ProviderKind) -> Vec<ProviderModel> {
    match provider {
        // ...
        ProviderKind::MyAgent => vec![
            ProviderModel::new("default", "Default Model").default(),
            ProviderModel::new("fast", "Fast Model"),
        ],
    }
}
*/
