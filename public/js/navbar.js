"use strict";
document.addEventListener('DOMContentLoaded', () => {
    const sideNavButton = document.getElementById('side-nav-opener');
    if (!sideNavButton) {
        return;
    }
    const sideNav = document.getElementById('side-nav');
    if (!sideNav) {
        return;
    }
    sideNavButton.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent the click from propagating to the document
        sideNav.classList.toggle('hidden');
        sideNav.classList.toggle('flex');
        sideNav.classList.toggle('flex-col');
    });
    document.addEventListener('click', (e) => {
        const target = e.target;
        const isClickInsideNav = sideNav.contains(target);
        const isClickOnButton = sideNavButton.contains(target);
        if (!isClickInsideNav &&
            !isClickOnButton &&
            !sideNav.classList.contains('hidden')) {
            sideNav.classList.add('hidden');
            sideNav.classList.remove('flex');
            sideNav.classList.remove('flex-col');
        }
    });
    const sideNavCloser = document.getElementById('side-nav-closer');
    if (!sideNavCloser) {
        return;
    }
    sideNavCloser.addEventListener('click', (e) => {
        sideNav.classList.add('hidden');
        sideNav.classList.remove('flex');
        sideNav.classList.remove('flex-col');
    });
});
//# sourceMappingURL=navbar.js.map