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

function footstepsfx() {
    if (!settings.sound) return;
    const a = getaudioctx();
    if (!a) return;

    const osc = a.createOscillator();
    const gain = a.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, a.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, a.currentTime + 0.05);
    gain.gain.setValueAtTime(0.15, a.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, a.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(a.destination);
    osc.start();
    osc.stop(a.currentTime + 0.05);

    const buffersize = a.sampleRate * 0.03;
    const buffer = a.createBuffer(1, buffersize, a.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < buffersize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (buffersize * 0.3));
    }
    const source = a.createBufferSource();
    source.buffer = buffer;
    const gain2 = a.createGain();
    gain2.gain.value = 0.06;
    source.connect(gain2);
    gain2.connect(a.destination);
    source.start();

    const delay = a.createDelay(0.5);
    delay.delayTime.value = 0.15;
    const feedback = a.createGain();
    feedback.gain.value = 0.15;
    delay.connect(feedback);
    feedback.connect(delay);
    gain.connect(delay);
    gain2.connect(delay);
    delay.connect(a.destination);
}
