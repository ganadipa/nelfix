"use strict";
document.addEventListener('DOMContentLoaded', function () {
    const stars = document.querySelectorAll('.star');
    if (!stars || stars.length === 0) {
        return;
    }
    const starRatingInput = document.getElementById('starRating');
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
//# sourceMappingURL=star-review.js.map