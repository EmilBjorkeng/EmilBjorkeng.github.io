const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        } else {
            entry.target.classList.remove('show');
        }
    });
});

const parentElements = document.querySelectorAll('.point');
parentElements.forEach((parent) => {
    Array.from(parent.children).forEach((targetedElements) => {
        observer.observe(targetedElements);
    });
});