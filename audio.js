let actx = null;
function getaudioctx() {
    if (!actx) {
        try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {}
    }
    return actx;
}

function beep(freq, dur, type = 'square', vol = 0.15) {
    if (!settings.sound) return;
    const a = getaudioctx();
    if (!a) return;
    const o = a.createOscillator();
    const g = a.createGain();
    o.type = type;
    o.frequency.value = freq;
    o.connect(g);
    g.connect(a.destination);
    g.gain.setValueAtTime(vol, a.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, a.currentTime + dur);
    o.start();
    o.stop(a.currentTime + dur);
}

function jumpsfx() {
    beep(440, 0.12, 'square', 0.12);
    setTimeout(() => beep(660, 0.08, 'square', 0.1), 60);
}

function hitsfx() { beep(120, 0.3, 'sawtooth', 0.2); }

function coinsfx() {
    beep(880, 0.06, 'square', 0.1);
    setTimeout(() => beep(1180, 0.08, 'square', 0.1), 50);
}

function winsfx() {
    [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => beep(f, 0.15, 'triangle', 0.12), i * 100));
}

function bosssfx() { beep(80, 0.5, 'sawtooth', 0.25); }
