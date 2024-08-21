document.addEventListener('DOMContentLoaded', function () {
  const stars = document.querySelectorAll('.star') as NodeListOf<HTMLElement>;
  if (!stars || stars.length === 0) {
    return;
  }

  const starRatingInput = document.getElementById(
    'starRating',
  ) as HTMLInputElement | null;

  if (!starRatingInput) {
    return;
  }

  stars.forEach((star, index) => {
    star.addEventListener('click', () => {
      starRatingInput.value = String(index + 1);
      stars.forEach((s, i) => {
        s.style.color = i <= index ? 'gold' : 'gray';
      });
    });
  });
});
