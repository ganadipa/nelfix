"use strict";
document.addEventListener('DOMContentLoaded', () => {
    const trendings = document.querySelectorAll('#trendings > div');
    let currentIndex = 0;
    const intervalTime = 5000;
    const showNextTrending = () => {
        trendings[currentIndex].classList.add('opacity-0');
        trendings[currentIndex].classList.remove('z-10');
        currentIndex = (currentIndex + 1) % trendings.length;
        setTimeout(() => {
            trendings[currentIndex].classList.remove('opacity-0');
            trendings[currentIndex].classList.add('z-10');
        }, 100);
    };
    trendings[currentIndex].classList.remove('opacity-0');
    trendings[currentIndex].classList.add('z-10');
    setInterval(showNextTrending, intervalTime);
});
//# sourceMappingURL=trendings.js.map