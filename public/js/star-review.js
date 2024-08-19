"use strict";
document.addEventListener('DOMContentLoaded', function () {
    const stars = document.querySelectorAll('.star');
    const starRatingInput = document.getElementById('starRating');
    if (!starRatingInput) {
        throw new Error('Could not find star rating input');
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
//# sourceMappingURL=star-review.js.map