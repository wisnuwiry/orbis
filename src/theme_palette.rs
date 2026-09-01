// Generated from themes.json by scripts/generate-themes.ts. Do not edit directly.

use gpui::Hsla;
use serde::{Deserialize, Serialize};

#[derive(Clone, Copy, Debug, Default, Deserialize, Eq, PartialEq, Serialize)]
#[serde(rename_all = "snake_case")]
pub enum ColorScheme {
    #[default]
    Purple,
    Coral,
}

#[allow(dead_code)]
impl ColorScheme {
    pub const ALL: [Self; 2] = [ColorScheme::Purple, ColorScheme::Coral];

    pub const fn as_str(self) -> &'static str {
        match self {
            ColorScheme::Purple => "purple",
            ColorScheme::Coral => "coral",
        }
    }

    pub fn parse(name: &str) -> Option<Self> {
        match name {
            "purple" | "Purple" => Some(ColorScheme::Purple),
            "coral" | "Coral" => Some(ColorScheme::Coral),
            _ => None,
        }
    }

    /// Returns (accent, code_text) for dark theme.
    pub fn dark_tokens(self) -> (Hsla, Hsla) {
        match self {
            ColorScheme::Purple => (gpui::rgb(0x8B5CF6).into(), gpui::rgb(0xC4B5FD).into()),
            ColorScheme::Coral => (gpui::rgb(0xE2795B).into(), gpui::rgb(0xE0A882).into()),
        }
    }

    /// Returns (accent, code_text) for light theme.
    pub fn light_tokens(self) -> (Hsla, Hsla) {
        match self {
            ColorScheme::Purple => (gpui::rgb(0x7C3AED).into(), gpui::rgb(0x6D28D9).into()),
            ColorScheme::Coral => (gpui::rgb(0xC85F44).into(), gpui::rgb(0x9A5528).into()),
        }
    }
}
