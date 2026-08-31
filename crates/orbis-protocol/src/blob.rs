//! Durable references for daemon-owned binary task payloads.

/// Scheme for a stored blob reference, e.g. `orbis-blob:3f2a...c1.png`.
pub const SCHEME: &str = "orbis-blob:";

pub fn is_reference(value: &str) -> bool {
    value.starts_with(SCHEME)
}
