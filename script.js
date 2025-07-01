document.addEventListener('DOMContentLoaded', function() {
    
    // --- ELEMEN UTAMA & KONFIGURASI ---
    const navLinks = document.querySelectorAll('header nav a');
    const taskbarContainer = document.getElementById('minimized-windows-container');
    const interactiveWindows = document.querySelectorAll('.about-section, .skills-section, .portfolio-section, .contact-section');
    const desktopIcons = document.querySelectorAll('.desktop-icon');
    let highestZIndex = 10;

    // --- FUNGSI UNTUK MEMBUAT JENDELA BISA DIGESER (DRAGGABLE) ---
    function makeWindowDraggable(windowEl) {
        const titleBar = windowEl.querySelector('.window-title-bar');
        let isDragging = false;
        let offsetX, offsetY;

        function bringToFront() {
            highestZIndex++;
            windowEl.style.zIndex = highestZIndex;
        }

        windowEl.addEventListener('mousedown', bringToFront);

        titleBar.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - windowEl.getBoundingClientRect().left;
            offsetY = e.clientY - windowEl.getBoundingClientRect().top;
            windowEl.classList.add('is-dragging');
            bringToFront();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            let newX = e.clientX - offsetX;
            let newY = e.clientY - offsetY;
            const maxW = window.innerWidth - windowEl.offsetWidth;
            const maxH = window.innerHeight - windowEl.offsetHeight;
            newX = Math.max(0, Math.min(newX, maxW));
            newY = Math.max(0, Math.min(newY, maxH));
            windowEl.style.left = `${newX}px`;
            windowEl.style.top = `${newY}px`;
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            windowEl.classList.remove('is-dragging');
        });
    }

    // --- INISIALISASI POSISI & FUNGSI JENDELA ---
    interactiveWindows.forEach((windowEl, index) => {
        // Posisi awal jendela agar tidak tumpang tindih dengan ikon desktop atau header
        windowEl.style.top = `${250 + index * 20}px`;
        windowEl.style.left = `${window.innerWidth / 2 - windowEl.offsetWidth / 2 + index * 20}px`;
        windowEl.style.zIndex = highestZIndex + index + 1;
        makeWindowDraggable(windowEl);

        const minimizeBtn = windowEl.querySelector('.minimize-btn');
        const closeBtn = windowEl.querySelector('.close-btn');
        const windowId = '#' + windowEl.id;
        const windowTitle = windowEl.querySelector('.window-title-bar span').textContent;

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                windowEl.classList.add('hidden');
                const existingTab = taskbarContainer.querySelector(`[data-target="${windowId}"]`);
                if (existingTab) existingTab.remove();
            });
        }

        if (minimizeBtn) {
            minimizeBtn.addEventListener('click', () => {
                windowEl.classList.add('hidden');
                const existingTab = taskbarContainer.querySelector(`[data-target="${windowId}"]`);
                if (!existingTab) {
                    const tab = document.createElement('button');
                    tab.className = 'minimized-tab';
                    tab.dataset.target = windowId;
                    tab.innerHTML = `<span class="minimized-tab-icon">🗔</span><span class="minimized-tab-text">${windowTitle}</span>`;
                    taskbarContainer.appendChild(tab);
                }
            });
        }
    });
    highestZIndex += interactiveWindows.length;

    // --- FUNGSI UNTUK MENAMPILKAN JENDELA ---
    function showWindow(selector) {
        const windowEl = document.querySelector(selector);
        if (windowEl) {

            windowEl.classList.remove('hidden');
            highestZIndex++;
            windowEl.style.zIndex = highestZIndex;
            
            windowEl.classList.add('is-opening');
            setTimeout(() => {
                windowEl.classList.remove('is-opening');
            }, 500);
        }
        const existingTab = taskbarContainer.querySelector(`[data-target="${selector}"]`);
        if (existingTab) existingTab.remove();
    }

    // --- EVENT LISTENER NAVIGASI, IKON DESKTOP, & TASKBAR ---
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSelector = link.getAttribute('href');
            showWindow(targetSelector);
        });
    });

    // Menambahkan event listener untuk setiap ikon di desktop
    desktopIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            const targetSelector = icon.dataset.target;
            showWindow(targetSelector);
        });
    });

    taskbarContainer.addEventListener('click', (e) => {
        const tab = e.target.closest('.minimized-tab');
        if (tab) {
            const targetSelector = tab.dataset.target;
            showWindow(targetSelector);
        }
    });
    
    // ========================================================
    // KODE ASLI ANDA (BOOTING, FORM, DLL)
    // ========================================================
    const loadingScreen = document.getElementById('loading-screen');
    const bootTextElement = document.getElementById('boot-text');
    const bootSequence = ['> BOOTING PROGRAM...', '> Initializing memory... OK', '> Loading UI assets... DONE', '> Establishing network connection... SECURE', '> Preparing portfolio... WELCOME, USER.'];
    let lineIndex = 0;
    let charIndex = 0;

    function typeBootText() {
        if (loadingScreen && bootTextElement) {
            if (lineIndex < bootSequence.length) {
                if (charIndex < bootSequence[lineIndex].length) {
                    bootTextElement.innerHTML += bootSequence[lineIndex].charAt(charIndex);
                    charIndex++;
                    setTimeout(typeBootText, 30);
                } else {
                    bootTextElement.innerHTML += '\n';
                    lineIndex++;
                    charIndex = 0;
                    setTimeout(typeBootText, 250);
                }
            } else {
                setTimeout(() => {
                    loadingScreen.classList.add('hidden');
                }, 700);
            }
        }
    }
    typeBootText();

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const sendButton = contactForm.querySelector('.send-button');
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(contactForm);
            const originalButtonText = sendButton.textContent;
            sendButton.textContent = 'SENDING...';
            sendButton.disabled = true;
            fetch(import.meta.env.VITE_FORMSPREE_URL, { // Pastikan VITE_FORMSPREE_URL sudah dikonfigurasi
                method: 'POST',
                body: JSON.stringify(Object.fromEntries(formData)),
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
            }).then(response => {
                if (response.ok) {
                    sendButton.textContent = 'SENT! :D';
                    contactForm.reset();
                } else {
                    response.json().then(data => {
                        if (Object.hasOwn(data, 'errors')) {
                            alert(data["errors"].map(error => error["message"]).join(", "));
                        } else {
                            alert('Oops! There was a problem submitting your form');
                        }
                    });
                    sendButton.textContent = 'ERROR :(';
                }
            }).catch(error => {
                alert('Oops! There was a problem with the network.');
                sendButton.textContent = 'ERROR :(';
            }).finally(() => {
                setTimeout(() => {
                    sendButton.textContent = originalButtonText;
                    sendButton.disabled = false;
                }, 3000);
            });
        });
    }

    const allBars = document.querySelectorAll('.energy-bar, .creativity-bar, .brain-bar');
    function animateProgressBars() {
        allBars.forEach(bar => {
            if (bar) {
                const randomWidth = Math.floor(Math.random() * 101);
                bar.style.width = randomWidth + '%';
            }
        });
    }
    setInterval(animateProgressBars, Math.random() * 1000 + 2000);
    animateProgressBars();

    const clockElement = document.getElementById('taskbar-clock');
    function updateClock() {
        if (clockElement) {
            const now = new Date();
            const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            clockElement.textContent = timeString;
        }
    }
    setInterval(updateClock, 1000);
    updateClock();

});