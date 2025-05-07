function showTooltip(configClass) {
    document.addEventListener("DOMContentLoaded", () => {
        const HIGHLIGHT_CLASS = configClass;
        const SHOW_TOOLTIP_CLASS = "show-tooltip";

        const highlights = document.querySelectorAll(`.${HIGHLIGHT_CLASS}`);

        highlights.forEach((el) => {
            el.addEventListener("click", (e) => {
                e.stopPropagation();

                document
                    .querySelectorAll(
                        `.${HIGHLIGHT_CLASS}.${SHOW_TOOLTIP_CLASS}`
                    )
                    .forEach((e) => e.classList.remove(SHOW_TOOLTIP_CLASS));

                el.classList.add(SHOW_TOOLTIP_CLASS);
            });
        });

        document.addEventListener("click", () => {
            document
                .querySelectorAll(`.${HIGHLIGHT_CLASS}.${SHOW_TOOLTIP_CLASS}`)
                .forEach((e) => e.classList.remove(SHOW_TOOLTIP_CLASS));
        });
    });
}
export { showTooltip };
