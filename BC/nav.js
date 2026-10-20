document.querySelectorAll('.navbar').forEach((navigation) => {
    const links = navigation.querySelector('.ul_nav');
    if (!links) return;

    const currentPath = window.location.pathname.toLowerCase();
    const currentLink = [...links.querySelectorAll('a')].find((link) =>
        new URL(link.href).pathname.toLowerCase() === currentPath
    );

    if (currentLink) {
        links.querySelectorAll('a.active').forEach((link) => link.classList.remove('active'));
        currentLink.classList.add('active');
    }

    const toggle = document.createElement('button');
    toggle.className = 'nav-toggle';
    toggle.type = 'button';
    toggle.setAttribute('aria-label', 'Open navigation menu');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', 'site-navigation');
    toggle.innerHTML = '<span></span><span></span><span></span>';
    links.id = 'site-navigation';

    const backdrop = document.createElement('div');
    backdrop.className = 'nav-backdrop';
    backdrop.setAttribute('aria-hidden', 'true');

    navigation.insertBefore(toggle, links);
    navigation.after(backdrop);

    const closeMenu = () => {
        navigation.classList.remove('menu-open');
        backdrop.classList.remove('is-visible');
        links.style.right = window.matchMedia('(max-width: 760px)').matches ? '-110vw' : '';
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open navigation menu');
    };

    toggle.addEventListener('click', () => {
        const isOpen = navigation.classList.toggle('menu-open');
        backdrop.classList.toggle('is-visible', isOpen);
        links.style.right = isOpen ? '0' : '-110vw';
        toggle.setAttribute('aria-expanded', String(isOpen));
        toggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    });

    backdrop.addEventListener('click', closeMenu);
    links.addEventListener('click', (event) => {
        if (event.target.closest('a')) closeMenu();
    });
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeMenu();
    });
    window.addEventListener('resize', () => {
        if (window.innerWidth > 760) closeMenu();
    });
});