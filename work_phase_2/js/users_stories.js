import { setupMenu } from './modules/menu.js';
import { showTooltip } from './modules/show_tooltip.js';
document.addEventListener("DOMContentLoaded", () => {
    setupMenu();
});
showTooltip("interactive-highlight-stories");