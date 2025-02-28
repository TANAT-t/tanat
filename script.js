document.addEventListener("DOMContentLoaded", function() {
  // 1. Select the index container by its ID
  const indexContainer = document.getElementById("X3666749238");
  if (!indexContainer) {
    console.error("Index container (#X3666749238) not found!");
    return;
  }
  
  // 2. Find all index links with rel="history" inside the container
  const indexLinks = indexContainer.querySelectorAll("a[rel='history']");
  if (!indexLinks.length) {
    console.error("No index links found in the container.");
    return;
  }
  
  // 3. Build a mapping of target IDs to the index link elements
  const linkMapping = {};
  indexLinks.forEach(link => {
    const targetId = link.getAttribute("href").substring(1); // Remove the '#' character
    if (targetId) {
      linkMapping[targetId] = link;
    }
  });
  
  // 4. Gather the sections (target elements) based on the link mapping
  const sections = Object.keys(linkMapping).map(id => {
    const el = document.getElementById(id);
    if (!el) {
      console.warn("No element found with id:", id);
    }
    return el;
  }).filter(el => el);
  
  if (!sections.length) {
    console.error("No sections found to observe!");
    return;
  }
  
  // 5. Use IntersectionObserver if available
  let currentActive = null;
  if ("IntersectionObserver" in window) {
    const observerOptions = {
      root: null, // Use viewport as root
      rootMargin: "0px",
      threshold: [0.25, 0.5, 0.75] // Trigger at different visibility percentages
    };
    
    const observer = new IntersectionObserver(entries => {
      let maxRatio = 0;
      let mostVisibleEntry = null;
      
      // Find the entry with the highest intersection ratio
      entries.forEach(entry => {
        if (entry.intersectionRatio > maxRatio) {
          maxRatio = entry.intersectionRatio;
          mostVisibleEntry = entry;
        }
      });
      
      if (mostVisibleEntry && mostVisibleEntry.intersectionRatio > 0) {
        const targetId = mostVisibleEntry.target.id;
        const activeLink = linkMapping[targetId];
        if (activeLink && currentActive !== activeLink) {
          // Remove the active class from all links
          indexLinks.forEach(link => link.classList.remove("active"));
          // Add the active class to the current link
          activeLink.classList.add("active");
          currentActive = activeLink;
        }
      }
    }, observerOptions);
    
    // Observe each target section
    sections.forEach(section => observer.observe(section));
    
  } else {
    // Fallback: Use scroll event if IntersectionObserver is not supported
    window.addEventListener("scroll", function() {
      let viewportMiddle = window.scrollY + window.innerHeight / 2;
      let closestSection = null;
      let minDistance = Infinity;
      
      sections.forEach(section => {
        const sectionCenter = section.offsetTop + section.offsetHeight / 2;
        const distance = Math.abs(viewportMiddle - sectionCenter);
        if (distance < minDistance) {
          minDistance = distance;
          closestSection = section;
        }
      });
      
      if (closestSection && linkMapping[closestSection.id]) {
        indexLinks.forEach(link => link.classList.remove("active"));
        linkMapping[closestSection.id].classList.add("active");
      }
    });
  }
});
