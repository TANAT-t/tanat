document.addEventListener("DOMContentLoaded", function () {
    const indexContainer = document.querySelector('[page-url="indice-1"]'); // Select the index container
    const indexLinks = indexContainer.querySelectorAll("a[href^='#']");
    const sections = [];

    indexLinks.forEach(link => {
        const targetId = link.getAttribute("href").substring(1);
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            sections.push({ link, section: targetSection });
        }
    });

    function highlightCurrentSection() {
        let scrollPosition = window.scrollY;
        let viewportHeight = window.innerHeight;
        let middleOfViewport = scrollPosition + viewportHeight / 2;
        
        let currentSection = null;

        sections.forEach(({ link, section }) => {
            let sectionTop = section.offsetTop;
            let sectionHeight = section.offsetHeight;

            if (middleOfViewport >= sectionTop && middleOfViewport < sectionTop + sectionHeight) {
                currentSection = link;
            }
        });

        indexLinks.forEach(link => link.classList.remove("active"));
        if (currentSection) {
            currentSection.classList.add("active");
        }
    }

    window.addEventListener("scroll", highlightCurrentSection);
    highlightCurrentSection(); // Run once on page load
});
