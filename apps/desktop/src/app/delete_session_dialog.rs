//! Confirmation dialog for deleting a conversation / session.

use gpui::{KeyBinding, actions};

use super::*;

actions!(
    padu_delete_session_dialog,
    [ConfirmDeleteSessionDialog, DismissDeleteSessionDialog]
);

const DIALOG_CONTEXT: &str = "DeleteSessionDialog";

pub fn init(cx: &mut App) {
    cx.bind_keys([
        KeyBinding::new("enter", ConfirmDeleteSessionDialog, Some(DIALOG_CONTEXT)),
        KeyBinding::new("escape", DismissDeleteSessionDialog, Some(DIALOG_CONTEXT)),
    ]);
}

pub(super) struct DeleteSessionDialogState {
    pub session_id: Uuid,
    pub title: String,
    pub cancel_focus: FocusHandle,
    pub confirm_focus: FocusHandle,
    pub previous_focus: Option<FocusHandle>,
}

impl Padu {
    pub(super) fn confirm_delete_session(
        &mut self,
        session_id: Uuid,
        window: &mut Window,
        cx: &mut Context<Self>,
    ) {
        let Some(session) = self.state.sessions.iter().find(|s| s.id == session_id) else {
            return;
        };
        let title = session.display_title().to_owned();
        let previous_focus = window.focused(cx);
        let cancel_focus = cx.focus_handle();
        let confirm_focus = cx.focus_handle();
        let focus_target = confirm_focus.clone();
        window.on_next_frame(move |window, cx| window.focus(&focus_target, cx));
        self.delete_session_dialog = Some(DeleteSessionDialogState {
            session_id,
            title,
            cancel_focus,
            confirm_focus,
            previous_focus,
        });
        cx.notify();
    }

    pub(super) fn close_delete_session_dialog(
        &mut self,
        window: &mut Window,
        cx: &mut Context<Self>,
    ) {
        if let Some(dialog) = self.delete_session_dialog.take() {
            if let Some(prev) = dialog.previous_focus {
                window.focus(&prev, cx);
            } else {
                let focus = self.composer_focus(cx);
                window.focus(&focus, cx);
            }
            cx.notify();
        }
    }

    pub(super) fn execute_delete_session_dialog(
        &mut self,
        window: &mut Window,
        cx: &mut Context<Self>,
    ) {
        if let Some(dialog) = self.delete_session_dialog.take() {
            self.remove_session(dialog.session_id, cx);
            let focus = self.composer_focus(cx);
            window.focus(&focus, cx);
            cx.notify();
        }
    }

    pub(super) fn render_delete_session_dialog(
        &mut self,
        _window: &mut Window,
        cx: &mut Context<Self>,
    ) -> Option<AnyElement> {
        let dialog = self.delete_session_dialog.as_ref()?;
        let theme = Theme::current(cx);
        let title = dialog.title.clone();

        let cancel_focus_next = dialog.confirm_focus.clone();
        let cancel_button = div()
            .id("delete-session-cancel")
            .track_focus(&dialog.cancel_focus)
            .tab_index(0)
            .h(px(32.0))
            .px(px(14.0))
            .rounded(px(7.0))
            .flex()
            .items_center()
            .justify_center()
            .gap(px(6.0))
            .cursor_pointer()
            .text_size(sp(13.0))
            .font_weight(FontWeight::MEDIUM)
            .text_color(theme.text_secondary)
            .hover(|s| s.bg(theme.overlay).text_color(theme.text))
            .active(|s| s.bg(theme.overlay_strong))
            .focus_visible(|s| s.border_1().border_color(theme.accent))
            .child(tr!("common.cancel"))
            .child(kbd_badge("Esc", &theme))
            .on_click(cx.listener(|padu, _, window, cx| {
                padu.close_delete_session_dialog(window, cx);
            }))
            .on_key_down(cx.listener(move |padu, event: &KeyDownEvent, window, cx| {
                match event.keystroke.key.as_str() {
                    "right" => {
                        window.focus(&cancel_focus_next, cx);
                        cx.stop_propagation();
                    }
                    "enter" | "space" => {
                        padu.close_delete_session_dialog(window, cx);
                        cx.stop_propagation();
                    }
                    "escape" => {
                        padu.close_delete_session_dialog(window, cx);
                        cx.stop_propagation();
                    }
                    _ => {}
                }
            }));

        let confirm_focus_prev = dialog.cancel_focus.clone();
        let confirm_button = div()
            .id("delete-session-confirm")
            .track_focus(&dialog.confirm_focus)
            .tab_index(0)
            .h(px(32.0))
            .px(px(14.0))
            .rounded(px(7.0))
            .flex()
            .items_center()
            .justify_center()
            .gap(px(6.0))
            .cursor_pointer()
            .text_size(sp(13.0))
            .font_weight(FontWeight::MEDIUM)
            .bg(theme.danger)
            .text_color(rgb(0xFFFFFF))
            .hover(|s| s.bg(theme.danger_soft))
            .focus_visible(|s| s.border_1().border_color(rgb(0xFFFFFF)))
            .child(tr!("session.delete_confirm"))
            .child(kbd_badge("↵", &theme))
            .on_click(cx.listener(|padu, _, window, cx| {
                padu.execute_delete_session_dialog(window, cx);
            }))
            .on_key_down(cx.listener(move |padu, event: &KeyDownEvent, window, cx| {
                match event.keystroke.key.as_str() {
                    "left" => {
                        window.focus(&confirm_focus_prev, cx);
                        cx.stop_propagation();
                    }
                    "enter" | "space" => {
                        padu.execute_delete_session_dialog(window, cx);
                        cx.stop_propagation();
                    }
                    "escape" => {
                        padu.close_delete_session_dialog(window, cx);
                        cx.stop_propagation();
                    }
                    _ => {}
                }
            }));

        let card = div()
            .key_context(DIALOG_CONTEXT)
            .tab_group()
            .w(px(400.0))
            .rounded(px(14.0))
            .bg(theme.surface)
            .border_1()
            .border_color(theme.border)
            .shadow_lg()
            .flex()
            .flex_col()
            .p(px(20.0))
            .gap(px(14.0))
            .on_mouse_down(MouseButton::Left, |_, _, cx| cx.stop_propagation())
            .child(
                div()
                    .flex()
                    .items_center()
                    .gap(px(10.0))
                    .child(
                        div()
                            .size(px(32.0))
                            .rounded(px(8.0))
                            .bg(theme.danger_soft)
                            .flex()
                            .items_center()
                            .justify_center()
                            .child(icon("icons/trash.svg", 16.0, theme.danger)),
                    )
                    .child(
                        div()
                            .text_size(sp(15.0))
                            .font_weight(FontWeight::SEMIBOLD)
                            .text_color(theme.text)
                            .child(tr!("session.delete_title")),
                    ),
            )
            .child(
                div()
                    .text_size(sp(13.5))
                    .line_height(sp(20.0))
                    .text_color(theme.text_secondary)
                    .child(tr!("session.delete_message", title = title)),
            )
            .child(
                div()
                    .flex()
                    .items_center()
                    .justify_end()
                    .gap(px(8.0))
                    .pt(px(6.0))
                    .child(cancel_button)
                    .child(confirm_button),
            )
            .on_action(cx.listener(|padu, _: &ConfirmDeleteSessionDialog, window, cx| {
                padu.execute_delete_session_dialog(window, cx);
            }))
            .on_action(cx.listener(|padu, _: &DismissDeleteSessionDialog, window, cx| {
                padu.close_delete_session_dialog(window, cx);
            }));

        let scrim = if theme.is_dark {
            gpui::hsla(0.0, 0.0, 0.0, 0.38)
        } else {
            gpui::hsla(0.0, 0.0, 0.0, 0.18)
        };

        let layer = div()
            .id("delete-session-dialog-layer")
            .absolute()
            .inset_0()
            .occlude()
            .bg(scrim)
            .p(px(24.0))
            .flex()
            .items_center()
            .justify_center()
            .on_mouse_down(
                MouseButton::Left,
                cx.listener(|padu, _, window, cx| padu.close_delete_session_dialog(window, cx)),
            )
            .child(card);

        Some(gpui::deferred(layer).with_priority(5).into_any_element())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[gpui::test]
    fn delete_session_dialog_state_manages_focus_and_target(cx: &mut App) {
        let session_id = Uuid::new_v4();
        let cancel_focus = cx.focus_handle();
        let confirm_focus = cx.focus_handle();
        let state = DeleteSessionDialogState {
            session_id,
            title: "Ship UI Polish".to_string(),
            cancel_focus,
            confirm_focus,
            previous_focus: None,
        };
        assert_eq!(state.session_id, session_id);
        assert_eq!(state.title, "Ship UI Polish");
    }
}
