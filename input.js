const keys = {};
let joystickactive = false;
let joystickdx = 0;
let joystickdy = 0;

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
    const rect = base.getBoundingClientRect();
    const radius = 100 / 2 - 22;

    function handletouch(e) {
        e.preventDefault();
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
        if (Math.abs(joystickdx) > 0.2) {
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
    if (window.is_mobile) {
        document.getElementById('joystickwrap').classList.remove('hidden');
        document.getElementById('touchcontrols').classList.remove('hidden');
    } else {
        document.getElementById('joystickwrap').classList.add('hidden');
        document.getElementById('touchcontrols').classList.add('hidden');
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
    player.vx = 7 * player.facing;
    beep(300, 0.2, 'sawtooth', 0.12);
    burst(player.x, player.y + player.h, '#aaa', 8);
}

function togglecrouch() {
    if (player.sliding) return;
    player.crouch = !player.crouch;
}
