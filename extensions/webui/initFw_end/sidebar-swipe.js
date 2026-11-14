import { store as sidebarStore } from "/components/sidebar/sidebar-store.js";

// Swipe gestures for the left sidebar on touch devices.
// Complements the #toggle-sidebar button; does not replace it.

const EDGE_ZONE_PX = 40;      // swipe must start within this distance from the left edge to open
const OPEN_THRESHOLD_PX = 60; // horizontal distance required to open
const CLOSE_THRESHOLD_PX = 60; // horizontal distance required to close
const MAX_VERTICAL_DRIFT = 60; // abort if vertical movement dominates

let installed = false;
let tracking = false;
let startX = 0;
let startY = 0;
let trackingId = null;

function isMobile() {
  return window.innerWidth <= 768;
}

function modalOpen() {
  if (document.querySelector(".modal.show, .modal-container.show")) return true;
  // Some overlays (e.g. full-screen input) are toggled with x-show instead of .show
  return Array.from(document.querySelectorAll(".modal-overlay, .modal-backdrop")).some(
    (el) => el.offsetParent !== null && getComputedStyle(el).display !== "none"
  );
}

function isEditableTarget(target) {
  if (!(target instanceof Element)) return false;
  return !!target.closest(
    "input, textarea, select, [contenteditable=''], [contenteditable='true']"
  );
}

function inHorizontalScroller(target) {
  if (!(target instanceof Element)) return false;
  let el = target;
  while (el && el !== document.body && el !== document.documentElement) {
    if (el.scrollWidth > el.clientWidth + 4) {
      const overflowX = getComputedStyle(el).overflowX;
      if (overflowX === "auto" || overflowX === "scroll") return true;
    }
    el = el.parentElement;
  }
  return false;
}

function onTouchStart(event) {
  if (!isMobile()) return;
  if (event.touches.length !== 1) return;
  if (modalOpen()) return;
  if (!sidebarStore || !sidebarStore.isMobile?.()) return;
  if (isEditableTarget(event.target)) return;
  if (inHorizontalScroller(event.target)) return;

  const touch = event.touches[0];
  const open = sidebarStore.isOpen === true;

  // Opening: must start near the left edge.
  if (!open && touch.clientX > EDGE_ZONE_PX) return;

  tracking = true;
  trackingId = touch.identifier;
  startX = touch.clientX;
  startY = touch.clientY;
}

function onTouchMove(event) {
  if (!tracking) return;
  const touch = Array.from(event.touches).find((t) => t.identifier === trackingId);
  if (!touch) return;

  const dx = touch.clientX - startX;
  const dy = touch.clientY - startY;

  if (Math.abs(dy) > MAX_VERTICAL_DRIFT && Math.abs(dy) > Math.abs(dx)) {
    tracking = false;
  }
}

function onTouchEnd(event) {
  if (!tracking) return;
  tracking = false;

  const touch = Array.from(event.changedTouches).find(
    (t) => t.identifier === trackingId
  );
  if (!touch) return;

  const dx = touch.clientX - startX;
  const dy = touch.clientY - startY;

  if (Math.abs(dy) > Math.abs(dx)) return;
  if (!sidebarStore || !sidebarStore.isMobile?.()) return;

  const open = sidebarStore.isOpen === true;

  if (!open && dx >= OPEN_THRESHOLD_PX) {
    sidebarStore.isOpen = true;
    return;
  }

  if (open && dx <= -CLOSE_THRESHOLD_PX) {
    sidebarStore.close();
  }
}

function onTouchCancel() {
  tracking = false;
}

export default function initSidebarSwipe() {
  if (installed) return;
  installed = true;

  document.addEventListener("touchstart", onTouchStart, { passive: true });
  document.addEventListener("touchmove", onTouchMove, { passive: true });
  document.addEventListener("touchend", onTouchEnd, { passive: true });
  document.addEventListener("touchcancel", onTouchCancel, { passive: true });
}
