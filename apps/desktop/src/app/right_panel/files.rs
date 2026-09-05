use super::*;

impl Padu {
    pub(crate) fn render_right_panel_files(
        &mut self,
        panel_width: f32,
        window: &mut Window,
        cx: &mut Context<Self>,
    ) -> Div {
        if let Some(relative_path) = self.right_panel_files_selected_path.clone() {
            self.render_right_panel_file(relative_path, panel_width, window, cx)
        } else {
            self.render_right_panel_working_tree(None, cx)
        }
    }

    pub(crate) fn render_right_panel_working_tree(
        &self,
        selected_path: Option<&str>,
        cx: &mut Context<Self>,
    ) -> Div {
        let theme = Theme::current(cx);
        let Some(project) = self.active_project() else {
            return self.render_right_panel_empty_message(
                tr!("files.no_project_open"),
                tr!("files.no_project_open_description"),
                cx,
            );
        };
        let project_name = project.display_name();
        // Read only. The walk is filesystem I/O, so it happens in
        // `refresh_right_panel_working_tree`, never in a frame.
        let entries = self.right_panel_working_tree.clone();
        let focus = self.transcript_control_focus("right-panel-working-tree", cx);

        let mut list = div()
            .id("right-panel-working-tree")
            .track_focus(&focus)
            .tab_index(0)
            .key_context("WorkingTree")
            .flex()
            .flex_col()
            .py(px(6.0));
        for entry in entries {
            let relative_path = entry.relative_path.clone();
            let absolute_path = entry.absolute_path.clone();
            let is_dir = entry.is_dir;
            let selected = selected_path == Some(relative_path.as_str());
            let row = div()
                .id(SharedString::from(format!(
                    "right-panel-file-{relative_path}"
                )))
                .h(px(30.0))
                .mx(px(8.0))
                .pl(px(8.0 + entry.depth as f32 * 16.0))
                .pr(px(8.0))
                .rounded(px(6.0))
                .flex()
                .items_center()
                .gap(px(6.0))
                .cursor_pointer()
                .when(selected, |element| element.bg(theme.overlay_strong))
                .when(entry.is_ignored, |element| element.opacity(0.55))
                .hover(|element| element.bg(theme.overlay))
                .child(if is_dir {
                    icon(
                        if entry.expanded {
                            "icons/chevron-down.svg"
                        } else {
                            "icons/chevron-right.svg"
                        },
                        10.0,
                        theme.text_ghost,
                    )
                    .into_any_element()
                } else {
                    div().w(px(10.0)).h(px(10.0)).flex_none().into_any_element()
                })
                .when_some(entry.file_icon, |element, file_icon_path| {
                    element.child(file_icon(file_icon_path, 14.0))
                })
                .child(
                    div()
                        .min_w_0()
                        .flex_1()
                        .truncate()
                        .text_size(sp(12.5))
                        .text_color(if entry.is_ignored {
                            theme.text_ghost
                        } else {
                            theme.text_secondary
                        })
                        .child(entry.name),
                );
            let menu = self.menu_handle(
                SharedString::from(format!("right-panel-file-menu-{relative_path}")),
                cx,
            );
            let keyboard_menu = menu.clone();
            let menu_path = absolute_path.clone();
            let menu_relative = relative_path.clone();

            let weak = cx.entity().downgrade();
            let mut row = if is_dir {
                row.on_click(cx.listener(move |this, _, _, cx| {
                    if !this.right_panel_expanded_paths.remove(&absolute_path) {
                        this.right_panel_expanded_paths
                            .insert(absolute_path.clone());
                    }
                    this.refresh_right_panel_working_tree(cx);
                    cx.notify();
                }))
            } else {
                row.on_click(cx.listener(move |this, _, _, cx| {
                    this.open_right_panel_file(relative_path.clone(), cx);
                }))
            };
            row = row.on_key_down(move |event: &KeyDownEvent, window, cx| {
                if event.keystroke.key == "f10" && event.keystroke.modifiers.shift {
                    keyboard_menu.open_context_menu(window, cx);
                    cx.stop_propagation();
                }
            });
            list = list.child(context_menu(
                row,
                SharedString::from(format!("right-panel-file-context-{menu_relative}")),
                &menu,
                move |_| {
                    let copy_path = menu_path.clone();
                    let copy_relative = menu_relative.clone();
                    let rename_weak = weak.clone();
                    let delete_weak = weak.clone();
                    let new_file_weak = weak.clone();
                    let new_folder_weak = weak.clone();
                    let mut items = Vec::new();
                    if is_dir {
                        let parent = menu_path.clone();
                        items.push(
                            MenuItem::new(tr!("files.new_file"), move |window, cx| {
                                let _ = new_file_weak.update(cx, |this, cx| {
                                    this.begin_file_operation_dialog(
                                        FileOperationDialogKind::CreateFile {
                                            parent: parent.clone(),
                                        },
                                        window,
                                        cx,
                                    );
                                });
                            })
                            .icon("icons/file.svg"),
                        );
                        let parent = menu_path.clone();
                        items.push(
                            MenuItem::new(tr!("files.new_folder"), move |window, cx| {
                                let _ = new_folder_weak.update(cx, |this, cx| {
                                    this.begin_file_operation_dialog(
                                        FileOperationDialogKind::CreateDirectory {
                                            parent: parent.clone(),
                                        },
                                        window,
                                        cx,
                                    );
                                });
                            })
                            .icon("icons/folder-new.svg"),
                        );
                    }
                    items.push(
                        MenuItem::new(tr!("files.copy_path"), move |_, cx| {
                            cx.write_to_clipboard(ClipboardItem::new_string(
                                copy_path.to_string_lossy().into_owned(),
                            ));
                        })
                        .icon("icons/copy.svg"),
                    );
                    items.push(
                        MenuItem::new(tr!("files.copy_relative_path"), move |_, cx| {
                            cx.write_to_clipboard(ClipboardItem::new_string(copy_relative.clone()));
                        })
                        .icon("icons/copy.svg"),
                    );
                    let source = menu_path.clone();
                    items.push(
                        MenuItem::new(tr!("common.rename"), move |window, cx| {
                            let _ = rename_weak.update(cx, |this, cx| {
                                this.begin_file_operation_dialog(
                                    FileOperationDialogKind::Rename {
                                        source: source.clone(),
                                    },
                                    window,
                                    cx,
                                );
                            });
                        })
                        .icon("icons/pencil.svg"),
                    );
                    let target = menu_path.clone();
                    items.push(
                        MenuItem::new(tr!("files.delete"), move |_, cx| {
                            let _ = delete_weak.update(cx, |this, cx| {
                                this.delete_right_panel_path(target.clone(), cx)
                            });
                        })
                        .icon("icons/trash.svg"),
                    );
                    items
                },
            ));
        }

        div()
            .flex_1()
            .min_h_0()
            .flex()
            .flex_col()
            .child(
                div()
                    .h(px(42.0))
                    .flex_none()
                    .px(px(16.0))
                    .flex()
                    .items_center()
                    .gap(px(8.0))
                    .border_b_1()
                    .border_color(theme.border)
                    .child(icon("icons/folder.svg", 13.0, theme.text_tertiary))
                    .child(
                        div()
                            .min_w_0()
                            .truncate()
                            .text_size(sp(12.5))
                            .font_weight(FontWeight::MEDIUM)
                            .text_color(theme.text_secondary)
                            .child(project_name),
                    )
                    .child({
                        let hidden = self.right_panel_show_hidden_files;
                        let focus = self.transcript_control_focus("right-panel-hidden-files", cx);
                        div()
                            .id("right-panel-hidden-files")
                            .track_focus(&focus)
                            .tab_index(0)
                            .size(px(26.0))
                            .rounded(px(7.0))
                            .flex_none()
                            .flex()
                            .items_center()
                            .justify_center()
                            .cursor_pointer()
                            .focus_visible(|style| style.border_1().border_color(theme.accent))
                            .hover(|style| style.bg(theme.overlay))
                            .child(icon(
                                if hidden {
                                    "icons/eye.svg"
                                } else {
                                    "icons/eye-off.svg"
                                },
                                12.0,
                                theme.text_tertiary,
                            ))
                            .tooltip(move |window, cx| {
                                Tooltip::new(if hidden {
                                    tr!("files.hide_hidden")
                                } else {
                                    tr!("files.show_hidden")
                                })
                                .build(window, cx)
                            })
                            .on_click(cx.listener(|this, _, _, cx| {
                                this.toggle_right_panel_hidden_files(cx);
                            }))
                            .on_key_down(cx.listener(|this, event: &KeyDownEvent, _, cx| {
                                if matches!(event.keystroke.key.as_str(), "enter" | "space") {
                                    this.toggle_right_panel_hidden_files(cx);
                                    cx.stop_propagation();
                                }
                            }))
                    })
                    .child(
                        icon_button("right-panel-refresh-files", "icons/rotate-cw.svg", theme)
                            .tooltip(|window, cx| {
                                Tooltip::new(tr!("files.refresh")).build(window, cx)
                            })
                            .on_click(cx.listener(|this, _, _, cx| {
                                this.refresh_right_panel_working_tree(cx);
                            })),
                    ),
            )
            .child(
                div()
                    .flex_1()
                    .min_h_0()
                    .relative()
                    .child(
                        div()
                            .id("right-panel-files-scroll")
                            .size_full()
                            .overflow_y_scroll()
                            .track_scroll(&self.right_panel_files_scroll_handle)
                            .child(list),
                    )
                    .child(scrollbar::vertical(
                        &self.right_panel_files_scroll_handle,
                        &self.right_panel_files_scrollbar,
                    )),
            )
    }

    pub(crate) fn render_right_panel_file(
        &mut self,
        relative_path: String,
        panel_width: f32,
        window: &mut Window,
        cx: &mut Context<Self>,
    ) -> Div {
        let theme = Theme::current(cx);
        let file_tree_width = fitted_file_tree_width(panel_width, self.right_panel_file_tree_width);
        let (editor_state, writable, dirty) =
            self.ensure_right_panel_file_editor(&relative_path, window, cx);

        // Markdown files carry the global source/preview toggle; every other
        // language always shows source.
        let is_markdown = file_highlighter_language(&relative_path) == "markdown";
        let preview = is_markdown && self.state.markdown_preview;
        let body = if preview {
            self.render_file_markdown_preview(&relative_path, &editor_state, cx)
        } else {
            self.render_file_editor_body(
                &relative_path,
                &editor_state,
                panel_width - file_tree_width,
                writable,
                window,
                cx,
            )
        };
        let preview_toggle = is_markdown.then(|| {
            let focus = self.transcript_control_focus("file-markdown-preview-toggle", cx);
            let (icon_path, label) = if preview {
                ("icons/pencil.svg", tr!("files.edit_markdown_source"))
            } else {
                ("icons/eye.svg", tr!("files.preview_markdown"))
            };
            div()
                .id("file-markdown-preview-toggle")
                .track_focus(&focus)
                .tab_index(0)
                .size(px(26.0))
                .rounded(px(7.0))
                .flex_none()
                .flex()
                .items_center()
                .justify_center()
                .cursor_pointer()
                .focus_visible(|style| style.border_1().border_color(theme.accent))
                .hover(|style| style.bg(theme.overlay))
                .child(icon(icon_path, 12.0, theme.text_tertiary))
                .tooltip(move |window, cx| Tooltip::new(label.clone()).build(window, cx))
                .on_click(cx.listener(|this, _, _, cx| this.toggle_markdown_preview(cx)))
                .on_key_down(cx.listener(|this, event: &KeyDownEvent, _, cx| {
                    if matches!(event.keystroke.key.as_str(), "enter" | "space") {
                        this.toggle_markdown_preview(cx);
                        cx.stop_propagation();
                    }
                }))
        });

        let copy_focus = self.transcript_control_focus("right-panel-copy-path", cx);
        let copy_path = relative_path.clone();
        let copy_button = div()
            .id("right-panel-copy-path")
            .track_focus(&copy_focus)
            .tab_index(0)
            .size(px(26.0))
            .rounded(px(7.0))
            .flex_none()
            .flex()
            .items_center()
            .justify_center()
            .cursor_pointer()
            .focus_visible(|style| style.border_1().border_color(theme.accent))
            .hover(|style| style.bg(theme.overlay))
            .child(icon("icons/copy.svg", 12.0, theme.text_tertiary))
            .tooltip(|window, cx| Tooltip::new(tr!("files.copy_path")).build(window, cx))
            .on_click(cx.listener(move |this, _, _, cx| {
                cx.write_to_clipboard(ClipboardItem::new_string(copy_path.clone()));
                this.show_toast(tr!("files.copied_path", path = copy_path.clone()));
            }))
            .on_key_down(cx.listener({
                let copy_path = relative_path.clone();
                move |this, event: &KeyDownEvent, _, cx| {
                    if matches!(event.keystroke.key.as_str(), "enter" | "space") {
                        cx.write_to_clipboard(ClipboardItem::new_string(copy_path.clone()));
                        this.show_toast(tr!("files.copied_path", path = copy_path.clone()));
                        cx.stop_propagation();
                    }
                }
            }));

        let segments: Vec<&str> = relative_path.split('/').collect();
        let file_name = segments.last().copied().unwrap_or(&relative_path);
        let dir_segments = &segments[..segments.len().saturating_sub(1)];

        let breadcrumb_trail = div()
            .min_w_0()
            .flex_1()
            .flex()
            .items_center()
            .gap(px(4.0))
            .overflow_hidden()
            .children(dir_segments.iter().map(|segment| {
                div()
                    .flex()
                    .items_center()
                    .gap(px(4.0))
                    .flex_none()
                    .child(
                        div()
                            .text_size(sp(12.5))
                            .text_color(theme.text_tertiary)
                            .child(segment.to_string()),
                    )
                    .child(
                        div()
                            .text_size(sp(12.0))
                            .text_color(theme.text_ghost)
                            .child("/"),
                    )
            }))
            .child(
                div()
                    .truncate()
                    .text_size(sp(12.5))
                    .font_weight(FontWeight::MEDIUM)
                    .text_color(theme.text)
                    .child(file_name.to_string()),
            )
            .when(dirty, |trail| {
                trail.child(
                    div()
                        .id("right-panel-file-breadcrumb-dirty")
                        .size(px(6.0))
                        .rounded_full()
                        .bg(theme.warning)
                        .flex_none()
                        .tooltip(|window, cx| {
                            Tooltip::new(tr!(
                                "files.unsaved_changes",
                                shortcut = crate::platform::primary_shortcut("⌘S", "Ctrl+S")
                            ))
                            .build(window, cx)
                        }),
                )
            });

        let editor = div()
            .flex_1()
            .min_h_0()
            .min_w_0()
            .flex()
            .flex_col()
            .child(
                div()
                    .h(px(42.0))
                    .flex_none()
                    .px(px(14.0))
                    .flex()
                    .items_center()
                    .gap(px(8.0))
                    .border_b_1()
                    .border_color(theme.border)
                    .child(file_icon(file_icon_for_path(&relative_path), 14.0))
                    .child(breadcrumb_trail)
                    .child(copy_button)
                    .children(preview_toggle),
            )
            .child(body);

        div()
            .flex_1()
            .min_h_0()
            .min_w_0()
            .flex()
            .child(editor)
            .child(
                div()
                    .w(px(file_tree_width))
                    .min_w(px(FILE_TREE_MIN_WIDTH))
                    .h_full()
                    .flex_none()
                    .flex()
                    .flex_col()
                    .relative()
                    .border_l_1()
                    .border_color(theme.border_strong)
                    .child(self.render_right_panel_working_tree(Some(&relative_path), cx))
                    .child(self.render_panel_resize_handle(
                        "right-panel-file-tree-resize-handle",
                        PanelResizeTarget::FileTree,
                        cx,
                    )),
            )
    }

    pub(crate) fn ensure_right_panel_file_editor(
        &mut self,
        relative_path: &str,
        window: &mut Window,
        cx: &mut Context<Self>,
    ) -> (Entity<TextInput>, bool, bool) {
        if let Some(editor) = self.right_panel_file_editors.get(relative_path) {
            return (editor.state.clone(), editor.writable, editor.dirty);
        }

        // Reached from `render`, so the file cannot be read here. The editor
        // starts empty and locked, and `read_right_panel_file_into_editor`
        // fills it in from the background executor a frame or two later.
        let language = file_highlighter_language(relative_path);
        let state = cx.new(|cx| {
            TextInput::new(window, cx)
                .multi_line()
                .syntax(Some(language))
                .read_only(true)
        });

        self.right_panel_file_editors.insert(
            relative_path.to_owned(),
            RightPanelFileEditor {
                state: state.clone(),
                disk_content: String::new(),
                writable: false,
                dirty: false,
                reading: false,
                read_epoch: 0,
            },
        );

        // Dirty tracking follows content edits. Observing raw notifies would
        // also fire for caret blinks and selection drags, cloning the whole
        // file's text for each one.
        let subscribed_path = relative_path.to_owned();
        cx.subscribe(
            &state,
            move |this: &mut Self, state, event: &InputEvent, cx| {
                if !matches!(event, InputEvent::Edited) {
                    return;
                }
                let value = state.read(cx).content().to_owned();
                if let Some(editor) = this
                    .right_panel_file_editors
                    .get_mut(subscribed_path.as_str())
                {
                    let dirty = editor.writable && value != editor.disk_content;
                    if editor.dirty != dirty {
                        editor.dirty = dirty;
                        cx.notify();
                    }
                }
                // Any content change — typing, a replace, a reload from disk —
                // moves the text out from under an open find's match list.
                this.refresh_file_search_for_edit(subscribed_path.as_str(), cx);
            },
        )
        .detach();

        let focused_path = relative_path.to_owned();
        cx.subscribe(&state, move |this: &mut Self, _, event: &InputEvent, cx| {
            if matches!(event, InputEvent::Focus) {
                this.reload_right_panel_file_if_clean(focused_path.as_str(), cx);
            }
        })
        .detach();

        self.read_right_panel_file_into_editor(relative_path.to_owned(), cx);
        (state, false, false)
    }

    /// Reads a file into its editor off the UI thread.
    ///
    /// One `read_to_string` of an arbitrarily large file — hundreds of frames
    /// for a big one — so it never runs in a frame. The editor keeps whatever
    /// it is already showing until the read lands.
    ///
    /// The result is applied only if the same session is still selected and the
    /// editor is still the one that asked, so a read started before a project
    /// or session switch cannot write another workspace's text into the view.
    pub(crate) fn read_right_panel_file_into_editor(
        &mut self,
        relative_path: String,
        cx: &mut Context<Self>,
    ) {
        let project_path = self
            .selected_workspace_path()
            .map(std::path::Path::to_path_buf);
        let (Some(project_path), Some(session_id)) = (project_path, self.state.selected_session)
        else {
            // Nothing to read from. Say so in the editor rather than leaving it
            // looking like an empty file.
            if let Some(editor) = self.right_panel_file_editors.get_mut(&relative_path) {
                editor.reading = false;
                editor.disk_content = tr!("files.no_project_is_open");
                editor.writable = false;
                let state = editor.state.clone();
                let content = editor.disk_content.clone();
                state.update(cx, |state, cx| state.set_content(content, cx));
            }
            return;
        };
        let Some(editor) = self.right_panel_file_editors.get_mut(&relative_path) else {
            return;
        };
        // A second asker would only duplicate the read and race to apply it.
        if editor.reading {
            return;
        }
        editor.reading = true;
        editor.read_epoch += 1;
        let epoch = editor.read_epoch;
        let workspace = padu_client::WorkspaceClient::new(self.daemon.client());

        cx.spawn(async move |padu, cx| {
            let read = cx
                .background_executor()
                .spawn({
                    let project_path = project_path.clone();
                    let relative_path = relative_path.clone();
                    async move { read_right_panel_file(&workspace, &project_path, &relative_path) }
                })
                .await;
            padu.update(cx, |padu, cx| {
                if padu.state.selected_session != Some(session_id)
                    || padu
                        .selected_workspace_path()
                        .is_none_or(|path| path != project_path)
                {
                    // The editor moved into another session's stored state, or
                    // the project changed. Clear the flag so a later reload can
                    // ask again, and drop the text.
                    if let Some(editor) = padu.right_panel_file_editors.get_mut(&relative_path) {
                        editor.reading = false;
                    }
                    return;
                }
                let (content, writable) = read;
                let Some(editor) = padu.right_panel_file_editors.get_mut(&relative_path) else {
                    return;
                };
                // A save landed while the read was in flight, so this text
                // describes the file as it was before that save.
                if editor.read_epoch != epoch {
                    return;
                }
                editor.reading = false;
                // An edit landed while the read was in flight; the user's text
                // wins over the copy on disk.
                if editor.dirty {
                    return;
                }
                if editor.disk_content == content && editor.writable == writable {
                    return;
                }
                editor.disk_content = content.clone();
                editor.writable = writable;
                editor.dirty = false;
                let state = editor.state.clone();
                state.update(cx, |state, cx| {
                    state.set_read_only(!writable);
                    state.set_content(content, cx);
                });
                cx.notify();
            })
            .ok();
        })
        .detach();
    }

    /// The editor body: a line-number gutter beside soft-wrapped text.
    ///
    /// The gutter is *painted*, not laid out — one canvas that shapes only the
    /// numbers currently on screen, the way Zed's editor element does. A div per
    /// line would put one layout node per line of the file in every frame, which
    /// is what made large files crawl.
    ///
    /// Row heights come from the text's measured layout rather than a nominal
    /// line height, so a soft-wrapped line still gets exactly one number and the
    /// two columns cannot drift apart down a long file.
    pub(crate) fn render_file_editor_body(
        &mut self,
        relative_path: &str,
        editor_state: &Entity<TextInput>,
        pane_width: f32,
        writable: bool,
        window: &mut Window,
        cx: &mut Context<Self>,
    ) -> Div {
        const GUTTER_PAD_RIGHT: f32 = 8.0;
        const CONTENT_PAD_TOP: f32 = 6.0;

        let text_size = self.state.code_font_size;
        let line_height = (text_size * 1.5).round();

        // An open find bar follows whichever file this body is showing; a
        // cheap comparison every frame, one recompute on the frame after the
        // visible file actually changes.
        self.sync_file_search_target(relative_path, cx);
        let find_bar = self.render_file_search_bar(pane_width, writable, window, cx);

        let theme = Theme::current(cx);
        let field = editor_state.read(cx);
        let line_count = field.content().split('\n').count().max(1);
        let heights = field.wrapped_line_heights();
        // A mono digit advances ~0.6em, so the gutter tracks the font size.
        let digit_width = (text_size * 0.6).ceil();
        let gutter_width = 20.0 + digit_width * (line_count.to_string().len() as f32);
        let content_height = if heights.is_empty() {
            px(line_height) * line_count as f32
        } else {
            heights.iter().fold(Pixels::ZERO, |total, h| total + *h)
        };

        let viewport = self.right_panel_editor_scroll_handle.clone();
        let number_color = theme.text_ghost;
        let gutter = canvas(
            |_, _, _| (),
            move |bounds: gpui::Bounds<Pixels>, _, window: &mut Window, cx: &mut App| {
                let visible = viewport.bounds();
                let mut y = bounds.origin.y;
                for number in 1..=line_count {
                    let height = heights
                        .get(number - 1)
                        .copied()
                        .unwrap_or_else(|| px(line_height));
                    // Everything below the viewport is unreachable from here on.
                    if y > visible.bottom() {
                        break;
                    }
                    if y + height >= visible.top() {
                        let text = SharedString::from(number.to_string());
                        let run = gpui::TextRun {
                            len: text.len(),
                            font: gpui::font(md::render::MONO_FAMILY),
                            color: number_color,
                            ..Default::default()
                        };
                        let line =
                            window
                                .text_system()
                                .shape_line(text, px(text_size), &[run], None);
                        let origin = point(bounds.right() - line.width, y);
                        let _ = line.paint(
                            origin,
                            px(line_height),
                            gpui::TextAlign::Left,
                            None,
                            window,
                            cx,
                        );
                    }
                    y += height;
                }
            },
        )
        .flex_none()
        .w(px(gutter_width - GUTTER_PAD_RIGHT))
        .h(content_height);

        // The find bar sits in normal flow above the scroll region — Zed's
        // buffer-search arrangement — so an open bar pushes the content and
        // its line-number gutter down instead of covering the first lines.
        div()
            .key_context("FileEditorPane")
            .flex_1()
            .min_h_0()
            .flex()
            .flex_col()
            .bg(theme.surface)
            .font_family(md::render::MONO_FAMILY)
            .text_size(px(text_size))
            .line_height(px(line_height))
            .children(find_bar)
            .child(
                div()
                    .flex_1()
                    .min_h_0()
                    .relative()
                    .child(
                        div()
                            .id(SharedString::from(format!("file-editor-{relative_path}")))
                            .size_full()
                            .overflow_y_scroll()
                            .track_scroll(&self.right_panel_editor_scroll_handle)
                            .child(
                                div()
                                    .w_full()
                                    .pt(px(CONTENT_PAD_TOP))
                                    .pb(px(CONTENT_PAD_TOP))
                                    .flex()
                                    .items_start()
                                    .child(gutter)
                                    .child(div().w(px(GUTTER_PAD_RIGHT)).flex_none())
                                    .child(
                                        div()
                                            .flex_1()
                                            .min_w_0()
                                            .pr(px(10.0))
                                            .child(editor_state.clone()),
                                    ),
                            ),
                    )
                    .child(scrollbar::vertical(
                        &self.right_panel_editor_scroll_handle,
                        &self.right_panel_editor_scrollbar,
                    )),
            )
    }

    /// Flips the global markdown source/preview mode and persists it, so the
    /// choice follows the user across files and sessions.
    pub(crate) fn toggle_markdown_preview(&mut self, cx: &mut Context<Self>) {
        self.state.markdown_preview = !self.state.markdown_preview;
        self.save();
        cx.notify();
    }

    /// The rendered-markdown alternative to the editor body, shown while the
    /// global preview toggle is on. It renders the editor's current text —
    /// unsaved edits included — with the transcript's markdown engine; the
    /// parse is cached per path, so re-rendering an unchanged document costs
    /// `Rc` clones, not a re-parse. Reads only in-memory editor state: the
    /// render path may not touch the filesystem.
    pub(crate) fn render_file_markdown_preview(
        &mut self,
        relative_path: &str,
        editor_state: &Entity<TextInput>,
        cx: &mut Context<Self>,
    ) -> Div {
        let theme = Theme::current(cx);
        let palette = MarkdownPalette::from_theme(&theme);
        let mut cache = self.file_preview_markdown.borrow_mut();
        if !matches!(cache.as_ref(), Some((cached, _)) if cached == relative_path) {
            *cache = Some((relative_path.to_owned(), MarkdownView::new()));
        }
        let (_, view) = cache.as_mut().expect("entry ensured above");
        view.set_text(editor_state.read(cx).content(), false);
        let ctx = MarkdownCtx::new(
            format!("file-preview-{relative_path}"),
            &palette,
            MarkdownMetrics::document(self.state.ui_font_size, self.state.code_font_size),
            self.file_preview_selection.clone(),
        )
        .with_link_handler(self.markdown_link_handler.clone());
        let document = md::render::markdown(view, &ctx);

        let selection_input = {
            let selection = self.file_preview_selection.clone();
            canvas(
                |_, _, _| (),
                move |_, _, window, _| md::render::install_selection_input(window, &selection),
            )
            .absolute()
            .w(px(0.0))
            .h(px(0.0))
        };

        div()
            .flex_1()
            .min_h_0()
            .relative()
            .bg(theme.surface)
            .child(
                div()
                    .id(SharedString::from(format!("file-preview-{relative_path}")))
                    .size_full()
                    .overflow_y_scroll()
                    .track_scroll(&self.file_preview_scroll_handle)
                    // Painted before the document, so the frame's selection
                    // registry holds exactly this frame's text elements.
                    .child(md::render::frame_reset(self.file_preview_selection.clone()))
                    .child(
                        div()
                            .px(px(16.0))
                            .pt(px(14.0))
                            .pb(px(24.0))
                            .text_color(theme.text)
                            .children(document),
                    ),
            )
            .child(selection_input)
            .child(scrollbar::vertical(
                &self.file_preview_scroll_handle,
                &self.file_preview_scrollbar,
            ))
    }

    /// Picks up an external edit to a file the user has not modified here.
    ///
    /// Reaches the filesystem, so it queues a background read rather than
    /// blocking; the editor keeps showing its current text until that lands.
    pub(crate) fn reload_right_panel_file_if_clean(
        &mut self,
        relative_path: &str,
        cx: &mut Context<Self>,
    ) {
        if self
            .right_panel_file_editors
            .get(relative_path)
            .is_none_or(|editor| editor.dirty)
        {
            return;
        }
        self.read_right_panel_file_into_editor(relative_path.to_owned(), cx);
    }

    pub(crate) fn reload_clean_right_panel_file_editors(&mut self, cx: &mut Context<Self>) {
        let paths = self
            .right_panel_file_editors
            .iter()
            .filter(|(_, editor)| !editor.dirty)
            .map(|(path, _)| path.clone())
            .collect::<Vec<_>>();
        for path in paths {
            self.reload_right_panel_file_if_clean(&path, cx);
        }
    }

    pub(crate) fn save_right_panel_file_action(
        &mut self,
        _: &SaveFile,
        _: &mut Window,
        cx: &mut Context<Self>,
    ) {
        let Some(relative_path) = self.visible_right_panel_file_path() else {
            return;
        };
        let Some(project_path) = self
            .selected_workspace_path()
            .map(std::path::Path::to_path_buf)
        else {
            return;
        };
        let Some(editor) = self.right_panel_file_editors.get(&relative_path) else {
            return;
        };
        if !editor.writable {
            self.show_toast(if editor.reading {
                tr!("files.could_not_save_opening", path = relative_path)
            } else {
                tr!("files.could_not_save_read_only", path = relative_path)
            });
            cx.notify();
            return;
        }

        let content = editor.state.read(cx).content().to_owned();
        let Some(session_id) = self.state.selected_session else {
            return;
        };
        let epoch = if let Some(editor) = self.right_panel_file_editors.get_mut(&relative_path) {
            editor.reading = false;
            editor.read_epoch += 1;
            editor.read_epoch
        } else {
            return;
        };
        let workspace = padu_client::WorkspaceClient::new(self.daemon.client());
        cx.spawn(async move |padu, cx| {
            let result = cx
                .background_executor()
                .spawn({
                    let project_path = project_path.clone();
                    let relative_path = relative_path.clone();
                    let content = content.clone();
                    async move {
                        match workspace.request(padu_client::WorkspaceOperation::WriteTextFile {
                            root: project_path,
                            relative_path: PathBuf::from(relative_path),
                            content,
                        })? {
                            padu_client::WorkspaceResult::Ack => Ok(()),
                            _ => anyhow::bail!("the daemon returned an invalid file response"),
                        }
                    }
                })
                .await;
            let _ = padu.update(cx, |padu, cx| {
                if padu.state.selected_session != Some(session_id)
                    || padu
                        .selected_workspace_path()
                        .is_none_or(|path| path != project_path)
                {
                    return;
                }
                match result {
                    Ok(()) => {
                        if let Some(editor) = padu.right_panel_file_editors.get_mut(&relative_path)
                            && editor.read_epoch == epoch
                        {
                            let current = editor.state.read(cx).content();
                            editor.disk_content = content.clone();
                            editor.dirty = current != content;
                        }
                    }
                    Err(error) => padu.show_toast(tr!(
                        "files.could_not_save",
                        path = relative_path,
                        error = error.to_string()
                    )),
                }
                cx.notify();
            });
        })
        .detach();
    }

    /// Re-reads whichever workspace surface is on screen.
    pub(crate) fn refresh_workspace_surfaces(&mut self, cx: &mut Context<Self>) {
        match self.active_right_panel_surface() {
            Some(RightPanelSurface::Diff) => self.refresh_right_panel_diff(cx),
            Some(RightPanelSurface::Files | RightPanelSurface::File(_)) => {
                self.refresh_right_panel_working_tree(cx)
            }
            _ => {}
        }
    }

    pub(crate) fn begin_file_operation_dialog(
        &mut self,
        kind: FileOperationDialogKind,
        window: &mut Window,
        cx: &mut Context<Self>,
    ) {
        let initial = match &kind {
            FileOperationDialogKind::Rename { source } => source
                .file_name()
                .and_then(|name| name.to_str())
                .unwrap_or_default()
                .to_owned(),
            _ => String::new(),
        };
        let input =
            cx.new(|cx| TextInput::new(window, cx).placeholder(tr!("files.name_placeholder")));
        if !initial.is_empty() {
            input.update(cx, |input, cx| input.set_content(initial, cx));
        }
        let focus = input.read(cx).focus();
        let focus_target = focus.clone();
        let previous_focus = window.focused(cx);
        self.right_panel_file_operation_dialog = Some(FileOperationDialog {
            kind,
            input,
            focus,
            previous_focus,
        });
        window.on_next_frame(move |window, cx| window.focus(&focus_target, cx));
        cx.notify();
    }

    pub(crate) fn close_file_operation_dialog(
        &mut self,
        window: &mut Window,
        cx: &mut Context<Self>,
    ) {
        let Some(dialog) = self.right_panel_file_operation_dialog.take() else {
            return;
        };
        if let Some(previous_focus) = dialog.previous_focus {
            window.focus(&previous_focus, cx);
        }
        cx.notify();
    }

    pub(crate) fn submit_file_operation_dialog(
        &mut self,
        window: &mut Window,
        cx: &mut Context<Self>,
    ) {
        let Some(dialog) = self.right_panel_file_operation_dialog.take() else {
            return;
        };
        let name = dialog.input.read(cx).content().trim().to_owned();
        if name.is_empty() || Path::new(&name).components().count() != 1 {
            self.show_toast(tr!("files.invalid_name"));
            self.right_panel_file_operation_dialog = Some(dialog);
            cx.notify();
            return;
        }
        let Some(root) = self.selected_workspace_path().map(Path::to_path_buf) else {
            return;
        };
        let operation = match dialog.kind {
            FileOperationDialogKind::CreateFile { parent } => {
                let Ok(parent) = parent.strip_prefix(&root) else {
                    return;
                };
                padu_client::WorkspaceOperation::CreateFile {
                    root: root.clone(),
                    relative_path: parent.join(&name),
                }
            }
            FileOperationDialogKind::CreateDirectory { parent } => {
                let Ok(parent) = parent.strip_prefix(&root) else {
                    return;
                };
                padu_client::WorkspaceOperation::CreateDirectory {
                    root: root.clone(),
                    relative_path: parent.join(&name),
                }
            }
            FileOperationDialogKind::Rename { source } => {
                let Ok(source_relative) = source.strip_prefix(&root) else {
                    return;
                };
                let Some(parent) = source_relative.parent() else {
                    return;
                };
                padu_client::WorkspaceOperation::RenamePath {
                    root: root.clone(),
                    from: source_relative.to_path_buf(),
                    to: parent.join(&name),
                }
            }
        };
        let workspace = padu_client::WorkspaceClient::new(self.daemon.client());
        cx.spawn(async move |padu, cx| {
            let result = cx
                .background_executor()
                .spawn(async move { workspace.request(operation) })
                .await;
            let _ = padu.update(cx, |padu, cx| {
                match result {
                    Ok(padu_client::WorkspaceResult::Ack) => {
                        padu.refresh_right_panel_working_tree(cx);
                    }
                    Ok(_) | Err(_) => padu.show_toast(tr!("files.operation_failed")),
                }
                cx.notify();
            });
        })
        .detach();
        window.focus(
            &self.transcript_control_focus("right-panel-working-tree", cx),
            cx,
        );
        cx.notify();
    }

    pub(crate) fn delete_right_panel_path(&mut self, path: PathBuf, cx: &mut Context<Self>) {
        let Some(root) = self.selected_workspace_path().map(Path::to_path_buf) else {
            return;
        };
        let Ok(relative_path) = path.strip_prefix(&root) else {
            return;
        };
        let workspace = padu_client::WorkspaceClient::new(self.daemon.client());
        let operation = padu_client::WorkspaceOperation::DeletePath {
            root: root.clone(),
            relative_path: relative_path.to_path_buf(),
        };
        cx.spawn(async move |padu, cx| {
            let result = cx
                .background_executor()
                .spawn(async move { workspace.request(operation) })
                .await;
            let _ = padu.update(cx, |padu, cx| {
                match result {
                    Ok(padu_client::WorkspaceResult::Ack) => {
                        padu.refresh_right_panel_working_tree(cx)
                    }
                    _ => padu.show_toast(tr!("files.operation_failed")),
                }
                cx.notify();
            });
        })
        .detach();
    }

    pub(crate) fn render_file_operation_dialog(
        &mut self,
        _window: &mut Window,
        cx: &mut Context<Self>,
    ) -> Option<AnyElement> {
        let dialog = self.right_panel_file_operation_dialog.as_ref()?;
        let theme = Theme::current(cx);
        let title = match dialog.kind {
            FileOperationDialogKind::CreateFile { .. } => tr!("files.new_file"),
            FileOperationDialogKind::CreateDirectory { .. } => tr!("files.new_folder"),
            FileOperationDialogKind::Rename { .. } => tr!("common.rename"),
        };
        let cancel = div()
            .id("file-operation-cancel")
            .track_focus(&dialog.focus)
            .tab_index(0)
            .px(px(12.0))
            .py(px(7.0))
            .rounded(px(7.0))
            .cursor_pointer()
            .text_color(theme.text_secondary)
            .child(tr!("common.cancel"))
            .on_click(
                cx.listener(|this, _, window, cx| this.close_file_operation_dialog(window, cx)),
            );
        let confirm = div()
            .id("file-operation-confirm")
            .tab_index(0)
            .px(px(12.0))
            .py(px(7.0))
            .rounded(px(7.0))
            .cursor_pointer()
            .bg(theme.inverse)
            .text_color(theme.on_inverse)
            .child(tr!("files.confirm"))
            .on_click(
                cx.listener(|this, _, window, cx| this.submit_file_operation_dialog(window, cx)),
            );
        let card = div()
            .id("file-operation-dialog")
            .w(px(380.0))
            .p(px(18.0))
            .gap(px(12.0))
            .flex()
            .flex_col()
            .rounded(px(14.0))
            .bg(theme.surface)
            .border_1()
            .border_color(theme.border)
            .shadow_lg()
            .on_mouse_down(MouseButton::Left, |_, _, cx| cx.stop_propagation())
            .child(
                div()
                    .text_size(sp(15.0))
                    .font_weight(FontWeight::SEMIBOLD)
                    .text_color(theme.text)
                    .child(title),
            )
            .child(dialog.input.clone())
            .child(
                div()
                    .flex()
                    .justify_end()
                    .gap(px(8.0))
                    .child(cancel)
                    .child(confirm),
            )
            .on_key_down(cx.listener(|this, event: &KeyDownEvent, window, cx| {
                match event.keystroke.key.as_str() {
                    "enter" => this.submit_file_operation_dialog(window, cx),
                    "escape" => this.close_file_operation_dialog(window, cx),
                    _ => {}
                }
            }));
        Some(
            div()
                .id("file-operation-layer")
                .absolute()
                .inset_0()
                .occlude()
                .bg(gpui::hsla(0.0, 0.0, 0.0, 0.2))
                .flex()
                .items_center()
                .justify_center()
                .child(card)
                .into_any_element(),
        )
    }

    pub(crate) fn toggle_right_panel_hidden_files(&mut self, cx: &mut Context<Self>) {
        self.right_panel_show_hidden_files = !self.right_panel_show_hidden_files;
        self.refresh_right_panel_working_tree(cx);
        cx.notify();
    }

    /// Re-walks the project's working tree.
    ///
    /// `read_dir` plus a `stat` per entry, recursively over expanded
    /// directories — filesystem I/O, so it runs on the background executor and
    /// the panel keeps drawing the previous listing until the result lands.
    /// Called when the tree's inputs change, never from a frame.
    pub(crate) fn refresh_right_panel_working_tree(&mut self, cx: &mut Context<Self>) {
        let Some(project_path) = self
            .selected_workspace_path()
            .map(std::path::Path::to_path_buf)
        else {
            self.right_panel_working_tree.clear();
            return;
        };
        // The tree on disk moves under us, and the expanded set may just have
        // changed, so a cached listing is only good until something asks again.
        self.working_trees.invalidate(&project_path);
        match self.working_trees.read(&project_path) {
            Query::Ready(entries) => self.right_panel_working_tree = (*entries).clone(),
            Query::Pending => {}
            Query::Missing(token) => {
                let expanded = self.right_panel_expanded_paths.clone();
                let show_hidden = self.right_panel_show_hidden_files;
                let workspace = padu_client::WorkspaceClient::new(self.daemon.client());
                cx.spawn(async move |padu, cx| {
                    let entries = cx
                        .background_executor()
                        .spawn({
                            let path = project_path.clone();
                            async move {
                                match workspace.request(padu_client::WorkspaceOperation::ListTree {
                                    root: path,
                                    expanded_paths: expanded.into_iter().collect(),
                                    show_hidden,
                                }) {
                                    Ok(padu_client::WorkspaceResult::WorkingTree { entries }) => {
                                        entries
                                            .into_iter()
                                            .map(|entry| WorkingTreeEntry {
                                                file_icon: (!entry.is_dir)
                                                    .then(|| file_icon_for_name(&entry.name)),
                                                relative_path: entry.relative_path,
                                                absolute_path: entry.absolute_path,
                                                name: entry.name,
                                                is_dir: entry.is_dir,
                                                is_ignored: entry.is_ignored,
                                                expanded: entry.expanded,
                                                depth: entry.depth,
                                            })
                                            .collect()
                                    }
                                    Ok(_) | Err(_) => Vec::new(),
                                }
                            }
                        })
                        .await;
                    padu.update(cx, |padu, cx| {
                        if padu.working_trees.fulfill(token, entries.clone())
                            && padu
                                .selected_workspace_path()
                                .is_some_and(|path| path == project_path)
                        {
                            padu.right_panel_working_tree = entries;
                            cx.notify();
                        }
                    })
                    .ok();
                })
                .detach();
            }
        }
    }
}
