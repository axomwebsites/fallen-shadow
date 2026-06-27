const keys = {};
let joystickactive = false;
let joystickdx = 0;
let joystickdy = 0;
let editmode = false;
let controlsmode = 'auto';

function setupinput() {
    window.addEventListener('keydown', e => {
        if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' ', 'Space'].includes(e.key)) e.preventDefault();
        if (e.repeat) return;
        if (e.key === 'ArrowLeft' || e.key === 'a') keys.left = true;
        if (e.key === 'ArrowRight' || e.key === 'd') keys.right = true;
        if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w') dojump();
        if (e.key === 'Shift' || e.key === 's') doslide();
        if (e.key === 'c' || e.key === 'ArrowDown') togglecrouch();
        if (e.key === 'Escape') {
            if (state === stateplay) pausegame();
            else if (state === statepause) resumegame();
        }
    });
    window.addEventListener('keyup', e => {
        if (e.key === 'ArrowLeft' || e.key === 'a') keys.left = false;
        if (e.key === 'ArrowRight' || e.key === 'd') keys.right = false;
    });

    const base = document.getElementById('joystickbase');
    const knob = document.getElementById('joystickknob');
    let touching = false;
    let radius = 100 / 2 - 22;

    function getrect() {
        return base.getBoundingClientRect();
    }

    function handletouch(e) {
        e.preventDefault();
        const rect = getrect();
        const touch = e.touches ? e.touches[0] : e;
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        let dx = touch.clientX - cx;
        let dy = touch.clientY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const max = radius;
        if (dist > max) { dx = dx / dist * max; dy = dy / dist * max; }
        joystickdx = dx / max;
        joystickdy = dy / max;
        knob.style.transform = `translate(${-50 + (dx / radius) * 50}%, ${-50 + (dy / radius) * 50}%)`;
        joystickactive = true;
        if (Math.abs(joystickdx) > 0.15) {
            if (joystickdx > 0) { keys.right = true; keys.left = false; } else { keys.left = true; keys.right = false; }
        } else {
            keys.left = false; keys.right = false;
        }
    }

    function endtouch(e) {
        e.preventDefault();
        joystickactive = false;
        joystickdx = 0;
        joystickdy = 0;
        knob.style.transform = 'translate(-50%, -50%)';
        keys.left = false;
        keys.right = false;
    }

    base.addEventListener('touchstart', e => {
        touching = true;
        handletouch(e);
    }, { passive: false });
    base.addEventListener('touchmove', e => {
        if (touching) handletouch(e);
    }, { passive: false });
    base.addEventListener('touchend', endtouch, { passive: false });
    base.addEventListener('touchcancel', endtouch, { passive: false });
    base.addEventListener('mousedown', e => {
        touching = true;
        handletouch(e);
    });
    base.addEventListener('mousemove', e => {
        if (touching) handletouch(e);
    });
    base.addEventListener('mouseup', endtouch);
    base.addEventListener('mouseleave', endtouch);

    function bindtouch(id, ondown, onup) {
        const el = document.getElementById(id);
        el.addEventListener('touchstart', e => { e.preventDefault(); getaudioctx(); el.classList.add('active'); ondown(); }, { passive: false });
        el.addEventListener('touchend', e => { e.preventDefault(); el.classList.remove('active'); if (onup) onup(); }, { passive: false });
        el.addEventListener('mousedown', e => { e.preventDefault(); getaudioctx(); ondown(); });
        el.addEventListener('mouseup', e => { if (onup) onup(); });
    }
    bindtouch('jumpbtn', dojump);
    bindtouch('slidebtn', doslide);
    bindtouch('crouchbtn', togglecrouch);

    window.is_mobile = ('ontouchstart' in window) && window.innerWidth < 1024;
    if (controlsmode === 'auto') {
        if (is_mobile) { showmobilecontrols(); } else { showdesktopcontrols(); }
    } else if (controlsmode === 'mobile') {
        showmobilecontrols();
    } else {
        showdesktopcontrols();
    }
    loadhudpositions();
    setupdragging();
}

function showmobilecontrols() {
    document.getElementById('joystickwrap').classList.remove('hidden');
    document.getElementById('touchcontrols').classList.remove('hidden');
}

function showdesktopcontrols() {
    document.getElementById('joystickwrap').classList.add('hidden');
    document.getElementById('touchcontrols').classList.add('hidden');
}

function updatecontrolvisibility() {
    if (state !== stateplay && state !== statepause) {
        document.getElementById('joystickwrap').classList.add('hidden');
        document.getElementById('touchcontrols').classList.add('hidden');
        return;
    }
    if (controlsmode === 'desktop') {
        showdesktopcontrols();
    } else if (controlsmode === 'mobile') {
        showmobilecontrols();
    } else {
        if (is_mobile) showmobilecontrols();
        else showdesktopcontrols();
    }
}

function dojump() {
    player.jumpbuf = 120;
}

function doslide() {
    if (player.slidecd > 0 || player.sliding || !player.onground) return;
    player.sliding = true;
    player.slidetime = 400;
    player.slidecd = 15000;
    player.crouch = false;
    let newh = player.h * 0.45;
    if (player.onground) {
        player.y += (player.h - newh);
    }
    player.vx = 7 * player.facing;
    beep(300, 0.2, 'sawtooth', 0.12);
    burst(player.x, player.y + player.h, '#aaa', 8);
}

function togglecrouch() {
    if (player.sliding) return;
    let oldh = player.crouch ? player.h * 0.6 : player.h;
    player.crouch = !player.crouch;
    let newh = player.crouch ? player.h * 0.6 : player.h;
    if (player.onground) {
        player.y += (oldh - newh);
    }
}

function setupdragging() {
    const elements = ['joystickwrap', 'touchcontrols'];
    elements.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.classList.add('draggable');
        el.addEventListener('mousedown', startdrag);
        el.addEventListener('touchstart', startdrag, { passive: false });
    });
}

let dragtarget = null;
let dragoffsetx = 0;
let dragoffsety = 0;

function startdrag(e) {
    if (!editmode) return;
    e.preventDefault();
    const el = e.currentTarget;
    dragtarget = el;
    const rect = el.getBoundingClientRect();
    const clientx = e.touches ? e.touches[0].clientX : e.clientX;
    const clienty = e.touches ? e.touches[0].clientY : e.clientY;
    dragoffsetx = clientx - rect.left;
    dragoffsety = clienty - rect.top;
    el.classList.add('dragging');
    document.addEventListener('mousemove', onmove);
    document.addEventListener('mouseup', enddrag);
    document.addEventListener('touchmove', onmove, { passive: false });
    document.addEventListener('touchend', enddrag);
}

function onmove(e) {
    e.preventDefault();
    if (!dragtarget) return;
    const clientx = e.touches ? e.touches[0].clientX : e.clientX;
    const clienty = e.touches ? e.touches[0].clientY : e.clientY;
    let left = clientx - dragoffsetx;
    let top = clienty - dragoffsety;
    const parentrect = dragtarget.parentElement.getBoundingClientRect();
    const maxx = parentrect.width - dragtarget.offsetWidth;
    const maxy = parentrect.height - dragtarget.offsetHeight;
    left = Math.max(0, Math.min(left, maxx));
    top = Math.max(0, Math.min(top, maxy));
    dragtarget.style.left = left + 'px';
    dragtarget.style.top = top + 'px';
    savehudposition(dragtarget);
}

function enddrag(e) {
    if (dragtarget) {
        dragtarget.classList.remove('dragging');
        dragtarget = null;
    }
    document.removeEventListener('mousemove', onmove);
    document.removeEventListener('mouseup', enddrag);
    document.removeEventListener('touchmove', onmove);
    document.removeEventListener('touchend', enddrag);
}

function savehudposition(el) {
    const id = el.id;
    const left = parseFloat(el.style.left) || 0;
    const top = parseFloat(el.style.top) || 0;
    let positions = JSON.parse(localStorage.getItem('hudpositions') || '{}');
    positions[id] = { left, top };
    localStorage.setItem('hudpositions', JSON.stringify(positions));
}

function loadhudpositions() {
    const positions = JSON.parse(localStorage.getItem('hudpositions') || '{}');
    const elements = ['joystickwrap', 'touchcontrols'];
    elements.forEach(id => {
        const el = document.getElementById(id);
        if (el && positions[id]) {
            el.style.left = positions[id].left + 'px';
            el.style.top = positions[id].top + 'px';
            el.style.position = 'absolute';
            el.classList.add('draggable');
        }
    });
        }
