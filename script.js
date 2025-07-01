document.addEventListener('DOMContentLoaded', function() {
    
    // --- ELEMEN UTAMA & KONFIGURASI ---
    const navLinks = document.querySelectorAll('header nav a');
    const taskbarContainer = document.getElementById('minimized-windows-container');
    const interactiveWindows = document.querySelectorAll('.about-section, .skills-section, .portfolio-section, .contact-section');

    // --- FUNGSI UNTUK MENAMPILKAN JENDELA ---
    function showWindow(selector) {
        const windowEl = document.querySelector(selector);
        if (windowEl) {
            windowEl.classList.remove('hidden');
        }
        const existingTab = taskbarContainer.querySelector(`[data-target="${selector}"]`);
        if (existingTab) {
            existingTab.remove();
        }
    }

    // --- EVENT LISTENER UNTUK NAVIGASI HEADER ---
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetSelector = link.getAttribute('href');
            showWindow(targetSelector);
        });
    });

    // --- EVENT LISTENER UNTUK KONTROL JENDELA (MINIMIZE & CLOSE) ---
    interactiveWindows.forEach(windowEl => {
        const minimizeBtn = windowEl.querySelector('.minimize-btn');
        const closeBtn = windowEl.querySelector('.close-btn');
        const windowId = '#' + windowEl.id;
        const windowTitle = windowEl.querySelector('.window-title-bar span').textContent;

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                windowEl.classList.add('hidden');
                const existingTab = taskbarContainer.querySelector(`[data-target="${windowId}"]`);
                if (existingTab) {
                    existingTab.remove();
                }
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
                    
                    // (UBAH) Menambahkan ikon dan teks dengan innerHTML
                    tab.innerHTML = `<span class="minimized-tab-icon">🗔</span><span class="minimized-tab-text">${windowTitle}</span>`;
                    
                    taskbarContainer.appendChild(tab);
                }
            });
        }
    });

    // --- EVENT LISTENER UNTUK TASKBAR (UNTUK RESTORE JENDELA) ---
    taskbarContainer.addEventListener('click', (e) => {
        const tab = e.target.closest('.minimized-tab');
        if (tab) {
            const targetSelector = tab.dataset.target;
            showWindow(targetSelector);
        }
    });
    
    // ========================================================
    // KODE ASLI ANDA
    // ========================================================

    // --- EFEK BOOTING ---
    const loadingScreen = document.getElementById('loading-screen');
    const bootTextElement = document.getElementById('boot-text');
    const bootSequence = [
        '> BOOTING PROGRAM...',
        '> Initializing memory... OK',
        '> Loading UI assets... DONE',
        '> Establishing network connection... SECURE',
        '> Preparing portfolio... WELCOME, USER.'
    ];
    let lineIndex = 0; let charIndex = 0;
    function typeBootText() {
        if (loadingScreen && bootTextElement) {
            if (lineIndex < bootSequence.length) {
                if (charIndex < bootSequence[lineIndex].length) {
                    bootTextElement.innerHTML += bootSequence[lineIndex].charAt(charIndex);
                    charIndex++;
                    setTimeout(typeBootText, 30);
                } else {
                    bootTextElement.innerHTML += '\n';
                    lineIndex++; charIndex = 0;
                    setTimeout(typeBootText, 250);
                }
            } else {
                setTimeout(() => { loadingScreen.classList.add('hidden'); }, 700);
            }
        }
    }
    typeBootText();

    // --- FORMULIR KONTAK ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const sendButton = contactForm.querySelector('.send-button');
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(contactForm);
            const originalButtonText = sendButton.textContent;
            sendButton.textContent = 'SENDING...';
            sendButton.disabled = true;

            fetch(import.meta.env.VITE_FORMSPREE_URL, {
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

    // --- ANIMASI PROGRESS BAR ---
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

    // --- JAM TASKBAR ---
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
