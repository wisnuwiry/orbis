//! Shared application identity used by the daemon and desktop client.

#[cfg(debug_assertions)]
pub const APP_NAME: &str = "Padu Debug";
#[cfg(not(debug_assertions))]
pub const APP_NAME: &str = "Padu";

#[cfg(debug_assertions)]
pub const APP_ID: &str = "dev.padu.dev";
#[cfg(not(debug_assertions))]
pub const APP_ID: &str = "dev.padu";

#[cfg(debug_assertions)]
pub const DATA_DIRECTORY_NAME: &str = "Padu Debug";
#[cfg(not(debug_assertions))]
pub const DATA_DIRECTORY_NAME: &str = "Padu";
