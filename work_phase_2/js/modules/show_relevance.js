function setupHighlightCardEffect(configClass) {
    document.addEventListener("DOMContentLoaded", () => {
        const highlights = document.querySelectorAll(`.${configClass}`);
        highlights.forEach((el) => {
            const targetIds = el.dataset.target.split(',').map(id => id.trim());
            const targetCards = targetIds.map(id => document.getElementById(id));

            el.addEventListener("mouseenter", () => {
                targetCards.forEach(card => card?.classList.add('active'));
            });

            el.addEventListener("mouseleave", () => {
                targetCards.forEach(card => card?.classList.remove('active'));
            });
        });
    });
}
export { setupHighlightCardEffect };