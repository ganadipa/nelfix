document.addEventListener('DOMContentLoaded', () => {
  const logoutButton = document.getElementById('logout') as HTMLButtonElement;
  if (!logoutButton) {
    return;
  }

  logoutButton.addEventListener('click', async () => {
    const response = await fetch('/api/logout', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();

    if (data.status === 'success') {
      location.reload();
    }
  });
});
