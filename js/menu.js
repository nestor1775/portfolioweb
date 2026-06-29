document.addEventListener('DOMContentLoaded', () => {
    const menuGlass = document.getElementById('menu-glass');
    if (!menuGlass) return;

    LiquidGlass.init(menuGlass, {
        borderRadius: 9999,
        glassThickness: 45,
        bezelWidth: 35,
        ior: 2.2,
        blurAmount: 0.4,
        specularOpacity: 0.45,
        tintOpacity: 0.08,
    });

    const indicator = document.getElementById('menu-indicator');
    if (!indicator) return;

    LiquidGlass.init(indicator, {
        borderRadius: 9999,
        glassThickness: 25,
        bezelWidth: 15,
        ior: 2.0,
        blurAmount: 0.35,
        specularOpacity: 0.5,
        tintOpacity: 0.1,
        filterId: 'indicator-glass-filter',
        shadowBlur: 10,
        shadowSpread: -2,
        outerShadowBlur: 12,
    });

    const links = menuGlass.querySelectorAll('.liquid-glass__link');
    let activeLink = links[0];

    if (activeLink) {
        activeLink.classList.add('text-gray-600', 'font-semibold');
    }

    function moveIndicator(targetLink) {
        if (!targetLink) return;

        const padX = 14;
        const padY = 6;

        indicator.style.left = `${targetLink.offsetLeft - padX}px`;
        indicator.style.width = `${targetLink.offsetWidth + padX * 2}px`;
        indicator.style.top = `${targetLink.offsetTop - padY}px`;
        indicator.style.height = `${targetLink.offsetHeight + padY * 2}px`;
        indicator.style.opacity = '1';
    }

    window.addEventListener('load', () => {
        requestAnimationFrame(() => {
            moveIndicator(activeLink);
        });
    });

    setTimeout(() => moveIndicator(activeLink), 50);

    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            moveIndicator(link);
        });

        link.addEventListener('click', (e) => {
            activeLink = link;
            links.forEach(l => l.classList.remove('text-gray-600', 'font-semibold'));
            link.classList.add('text-gray-600', 'font-semibold');
            moveIndicator(link);
        });
    });

    menuGlass.addEventListener('mouseleave', () => {
        moveIndicator(activeLink);
    });

    window.addEventListener('resize', () => {
        moveIndicator(activeLink);
    });
});
