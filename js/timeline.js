document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("timeline-scroll");
    const dots = document.querySelectorAll(".timeline-dot");
    const prevBtn = document.getElementById("timeline-prev");
    const nextBtn = document.getElementById("timeline-next");

    if (!container) return;

    const getItemWidth = () => {
        return container.clientWidth * 0.85;
    };

    const updateControls = () => {
        const itemWidth = getItemWidth();
        const scrollLeft = container.scrollLeft;

        const index = Math.round(scrollLeft / itemWidth);

        dots.forEach((dot, i) => {
            if (i === index) {
                dot.classList.add("bg-gray-600", "scale-125");
                dot.classList.remove("bg-gray-300");
            } else {
                dot.classList.remove("bg-gray-600", "scale-125");
                dot.classList.add("bg-gray-300");
            }
        });

        if (prevBtn) {
            if (index === 0) {
                prevBtn.classList.add("opacity-0", "pointer-events-none");
            } else {
                prevBtn.classList.remove("opacity-0", "pointer-events-none");
            }
        }

        if (nextBtn) {
            if (index === dots.length - 1) {
                nextBtn.classList.add("opacity-0", "pointer-events-none");
            } else {
                nextBtn.classList.remove("opacity-0", "pointer-events-none");
            }
        }
    };

    container.addEventListener("scroll", updateControls);
    window.addEventListener("resize", updateControls);

    updateControls();

    dots.forEach((dot, i) => {
        dot.addEventListener("click", () => {
            const itemWidth = getItemWidth();
            container.scrollTo({
                left: i * itemWidth,
                behavior: "smooth"
            });
        });
    });

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            const itemWidth = getItemWidth();
            container.scrollBy({
                left: -itemWidth,
                behavior: "smooth"
            });
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            const itemWidth = getItemWidth();
            container.scrollBy({
                left: itemWidth,
                behavior: "smooth"
            });
        });
    }
});
