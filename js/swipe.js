const threshold = 120;

function reorderCards() {
    const cards = document.querySelectorAll(".card");

    cards.forEach((card, index) => {
        card.style.zIndex = 10 - index;
        card.style.transform = `translate(${index * 15}px, ${index * 12}px) scale(${1 - index * 0.05})`;

        if (index === cards.length - 1) {
            card.setAttribute("data-locked", "true");
            card.style.opacity = "1";
            card.style.cursor = "default";
        } else {
            card.removeAttribute("data-locked");
            card.style.cursor = "grab";
        }
    });
}

interact(".card").draggable({
    inertia: true,
    listeners: {
        move(event) {
            const target = event.target;

            if (target.dataset.locked === "true") return;

            let x = (parseFloat(target.dataset.x) || 0) + event.dx;
            let y = (parseFloat(target.dataset.y) || 0) + event.dy;

            target.dataset.x = x;
            target.dataset.y = y;

            target.style.transform = `translate(${x}px, ${y}px) rotate(${x * 0.05}deg)`;
        },
        end(event) {
            const target = event.target;
            const x = parseFloat(target.dataset.x || 0);

            if (Math.abs(x) > threshold) {
                const direction = x > 0 ? 1 : -1;

                target.style.transition = "transform 0.3s ease, opacity 0.3s ease";
                target.style.transform = `translate(${direction * 1000}px, 0px) rotate(${direction * 40}deg)`;
                target.style.opacity = "0";

                setTimeout(() => {
                    target.remove();
                    reorderCards();
                }, 300);
            } else {
                target.style.transition = "transform 0.3s ease";
                target.style.transform = "translate(0px, 0px) rotate(0deg)";
                target.dataset.x = 0;
                target.dataset.y = 0;
            }
        }
    }
});

reorderCards();