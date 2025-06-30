// Menunggu seluruh konten halaman HTML siap dimuat sebelum menjalankan skrip
document.addEventListener('DOMContentLoaded', function() {
    
    // --- BLOK KODE UNTUK EFEK BOOTING ---
    const loadingScreen = document.getElementById('loading-screen');
    const bootTextElement = document.getElementById('boot-text');
    
    // Teks yang akan ditampilkan saat booting
    const bootSequence = [
        '> BOOTING PROGRAM...',
        '> Initializing memory... OK',
        '> Loading UI assets... DONE',
        '> Establishing network connection... SECURE',
        '> Preparing portfolio... WELCOME, USER.'
    ];

    let lineIndex = 0;
    let charIndex = 0;

    // Fungsi untuk mengetik teks satu per satu
    function typeBootText() {
        // Cek apakah layar loading ada
        if (loadingScreen && bootTextElement) {
            // Cek apakah masih ada baris teks untuk ditampilkan
            if (lineIndex < bootSequence.length) {
                // Cek apakah masih ada karakter untuk diketik di baris saat ini
                if (charIndex < bootSequence[lineIndex].length) {
                    bootTextElement.innerHTML += bootSequence[lineIndex].charAt(charIndex);
                    charIndex++;
                    setTimeout(typeBootText, 30); // Kecepatan ketik per karakter
                } else {
                    bootTextElement.innerHTML += '\n'; // Tambah baris baru
                    lineIndex++;
                    charIndex = 0;
                    setTimeout(typeBootText, 250); // Jeda waktu antar baris
                }
            } else {
                // Jika semua teks sudah selesai, sembunyikan layar loading
                setTimeout(() => {
                    loadingScreen.classList.add('hidden');
                }, 700); // Jeda waktu sebelum layar menghilang
            }
        }
    }
    
    // Memulai sekuens booting saat halaman dimuat
    typeBootText();


    // --- BLOK KODE UNTUK FORMULIR KONTAK ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const sendButton = contactForm.querySelector('.send-button');

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Mencegah form melakukan submit standar dan me-refresh halaman

            const formData = new FormData(contactForm);
            const originalButtonText = sendButton.textContent;
            sendButton.textContent = 'SENDING...';
            sendButton.disabled = true;

            fetch('https://formspree.io/f/mgvydonj', { // <--- Baris ini yang akan diubah
                method: 'POST',
                body: JSON.stringify(Object.fromEntries(formData)),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                 }
            }).then(response => {
                if (response.ok) {
                    sendButton.textContent = 'SENT! :D';
                    contactForm.reset(); // Mengosongkan form setelah berhasil
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
});


// --- BLOK KODE UNTUK JAM TASKBAR ---
function updateClock() {
    const clockElement = document.getElementById('taskbar-clock');
    if (clockElement) {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        clockElement.textContent = timeString;
    }
}

// Panggil updateClock setiap detik
setInterval(updateClock, 1000);
// Panggil sekali saat halaman dimuat agar jam langsung tampil
updateClock();