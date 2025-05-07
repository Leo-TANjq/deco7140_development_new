function toggleDropdown(button) {
    const arrow = button.querySelector('.arrow');
    const text = button.querySelector('.text');
    const box = button.nextElementSibling;  // 获取紧接着按钮的内容


    const isExpanded = button.getAttribute('aria-expanded') === 'true';

    if (isExpanded) {
        box.style.display = 'none';
        arrow.textContent = '▶';
        text.textContent = 'Show';
        button.setAttribute('aria-expanded', 'false');
    } else {
        box.style.display = 'block';
        arrow.textContent = '▼';
        text.textContent = 'Hide';
        button.setAttribute('aria-expanded', 'true');
    }
}

export { toggleDropdown };
