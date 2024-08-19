"use strict";
document.addEventListener('DOMContentLoaded', () => {
    const inputContainers = document.querySelectorAll('div[data-tag="input-container"]');
    if (inputContainers.length === 0) {
        return;
    }
    // Loop through the NodeList
    Array.from(inputContainers).forEach((inputContainer) => {
        const container = inputContainer;
        const label = container.querySelector('label');
        const input = container.querySelector('input');
        if (label && input) {
            // Handle the focus event
            input.addEventListener('focus', () => {
                label.classList.remove('text-xl');
                label.classList.add('text-xs');
                input.classList.remove('h-0');
            });
            // Handle the blur event
            input.addEventListener('blur', () => {
                if (input.value === '') {
                    label.classList.remove('text-xs');
                    label.classList.add('text-xl');
                    input.classList.add('h-0');
                }
            });
            // Handle the click event on the container to focus the input
            container.addEventListener('click', (event) => {
                if (event.target === container) {
                    input.focus();
                }
            });
        }
    });
});
//# sourceMappingURL=input.js.map