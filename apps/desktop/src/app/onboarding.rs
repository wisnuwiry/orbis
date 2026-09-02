//! Floating onboarding tour for new users.

use gpui::{KeyBinding, actions};

use super::*;
use crate::ui::ActivationExt;

actions!(
    padu_onboarding,
    [
        DismissOnboarding,
        NextOnboardingStep,
        PreviousOnboardingStep,
        CompleteOnboarding
    ]
);

pub const ONBOARDING_CONTEXT: &str = "OnboardingModal";
pub const TOTAL_ONBOARDING_STEPS: usize = 3;
const MODAL_WIDTH: f32 = 540.0;

pub fn init(cx: &mut App) {
    cx.bind_keys([
        KeyBinding::new("escape", DismissOnboarding, Some(ONBOARDING_CONTEXT)),
        KeyBinding::new("right", NextOnboardingStep, Some(ONBOARDING_CONTEXT)),
        KeyBinding::new("left", PreviousOnboardingStep, Some(ONBOARDING_CONTEXT)),
        KeyBinding::new("enter", NextOnboardingStep, Some(ONBOARDING_CONTEXT)),
    ]);
}

pub(super) struct OnboardingState {
    pub open: bool,
    pub current_step: usize,
    pub focus: FocusHandle,
    pub next_focus: FocusHandle,
    pub back_focus: FocusHandle,
    pub skip_focus: FocusHandle,
}

impl OnboardingState {
    pub(super) fn new(cx: &mut App) -> Self {
        Self {
            open: false,
            current_step: 0,
            focus: cx.focus_handle(),
            next_focus: cx.focus_handle(),
            back_focus: cx.focus_handle(),
            skip_focus: cx.focus_handle(),
        }
    }

    pub(super) fn open(&mut self, window: &mut Window, cx: &mut Context<Padu>) {
        self.open = true;
        self.current_step = 0;
        window.focus(&self.focus, cx);
        cx.notify();
    }

    pub(super) fn dismiss(&mut self, cx: &mut Context<Padu>) {
        self.open = false;
        cx.notify();
    }

    pub(super) fn next_step(&mut self, cx: &mut Context<Padu>) {
        if self.current_step + 1 < TOTAL_ONBOARDING_STEPS {
            self.current_step += 1;
        } else {
            self.open = false;
        }
        cx.notify();
    }

    pub(super) fn previous_step(&mut self, cx: &mut Context<Padu>) {
        if self.current_step > 0 {
            self.current_step -= 1;
        }
        cx.notify();
    }

    pub(super) fn set_step(&mut self, step: usize, cx: &mut Context<Padu>) {
        if step < TOTAL_ONBOARDING_STEPS {
            self.current_step = step;
            cx.notify();
        }
    }
}

impl Padu {
    pub fn open_onboarding(&mut self, window: &mut Window, cx: &mut Context<Self>) {
        self.onboarding.open(window, cx);
    }

    pub fn dismiss_onboarding(&mut self, cx: &mut Context<Self>) {
        self.state.has_completed_onboarding = true;
        self.save();
        self.onboarding.dismiss(cx);
    }

    pub fn next_onboarding_step(&mut self, cx: &mut Context<Self>) {
        if self.onboarding.current_step + 1 >= TOTAL_ONBOARDING_STEPS {
            self.complete_onboarding(cx);
        } else {
            self.onboarding.next_step(cx);
        }
    }

    pub fn previous_onboarding_step(&mut self, cx: &mut Context<Self>) {
        self.onboarding.previous_step(cx);
    }

    pub fn complete_onboarding(&mut self, cx: &mut Context<Self>) {
        self.state.has_completed_onboarding = true;
        self.save();
        self.onboarding.open = false;
        cx.notify();
    }

    pub(super) fn render_onboarding_modal(
        &mut self,
        _window: &mut Window,
        cx: &mut Context<Self>,
    ) -> Option<AnyElement> {
        if !self.onboarding.open {
            return None;
        }

        let theme = Theme::current(cx);
        let step = self.onboarding.current_step;
        let is_last = step + 1 == TOTAL_ONBOARDING_STEPS;

        // Slide Data: 3 focused, simplified steps
        let (_badge, title, desc, _icon_path, items) = match step {
            0 => (
                tr!("onboarding.slide1_badge"),
                tr!("onboarding.slide1_title"),
                tr!("onboarding.slide1_desc"),
                "icons/bot.svg",
                [
                    (
                        "icons/bot.svg",
                        tr!("onboarding.slide1_item1_title"),
                        tr!("onboarding.slide1_item1_desc"),
                    ),
                    (
                        "icons/zap.svg",
                        tr!("onboarding.slide1_item2_title"),
                        tr!("onboarding.slide1_item2_desc"),
                    ),
                    (
                        "icons/lock.svg",
                        tr!("onboarding.slide1_item3_title"),
                        tr!("onboarding.slide1_item3_desc"),
                    ),
                ],
            ),
            1 => (
                tr!("onboarding.slide2_badge"),
                tr!("onboarding.slide2_title"),
                tr!("onboarding.slide2_desc"),
                "icons/queue.svg",
                [
                    (
                        "icons/folder.svg",
                        tr!("onboarding.slide2_item1_title"),
                        tr!("onboarding.slide2_item1_desc"),
                    ),
                    (
                        "icons/file-diff.svg",
                        tr!("onboarding.slide2_item2_title"),
                        tr!("onboarding.slide2_item2_desc"),
                    ),
                    (
                        "icons/rewind.svg",
                        tr!("onboarding.slide2_item3_title"),
                        tr!("onboarding.slide2_item3_desc"),
                    ),
                ],
            ),
            _ => (
                tr!("onboarding.slide3_badge"),
                tr!("onboarding.slide3_title"),
                tr!("onboarding.slide3_desc"),
                "icons/folder.svg",
                [
                    (
                        "icons/folder.svg",
                        tr!("onboarding.slide3_item1_title"),
                        tr!("onboarding.slide3_item1_desc"),
                    ),
                    (
                        "icons/sparkle.svg",
                        tr!("onboarding.slide3_item2_title"),
                        tr!("onboarding.slide3_item2_desc"),
                    ),
                    (
                        "icons/target.svg",
                        tr!("onboarding.slide3_item3_title"),
                        tr!("onboarding.slide3_item3_desc"),
                    ),
                ],
            ),
        };

        // Top navigation bar: Progress indicator & Ghost close button
        let mut step_pills = div().flex().items_center().gap(px(5.0));
        for i in 0..TOTAL_ONBOARDING_STEPS {
            let is_active = i == step;
            let width = if is_active { px(24.0) } else { px(7.0) };
            let color = if is_active {
                theme.accent
            } else {
                theme.text_ghost.opacity(0.3)
            };
            step_pills = step_pills.child(
                div()
                    .id(SharedString::from(format!("onboarding-pill-{i}")))
                    .h(px(4.0))
                    .w(width)
                    .rounded(px(2.0))
                    .bg(color)
                    .cursor_pointer()
                    .hover(|el| el.opacity(0.8))
                    .on_click(cx.listener(move |padu, _, _, cx| {
                        padu.onboarding.set_step(i, cx);
                    })),
            );
        }

        let top_bar = div()
            .flex()
            .items_center()
            .justify_between()
            .w_full()
            .child(step_pills)
            .child(
                div()
                    .id("dismiss-onboarding-btn")
                    .track_focus(&self.onboarding.skip_focus)
                    .tab_index(0)
                    .size(px(24.0))
                    .rounded(px(6.0))
                    .flex()
                    .items_center()
                    .justify_center()
                    .cursor_pointer()
                    .focus_visible(|style| style.border_1().border_color(theme.accent))
                    .hover(|el| el.bg(theme.overlay))
                    .active(|el| el.bg(theme.overlay_strong))
                    .child(icon("icons/x.svg", 11.5, theme.text_ghost))
                    .on_activation(cx, |padu, _, cx| {
                        padu.dismiss_onboarding(cx);
                    }),
            );

        // Keep every slide's introduction centered around the Padu brand.
        let hero_section = div()
            .flex()
            .flex_col()
            .items_center()
            .text_center()
            .mt(px(28.0))
            .mb(px(28.0))
            .child(icon("icons/logo.svg", 72.0, theme.accent))
            .child(
                div()
                    .mt(px(18.0))
                    .text_size(sp(20.0))
                    .font_weight(FontWeight::BOLD)
                    .text_color(theme.text)
                    .child(title),
            )
            .child(
                div()
                    .mt(px(8.0))
                    .max_w(px(360.0))
                    .text_size(sp(13.0))
                    .line_height(sp(19.0))
                    .text_color(theme.text_secondary)
                    .child(desc),
            );

        // Step 2 highlights the core project workflow in compact cards.
        let mut items_col = div().flex().flex_col().gap(px(10.0)).w_full();
        if step == 1 {
            for (item_icon, item_title, item_desc) in items {
                let row = div()
                    .flex()
                    .items_start()
                    .gap(px(12.0))
                    .p(px(12.0))
                    .rounded(px(10.0))
                    .bg(theme.raised)
                    .border_1()
                    .border_color(theme.border)
                    .child(
                        div()
                            .size(px(28.0))
                            .rounded(px(7.0))
                            .bg(theme.raised)
                            .border_1()
                            .border_color(theme.border_strong)
                            .flex_none()
                            .flex()
                            .items_center()
                            .justify_center()
                            .child(icon(item_icon, 13.5, theme.text_secondary)),
                    )
                    .child(
                        div()
                            .flex()
                            .flex_col()
                            .flex_1()
                            .min_w_0()
                            .gap(px(2.0))
                            .child(
                                div()
                                    .text_size(sp(13.0))
                                    .font_weight(FontWeight::SEMIBOLD)
                                    .text_color(theme.text)
                                    .child(item_title),
                            )
                            .child(
                                div()
                                    .text_size(sp(12.0))
                                    .line_height(sp(16.5))
                                    .text_color(theme.text_secondary)
                                    .child(item_desc),
                            ),
                    );
                items_col = items_col.child(row);
            }
        }

        // Footer buttons with spacious top margin
        let is_first = step == 0;

        let skip_btn = div()
            .id("onboarding-skip-btn")
            .cursor_pointer()
            .text_size(sp(12.0))
            .text_color(theme.text_ghost)
            .hover(|el| el.text_color(theme.text_secondary))
            .child(tr!("onboarding.skip"))
            .on_click(cx.listener(|padu, _, _, cx| {
                padu.dismiss_onboarding(cx);
            }));

        let back_btn = if !is_first {
            Some(
                div()
                    .id("onboarding-back-btn")
                    .track_focus(&self.onboarding.back_focus)
                    .tab_index(0)
                    .h(px(32.0))
                    .px(px(12.0))
                    .rounded(px(7.0))
                    .flex()
                    .items_center()
                    .justify_center()
                    .cursor_pointer()
                    .text_size(sp(12.5))
                    .text_color(theme.text_secondary)
                    .hover(|el| el.bg(theme.overlay))
                    .focus_visible(|style| style.border_1().border_color(theme.accent))
                    .child(tr!("onboarding.back"))
                    .on_activation(cx, |padu, _, cx| {
                        padu.previous_onboarding_step(cx);
                    }),
            )
        } else {
            None
        };

        let next_btn_label = if is_last {
            tr!("onboarding.get_started")
        } else {
            tr!("onboarding.next")
        };

        let next_btn = div()
            .id("onboarding-next-btn")
            .track_focus(&self.onboarding.next_focus)
            .tab_index(0)
            .h(px(32.0))
            .px(px(16.0))
            .rounded(px(7.0))
            .flex()
            .items_center()
            .justify_center()
            .cursor_pointer()
            .text_size(sp(12.5))
            .font_weight(FontWeight::MEDIUM)
            .focus_visible(|style| style.border_1().border_color(theme.accent))
            .when(is_last, |btn| {
                btn.bg(theme.inverse)
                    .text_color(theme.on_inverse)
                    .hover(|el| el.opacity(0.9))
                    .active(|el| el.opacity(0.8))
            })
            .when(!is_last, |btn| {
                btn.bg(theme.overlay_strong)
                    .text_color(theme.text)
                    .hover(|el| el.bg(theme.overlay))
            })
            .child(next_btn_label)
            .on_activation(cx, |padu, _, cx| {
                padu.next_onboarding_step(cx);
            });

        let footer = div()
            .flex()
            .items_center()
            .justify_between()
            .w_full()
            .mt(px(26.0))
            .child(skip_btn)
            .child(
                div()
                    .flex()
                    .items_center()
                    .gap(px(6.0))
                    .children(back_btn)
                    .child(next_btn),
            );

        // Floating Card with ample whitespace
        let card = div()
            .id("onboarding-card")
            .key_context(ONBOARDING_CONTEXT)
            .track_focus(&self.onboarding.focus)
            .on_action(cx.listener(|this, _: &DismissOnboarding, _, cx| {
                this.dismiss_onboarding(cx);
            }))
            .on_action(cx.listener(|this, _: &NextOnboardingStep, _, cx| {
                this.next_onboarding_step(cx);
            }))
            .on_action(cx.listener(|this, _: &PreviousOnboardingStep, _, cx| {
                this.previous_onboarding_step(cx);
            }))
            .on_action(cx.listener(|this, _: &CompleteOnboarding, _, cx| {
                this.complete_onboarding(cx);
            }))
            .occlude()
            .w(px(MODAL_WIDTH))
            .max_w(px(MODAL_WIDTH))
            .bg(theme.surface)
            .border_1()
            .border_color(theme.border_strong)
            .rounded(px(16.0))
            .shadow_xl()
            .p(px(28.0))
            .flex()
            .flex_col()
            .on_mouse_down(MouseButton::Left, |_, _, cx| {
                cx.stop_propagation();
            })
            .child(top_bar)
            .child(hero_section)
            .child(items_col)
            .child(footer);

        let scrim = if theme.is_dark {
            gpui::hsla(0.0, 0.0, 0.0, 0.45)
        } else {
            gpui::hsla(0.0, 0.0, 0.0, 0.20)
        };

        let layer = div()
            .id("onboarding-layer")
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
                cx.listener(|padu, _, _, cx| padu.dismiss_onboarding(cx)),
            )
            .child(card);

        Some(gpui::deferred(layer).with_priority(5).into_any_element())
    }
}
