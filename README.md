# Sidebar Swipe

Adds swipe gestures for the Agent Zero WebUI left sidebar on mobile devices, as a complement to the existing hamburger toggle button.

## Features

- **Swipe from the left edge to the right** (starting within 40 px of the edge) opens the sidebar.
- **Swipe to the left** while the sidebar is open closes it.
- Works together with the existing `#toggle-sidebar` button, the sidebar overlay, and all sidebar sections (chats, tasks, plugins, preferences).

## Safety guards

- Only active when the viewport is 768 px wide or narrower (same breakpoint as the built-in `sidebar.isMobile()`).
- Ignored while a modal or overlay is open.
- Ignored for touches that start in `input`, `textarea`, `select`, or `contenteditable` elements.
- Ignored inside horizontally scrollable containers.
- Aborted when vertical movement dominates, so normal page scrolling and vertical list scrolling keep working.

## Installation

### Plugin Hub

Install **Sidebar Swipe** from the Agent Zero Plugin Hub (once the index entry is merged).

### Manual

Clone or copy this repository to your Agent Zero user plugins directory so that `plugin.yaml` ends up at the plugin root:

```bash
cd /a0/usr/plugins
git clone https://github.com/axbitinfo-jpg/sidebar_swipe.git sidebar_swipe
```

Reload the WebUI after installing.

## Configuration

No settings are required. Tuning constants live at the top of `extensions/webui/initFw_end/sidebar-swipe.js`:

| Constant | Default | Meaning |
|---|---|---|
| `EDGE_ZONE_PX` | `40` | How close to the left edge a swipe must start to open the sidebar |
| `OPEN_THRESHOLD_PX` | `60` | Horizontal distance required to open |
| `CLOSE_THRESHOLD_PX` | `60` | Horizontal distance required to close |
| `MAX_VERTICAL_DRIFT` | `60` | Vertical movement that aborts the gesture |

Edit the file and reload the WebUI to apply changes.

## External services and costs

None. The plugin is pure frontend JavaScript, makes no network requests, sends no data anywhere, and has no dependencies.

## Known limitations

- Depends on the current Agent Zero sidebar store module path (`/components/sidebar/sidebar-store.js`). If a future Agent Zero release moves or renames that store, the extension must be updated.
- Browsers and operating systems that own the left-edge swipe gesture (for example system back-navigation) may intercept the touch before the page sees it. This is platform behavior and cannot be overridden from the WebUI.
- No visual drag-follow animation: the sidebar opens or closes on release. This keeps the change small and avoids fighting existing CSS transitions.

## Cleanup / uninstall

Disable or delete the plugin from the plugin list, or remove the plugin directory:

```bash
rm -rf /a0/usr/plugins/sidebar_swipe
```

No data, configuration, services, or files outside the plugin directory are created, so removal is complete.

## License

MIT — see [LICENSE](LICENSE).
