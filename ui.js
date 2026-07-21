function buildlevelgrid() {
    const grid = document.getElementById('levelgrid');
    grid.innerHTML = '';
    for (let i = 1; i <= 30; i++) {
        const d = document.createElement('div');
        d.className = 'lvlbtn';
        const boss = (i % 10 === 0);
        if (boss) d.classList.add('boss');
        if (i <= save.unlocked) {
            d.classList.add('unlocked');
            if (save.done.includes(i)) d.classList.add('done');
            d.onclick = () => startlevel(i);
        } else {
            d.classList.add('locked');
        }
        d.textContent = boss ? '☠' + i : i;
        grid.appendChild(d);
    }
}

function gomenu() {
    state = statemenu;
    level = null;
    document.getElementById('fadeblack').classList.remove('on');
    document.getElementById('endtext').classList.remove('show');
    hideoverlays();
    document.getElementById('startscreen').classList.remove('hidden');
    document.getElementById('hud').classList.add('hidden');
    document.getElementById('touchcontrols').classList.add('hidden');
    document.getElementById('joystickwrap').classList.add('hidden');
    document.getElementById('bossbarwrap').classList.add('hidden');
    if (editmode) toggleeditmode();
}

function pausegame() {
    if (state !== stateplay) return;
    state = statepause;
    document.getElementById('pausemenu').classList.remove('hidden');
    updatecontrolvisibility();
}

function resumegame() {
    state = stateplay;
    document.getElementById('pausemenu').classList.add('hidden');
    document.getElementById('settingsmenu').classList.add('hidden');
    updatecontrolvisibility();
}

function hideoverlays() {
    ['startscreen', 'levelselect', 'pausemenu', 'settingsmenu', 'gameover', 'levelcomplete', 'endscreen', 'storyscreen', 'skineditor', 'leveleditor'].forEach(id => {
        document.getElementById(id).classList.add('hidden');
    });
}

function opensettings(frompause) {
    settingsfrompause = frompause;
    hideoverlays();
    document.getElementById('settingsmenu').classList.remove('hidden');
}

function bindtoggle(id, key) {
    const el = document.getElementById(id);
    if (settings[key]) el.classList.add('on');
    else el.classList.remove('on');
    el.onclick = () => {
        settings[key] = !settings[key];
        el.classList.toggle('on', settings[key]);
        persistset();
    };
}

function toggleeditmode() {
    editmode = !editmode;
    const game = document.getElementById('game');
    if (editmode) {
        game.classList.add('editmode');
        document.getElementById('edithudbtn').style.background = '#4a3f80';
        document.getElementById('edithudbtn').textContent = 'stop edit';
        document.querySelectorAll('.draggable').forEach(el => el.style.cursor = 'grab');
    } else {
        game.classList.remove('editmode');
        document.getElementById('edithudbtn').style.background = '';
        document.getElementById('edithudbtn').textContent = 'edit hud';
        document.querySelectorAll('.draggable').forEach(el => el.style.cursor = '');
    }
}

function setupui() {
    document.getElementById('playbtn').onclick = () => { getaudioctx(); startstory(); };
    document.getElementById('levelsbtn').onclick = () => { buildlevelgrid(); hideoverlays(); document.getElementById('levelselect').classList.remove('hidden'); };
    document.getElementById('lvlback').onclick = gomenu;
    document.getElementById('pausebtn').onclick = pausegame;
    document.getElementById('resumebtn').onclick = resumegame;
    document.getElementById('menubtn').onclick = gomenu;
    document.getElementById('settingsbtn').onclick = () => { document.getElementById('pausemenu').classList.add('hidden'); opensettings(true); };
    document.getElementById('settingsbtn2').onclick = () => { opensettings(false); };
    document.getElementById('settingsback').onclick = () => {
        document.getElementById('settingsmenu').classList.add('hidden');
        if (settingsfrompause) { document.getElementById('pausemenu').classList.remove('hidden'); updatecontrolvisibility(); } else { document.getElementById('startscreen').classList.remove('hidden'); }
    };
    document.getElementById('retrybtn').onclick = () => startlevel(curlevel);
    document.getElementById('gomenubtn').onclick = gomenu;
    document.getElementById('nextbtn').onclick = () => startlevel(curlevel + 1);
    document.getElementById('lcmenubtn').onclick = gomenu;
    document.getElementById('edithudbtn').onclick = toggleeditmode;
    document.getElementById('skineditorbtn').onclick = () => { document.getElementById('pausemenu').classList.add('hidden'); openskineditor(); };
    document.getElementById('leveleditorbtn').onclick = () => { document.getElementById('pausemenu').classList.add('hidden'); openleveleditor(); };
    document.getElementById('skinclose').onclick = () => document.getElementById('skineditor').classList.add('hidden');
    document.getElementById('skinsave').onclick = saveskin;
    document.getElementById('skinreset').onclick = resetskin;
    document.getElementById('editorclose').onclick = () => document.getElementById('leveleditor').classList.add('hidden');
    document.getElementById('editorsave').onclick = savelevel;
    document.getElementById('editorload').onclick = loadlevel;

    bindtoggle('soundtoggle', 'sound');
    bindtoggle('shaketoggle', 'shake');
    bindtoggle('particletoggle', 'particles');

    document.getElementById('desktopmodebtn').onclick = () => {
        settings.controlsmode = 'desktop';
        controlsmode = 'desktop';
        persistset();
        updatecontrolvisibility();
    };
    document.getElementById('mobilemodebtn').onclick = () => {
        settings.controlsmode = 'mobile';
        controlsmode = 'mobile';
        persistset();
        updatecontrolvisibility();
    };
}

function openskineditor() {
    const el = document.getElementById('skineditor');
    el.classList.remove('hidden');
    document.getElementById('skincolor').value = player.skin.color;
    document.getElementById('skinhood').value = player.skin.hood;
    document.getElementById('skinsize').value = player.skin.size;
}

function saveskin() {
    player.skin.color = document.getElementById('skincolor').value;
    player.skin.hood = document.getElementById('skinhood').value;
    player.skin.size = parseFloat(document.getElementById('skinsize').value);
    localStorage.setItem('playerskin', JSON.stringify(player.skin));
    document.getElementById('skineditor').classList.add('hidden');
}

function resetskin() {
    player.skin = { color: '#d9d2b8', hood: '#100c16', size: 1 };
    localStorage.setItem('playerskin', JSON.stringify(player.skin));
    document.getElementById('skincolor').value = '#d9d2b8';
    document.getElementById('skinhood').value = '#100c16';
    document.getElementById('skinsize').value = 1;
}

function openleveleditor() {
    const el = document.getElementById('leveleditor');
    el.classList.remove('hidden');
    const canvas = document.getElementById('editorcanvas');
    const ctxed = canvas.getContext('2d');
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    let selected = null;
    let objects = [];
    let dragobj = null;

    function redraw() {
        ctxed.clearRect(0, 0, canvas.width, canvas.height);
        ctxed.fillStyle = '#0a0a12';
        ctxed.fillRect(0, 0, canvas.width, canvas.height);
        for (const obj of objects) {
            ctxed.fillStyle = obj.color || '#888';
            ctxed.fillRect(obj.x, obj.y, obj.w, obj.h);
            if (obj.label) {
                ctxed.fillStyle = '#fff';
                ctxed.font = '12px sans-serif';
                ctxed.fillText(obj.label, obj.x, obj.y - 4);
            }
        }
    }

    document.querySelectorAll('[data-add]').forEach(btn => {
        btn.onclick = () => {
            const type = btn.dataset.add;
            const newobj = { x: 100, y: 100, w: 40, h: 40, type, color: '#6a4' };
            if (type === 'platform') { newobj.w = 80; newobj.h = 20; newobj.color = '#556'; }
            else if (type === 'spike') { newobj.w = 20; newobj.h = 20; newobj.color = '#c33'; }
            else if (type === 'saw') { newobj.w = 30; newobj.h = 30; newobj.color = '#aaa'; }
            else if (type === 'coin') { newobj.w = 16; newobj.h = 16; newobj.color = '#fd6'; }
            else if (type === 'enemy') { newobj.w = 26; newobj.h = 32; newobj.color = '#4a4'; }
            else if (type === 'mover') { newobj.w = 60; newobj.h = 16; newobj.color = '#6a5a8a'; }
            else if (type === 'boss') { newobj.w = 80; newobj.h = 80; newobj.color = '#822'; }
            objects.push(newobj);
            redraw();
        };
    });

    canvas.addEventListener('mousedown', e => {
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        for (let i = objects.length - 1; i >= 0; i--) {
            const obj = objects[i];
            if (mx > obj.x && mx < obj.x + obj.w && my > obj.y && my < obj.y + obj.h) {
                dragobj = obj;
                break;
            }
        }
    });
    canvas.addEventListener('mousemove', e => {
        if (!dragobj) return;
        const rect = canvas.getBoundingClientRect();
        dragobj.x = e.clientX - rect.left - dragobj.w/2;
        dragobj.y = e.clientY - rect.top - dragobj.h/2;
        redraw();
    });
    canvas.addEventListener('mouseup', () => { dragobj = null; });
    canvas.addEventListener('touchstart', e => {
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const mx = touch.clientX - rect.left;
        const my = touch.clientY - rect.top;
        for (let i = objects.length - 1; i >= 0; i--) {
            const obj = objects[i];
            if (mx > obj.x && mx < obj.x + obj.w && my > obj.y && my < obj.y + obj.h) {
                dragobj = obj;
                break;
            }
        }
    });
    canvas.addEventListener('touchmove', e => {
        e.preventDefault();
        if (!dragobj) return;
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        dragobj.x = touch.clientX - rect.left - dragobj.w/2;
        dragobj.y = touch.clientY - rect.top - dragobj.h/2;
        redraw();
    });
    canvas.addEventListener('touchend', () => { dragobj = null; });

    window.leveleditor_objects = objects;
    redraw();
}

function savelevel() {
    const data = window.leveleditor_objects || [];
    localStorage.setItem('customlevel', JSON.stringify(data));
    alert('level saved!');
}

function loadlevel() {
    const data = localStorage.getItem('customlevel');
    if (data) {
        window.leveleditor_objects = JSON.parse(data);
        const canvas = document.getElementById('editorcanvas');
        const ctxed = canvas.getContext('2d');
        ctxed.clearRect(0, 0, canvas.width, canvas.height);
        for (const obj of window.leveleditor_objects) {
            ctxed.fillStyle = obj.color || '#888';
            ctxed.fillRect(obj.x, obj.y, obj.w, obj.h);
        }
        alert('level loaded!');
    } else alert('no saved level');
}
