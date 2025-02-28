document.addEventListener("DOMContentLoaded", function () {
    // Select the index panel using the correct ID
    const index = document.querySelector("#X3666749238");
    
    if (!index) {
        console.error("Index panel not found! Check your Cargo setup.");
        return;
    }
    
    console.log("Index panel found:", index);

    // Select all the links inside the index
    const indexLinks = index.querySelectorAll("a[href^='#']");
    
    if (indexLinks.length === 0) {
        console.error("No links found in the index.");
        return;
    }
    
    console.log("Index links found:", indexLinks);

    // Create an intersection observer to detect section visibility
    const sections = Array.from(indexLinks).map(link => {
        const sectionID = link.getAttribute("href").substring(1);
        return document.querySelector(`[id="${sectionID}"]`);
    }).filter(section => section !== null);

    if (sections.length === 0) {
        console.error("No matching sections found for index links.");
        return;
    }
    
    console.log("Sections found:", sections);

    const observerOptions = {
        root: null, // viewport
        rootMargin: "0px",
        threshold: 0.5 // Trigger when 50% of the section is visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove 'active' class from all index links
                indexLinks.forEach(link => link.classList.remove("active"));
                
                // Find the link corresponding to the visible section
                const matchingLink = Array.from(indexLinks).find(link => 
                    link.getAttribute("href").substring(1) === entry.target.id
                );

                if (matchingLink) {
                    matchingLink.classList.add("active");
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
});
