document.addEventListener('DOMContentLoaded', () => {
  const sideNavButton = document.getElementById('side-nav-opener');
  if (!sideNavButton) {
    return;
  }

  const sideNav = document.getElementById('side-nav');
  if (!sideNav) {
    return;
  }

  sideNavButton.addEventListener('click', () => {
    sideNav.classList.toggle('hidden');
    sideNav.classList.toggle('flex flex-col');
  });
});
