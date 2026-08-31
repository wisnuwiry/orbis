//! Shared application identity used by the daemon and desktop client.

#[cfg(debug_assertions)]
pub const APP_NAME: &str = "Orbis Debug";
#[cfg(not(debug_assertions))]
pub const APP_NAME: &str = "Orbis";

#[cfg(debug_assertions)]
pub const APP_ID: &str = "sh.orbis.dev";
#[cfg(not(debug_assertions))]
pub const APP_ID: &str = "sh.orbis";

#[cfg(debug_assertions)]
pub const DATA_DIRECTORY_NAME: &str = "Orbis Debug";
#[cfg(not(debug_assertions))]
pub const DATA_DIRECTORY_NAME: &str = "Orbis";
