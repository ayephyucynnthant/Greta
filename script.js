// --- Page navigation, blow out, balloons, and audio-unlock logic ---

// Track whether we've unlocked audio (unmuted) via user gesture
let audioUnlocked = false;

function goToPage(pageNumber) {
    const audioPlayer = document.getElementById('birthday-song');

    // hide both pages
    document.getElementById('page-1-intro').style.display = 'none';
    document.getElementById('page-2-wish').style.display = 'none';

    if (pageNumber === 1) {
        document.getElementById('page-1-intro').style.display = 'flex';

        // restore flames/button state
        document.getElementById('flame-1').classList.remove('flame-extinguished');
        document.getElementById('flame-2').classList.remove('flame-extinguished');
        document.getElementById('blow-out-button').disabled = false;
        document.getElementById('blow-out-button').innerText = 'Blow Out the Candles 💨';

        // Keep audio muted here — we'll unmute on user gesture (below).
        // Try to play so the browser can start the muted playback stream.
        audioPlayer.play().catch(err => {
            console.log("Muted autoplay may be blocked or not started yet:", err);
        });

    } else if (pageNumber === 2) {
        document.getElementById('page-2-wish').style.display = 'flex';
        audioPlayer.pause();
    }
}

function handleBlowOut() {
    const flame1 = document.getElementById('flame-1');
    const flame2 = document.getElementById('flame-2');

    flame1.classList.add('flame-extinguished');
    flame2.classList.add('flame-extinguished');

    const button = document.getElementById('blow-out-button');
    button.disabled = true;
    button.innerText = 'Candles Blown! ✅';
}

// move to wish page
function goToWishPage() {
    goToPage(2);
}

function releaseBalloons() {
    const colors = ['#ff6666', '#ff9a91', '#95c3de', '#f2d74e'];
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const balloon = document.createElement('div');
            balloon.className = 'balloon';
            balloon.style.left = Math.random() * window.innerWidth + 'px';
            balloon.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            document.body.appendChild(balloon);

            setTimeout(() => { balloon.remove(); }, 4000);
        }, i * 200);
    }
}

// --- Audio unlock: unmute/play on first user gesture (click/keydown/touch) ---
function unlockAudioOnFirstGesture() {
    if (audioUnlocked) return;
    const audioPlayer = document.getElementById('birthday-song');
    if (!audioPlayer) return;
    
    // Unmute and try to play (the user gesture allows this)
    try {
        audioPlayer.muted = false;
        audioPlayer.play().catch(e => {
            console.log("Play after unmute failed:", e);
        });
    } catch (e) {
        console.log("Error unmuting audio:", e);
    }
    audioUnlocked = true;
}

// Add a one-time listener for user gestures to unmute audio
function setupAudioUnlockListeners() {
    const unlock = () => {
        unlockAudioOnFirstGesture();
        // remove all the gesture listeners — we only need one
        window.removeEventListener('click', unlock);
        window.removeEventListener('keydown', unlock);
        window.removeEventListener('touchstart', unlock);
    };
    window.addEventListener('click', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });
    window.addEventListener('touchstart', unlock, { once: true });
}

// Initial page load
document.addEventListener('DOMContentLoaded', () => {
    goToPage(1);
    setupAudioUnlockListeners();
});