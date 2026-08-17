/* ==========================================================================
   BHARATH FITNESS CENTER - SINGLE TAB VIEW SWITCHER & INTERACTIVE LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. VIEW SWITCHER LOGIC
    const views = document.querySelectorAll('.page-view');
    const navLinks = document.querySelectorAll('[data-view-target]');
    const mobileToggle = document.getElementById('mobileNavToggle');
    const navMenu = document.getElementById('mainNav');

    function switchView(targetViewId) {
        if (!targetViewId) return;

        // Clean target name
        const cleanViewId = targetViewId.replace('#', '').replace('view-', '');
        const targetViewElement = document.getElementById(`view-${cleanViewId}`);

        if (!targetViewElement) {
            console.warn(`View #view-${cleanViewId} not found! Defaulting to home.`);
            return switchView('home');
        }

        // Hide all views
        views.forEach(view => view.classList.remove('active'));

        // Show target view
        targetViewElement.classList.add('active');

        // Update active nav links
        navLinks.forEach(link => {
            const linkTarget = link.getAttribute('data-view-target');
            if (linkTarget === cleanViewId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Close mobile navigation if open
        if (navMenu) {
            navMenu.classList.remove('open');
        }

        // Update location hash without triggering scrolling jumps
        history.replaceState(null, null, `#${cleanViewId}`);

        // Scroll to top of view smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Attach click handlers to all view target buttons/links
    document.querySelectorAll('[data-view-target]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetView = link.getAttribute('data-view-target');
            switchView(targetView);
        });
    });

    // Check initial URL hash (e.g. index.html#trainers)
    const initialHash = window.location.hash.replace('#', '');
    if (initialHash) {
        switchView(initialHash);
    } else {
        switchView('home');
    }

    // 2. MOBILE NAVIGATION TOGGLE
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
        });
    }

    // 3. TRAINERS GENDER FILTER (Male vs Female Trainers)
    const trainerFilters = document.querySelectorAll('.trainer-filter-btn');
    const trainerCards = document.querySelectorAll('.trainer-card');

    trainerFilters.forEach(filterBtn => {
        filterBtn.addEventListener('click', () => {
            trainerFilters.forEach(btn => btn.classList.remove('active'));
            filterBtn.classList.add('active');

            const filterValue = filterBtn.getAttribute('data-gender');

            trainerCards.forEach(card => {
                const cardGender = card.getAttribute('data-gender');
                if (filterValue === 'all' || cardGender === filterValue) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // 4. SCHEDULE CLASS FILTER
    const scheduleFilters = document.querySelectorAll('.schedule-filter-btn');
    const scheduleRows = document.querySelectorAll('.schedule-row');

    scheduleFilters.forEach(btn => {
        btn.addEventListener('click', () => {
            scheduleFilters.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.getAttribute('data-category');

            scheduleRows.forEach(row => {
                const rowCat = row.getAttribute('data-category');
                if (category === 'all' || rowCat === category) {
                    row.style.display = 'table-row';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    });

    // 5. TOAST NOTIFICATION UTILITY
    const toast = document.getElementById('toastNotification');
    const toastMsg = document.getElementById('toastMessage');

    window.showToast = function(message) {
        if (!toast || !toastMsg) return;
        toastMsg.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    };

    // 6. MODAL SYSTEM
    const modalOverlay = document.getElementById('modalOverlay');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const modalClose = document.getElementById('modalClose');

    window.openModal = function(title, contentHTML) {
        if (!modalOverlay) return;
        modalTitle.textContent = title;
        modalBody.innerHTML = contentHTML;
        modalOverlay.classList.add('active');
    };

    if (modalClose) {
        modalClose.addEventListener('click', () => {
            modalOverlay.classList.remove('active');
        });
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                modalOverlay.classList.remove('active');
            }
        });
    }

    // 7. FORM SUBMISSIONS WITH CONFIRMATION
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const fullName = document.getElementById('regName').value.trim();
            const plan = document.getElementById('regPlan').value;

            openModal(
                '🎉 Registration Successful!',
                `<p style="margin-bottom: 1rem;">Welcome to <strong>Bharath Fitness Center</strong>, <strong>${fullName}</strong>!</p>
                 <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Your registration for the <strong>${plan} Plan</strong> has been received. Our team will contact you shortly to confirm your membership details.</p>
                 <button onclick="document.getElementById('modalOverlay').classList.remove('active'); switchView('home');" class="btn btn-primary" style="width: 100%;">Return to Home</button>`
            );
            registerForm.reset();
        });
    }

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('contactName').value.trim();
            showToast(`Thank you ${name}! Your message has been sent successfully.`);
            contactForm.reset();
        });
    }
});
