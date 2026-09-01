// Example: Provider Driver Skeleton for Padu Core
// File: crates/padu-core/src/driver/my_provider.rs

use async_trait::async_trait;
use tokio::process::Command;
use crate::driver::{AgentDriver, DriverError, DriverHandle, SessionConfig, TurnPayload};
use padu_protocol::RuntimeEvent;

pub struct MyProviderDriver {
    pub binary_path: String,
}

#[async_trait]
impl AgentDriver for MyProviderDriver {
    async fn start(&self, session: &SessionConfig) -> Result<DriverHandle, DriverError> {
        let mut child = Command::new(&self.binary_path)
            .arg("--cwd")
            .arg(&session.working_dir)
            .stdout(std::process::Stdio::piped())
            .stderr(std::process::Stdio::piped())
            .stdin(std::process::Stdio::piped())
            .spawn()
            .map_err(|e| DriverError::SpawnFailed(e.to_string()))?;

        // Initialize event forwarding loop over stdout lines
        let (tx, rx) = tokio::sync::mpsc::channel(100);

        tokio::spawn(async move {
            // Read provider JSON-RPC or stdout lines and send RuntimeEvent::* through tx
        });

        Ok(DriverHandle::new(child, tx, rx))
    }

    async fn send_turn(&self, handle: &mut DriverHandle, turn: TurnPayload) -> Result<(), DriverError> {
        handle.write_prompt(&turn.prompt).await
    }

    async fn interrupt(&self, handle: &mut DriverHandle) -> Result<(), DriverError> {
        handle.send_sigint().await
    }
}
