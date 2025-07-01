// Menunggu seluruh konten halaman HTML siap dimuat sebelum menjalankan skrip
document.addEventListener('DOMContentLoaded', function() {
    
    // --- BLOK KODE UNTUK EFEK BOOTING ---
    const loadingScreen = document.getElementById('loading-screen');
    const bootTextElement = document.getElementById('boot-text');
    const bootSequence = [
        '> BOOTING PROGRAM...',
        '> Initializing memory... OK',
        '> Loading UI assets... DONE',
        '> Establishing network connection... SECURE',
        '> Preparing portfolio... WELCOME, USER.'
    ];
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

    // --- BLOK KODE UNTUK KONTROL JENDELA (BARU) ---
    const allWindows = document.querySelectorAll('.window-frame');

    allWindows.forEach(windowEl => {
        const minimizeBtn = windowEl.querySelector('.minimize-btn');
        const maximizeBtn = windowEl.querySelector('.maximize-btn');
        const closeBtn = windowEl.querySelector('.close-btn');
        const content = windowEl.querySelector('.window-content-inner');

        // Fungsi untuk tombol Minimize
        if (minimizeBtn && content) {
            minimizeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                content.classList.toggle('minimized');
            });
        }

        // Fungsi untuk tombol Maximize
        if (maximizeBtn) {
            maximizeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                windowEl.classList.toggle('maximized');
            });
        }

        // Fungsi untuk tombol Close
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                windowEl.classList.add('hidden');
            });
        }
    });

    // --- BLOK KODE UNTUK FORMULIR KONTAK ---
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
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
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

    // --- BLOK KODE UNTUK ANIMASI PROGRESS BAR ---
    const energyBar = document.querySelector('.energy-bar');
    const creativityBar = document.querySelector('.creativity-bar');
    const brainBar = document.querySelector('.brain-bar');
    const allBars = [energyBar, creativityBar, brainBar];

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

    // --- BLOK KODE UNTUK JAM TASKBAR ---
    function updateClock() {
        const clockElement = document.getElementById('taskbar-clock');
        if (clockElement) {
            const now = new Date();
            const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            clockElement.textContent = timeString;
        }
    }
    setInterval(updateClock, 1000);
    updateClock();
});