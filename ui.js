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
    document.getElementById('skinhead').value = player.skin.head || 'default';
    document.getElementById('skinbody').value = player.skin.body || 'default';
    document.getElementById('skinlegs').value = player.skin.legs || 'default';
    document.getElementById('skincape').value = player.skin.cape || 'none';
    document.getElementById('skinweapon').value = player.skin.weapon || 'none';
}

function saveskin() {
    player.skin.color = document.getElementById('skincolor').value;
    player.skin.hood = document.getElementById('skinhood').value;
    player.skin.size = parseFloat(document.getElementById('skinsize').value);
    player.skin.head = document.getElementById('skinhead').value;
    player.skin.body = document.getElementById('skinbody').value;
    player.skin.legs = document.getElementById('skinlegs').value;
    player.skin.cape = document.getElementById('skincape').value;
    player.skin.weapon = document.getElementById('skinweapon').value;
    localStorage.setItem('playerskin', JSON.stringify(player.skin));
    document.getElementById('skineditor').classList.add('hidden');
}

function resetskin() {
    player.skin = { color: '#d9d2b8', hood: '#100c16', size: 1, head: 'default', body: 'default', legs: 'default', cape: 'none', weapon: 'none' };
    localStorage.setItem('playerskin', JSON.stringify(player.skin));
    document.getElementById('skincolor').value = '#d9d2b8';
    document.getElementById('skinhood').value = '#100c16';
    document.getElementById('skinsize').value = 1;
    document.getElementById('skinhead').value = 'default';
    document.getElementById('skinbody').value = 'default';
    document.getElementById('skinlegs').value = 'default';
    document.getElementById('skincape').value = 'none';
    document.getElementById('skinweapon').value = 'none';
}

let edmode = 'move';
let selectedobj = null;
let scriptpanel = null;

function openleveleditor() {
    const el = document.getElementById('leveleditor');
    el.classList.remove('hidden');
    const canvas = document.getElementById('editorcanvas');
    const ctxed = canvas.getContext('2d');
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    let objects = window.leveleditor_objects || [];
    let dragobj = null;
    let dragoffx = 0, dragoffy = 0;
    let rotateangle = 0;

    const modebtns = document.querySelectorAll('.edmodebtn');
    modebtns.forEach(b => {
        b.onclick = () => {
            edmode = b.dataset.mode;
            modebtns.forEach(x => x.style.background = '');
            b.style.background = '#4a3f80';
        };
    });
    document.querySelector('.edmodebtn[data-mode="move"]').style.background = '#4a3f80';

    function redraw() {
        ctxed.clearRect(0, 0, canvas.width, canvas.height);
        ctxed.fillStyle = '#0a0a12';
        ctxed.fillRect(0, 0, canvas.width, canvas.height);
        for (const obj of objects) {
            ctxed.save();
            ctxed.translate(obj.x + obj.w/2, obj.y + obj.h/2);
            ctxed.rotate(obj.rotation || 0);
            ctxed.fillStyle = obj.color || '#888';
            ctxed.fillRect(-obj.w/2, -obj.h/2, obj.w, obj.h);
            if (obj.label) {
                ctxed.fillStyle = '#fff';
                ctxed.font = '12px sans-serif';
                ctxed.textAlign = 'center';
                ctxed.fillText(obj.label, 0, -obj.h/2 - 4);
            }
            if (selectedobj === obj) {
                ctxed.strokeStyle = '#4af';
                ctxed.lineWidth = 2;
                ctxed.strokeRect(-obj.w/2 - 4, -obj.h/2 - 4, obj.w + 8, obj.h + 8);
            }
            ctxed.restore();
        }
    }

    document.querySelectorAll('[data-add]').forEach(btn => {
        btn.onclick = () => {
            const type = btn.dataset.add;
            const newobj = { x: 100, y: 100, w: 40, h: 40, type, color: '#6a4', rotation: 0, label: type };
            if (type === 'platform') { newobj.w = 80; newobj.h = 20; newobj.color = '#556'; }
            else if (type === 'spike') { newobj.w = 20; newobj.h = 20; newobj.color = '#c33'; }
            else if (type === 'saw') { newobj.w = 30; newobj.h = 30; newobj.color = '#aaa'; }
            else if (type === 'coin') { newobj.w = 16; newobj.h = 16; newobj.color = '#fd6'; }
            else if (type === 'enemy') { newobj.w = 26; newobj.h = 32; newobj.color = '#4a4'; }
            else if (type === 'mover') { newobj.w = 60; newobj.h = 16; newobj.color = '#6a5a8a'; }
            else if (type === 'boss') { newobj.w = 80; newobj.h = 80; newobj.color = '#822'; }
            objects.push(newobj);
            window.leveleditor_objects = objects;
            redraw();
        };
    });

    canvas.addEventListener('mousedown', e => {
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        selectedobj = null;
        for (let i = objects.length - 1; i >= 0; i--) {
            const obj = objects[i];
            const cx = obj.x + obj.w/2;
            const cy = obj.y + obj.h/2;
            const dx = mx - cx;
            const dy = my - cy;
            const rot = obj.rotation || 0;
            const cos = Math.cos(-rot);
            const sin = Math.sin(-rot);
            const lx = dx * cos - dy * sin;
            const ly = dx * sin + dy * cos;
            if (Math.abs(lx) < obj.w/2 && Math.abs(ly) < obj.h/2) {
                selectedobj = obj;
                dragobj = obj;
                dragoffx = mx - obj.x;
                dragoffy = my - obj.y;
                break;
            }
        }
        if (edmode === 'rotate' && selectedobj) {
            rotateangle = selectedobj.rotation || 0;
        }
        redraw();
    });

    canvas.addEventListener('mousemove', e => {
        if (!dragobj) return;
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        if (edmode === 'move') {
            dragobj.x = mx - dragoffx;
            dragobj.y = my - dragoffy;
        } else if (edmode === 'rotate') {
            const cx = dragobj.x + dragobj.w/2;
            const cy = dragobj.y + dragobj.h/2;
            const ang = Math.atan2(my - cy, mx - cx);
            dragobj.rotation = ang;
        }
        redraw();
    });

    canvas.addEventListener('mouseup', () => {
        dragobj = null;
        redraw();
    });

    canvas.addEventListener('touchstart', e => {
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const mx = touch.clientX - rect.left;
        const my = touch.clientY - rect.top;
        selectedobj = null;
        for (let i = objects.length - 1; i >= 0; i--) {
            const obj = objects[i];
            const cx = obj.x + obj.w/2;
            const cy = obj.y + obj.h/2;
            const dx = mx - cx;
            const dy = my - cy;
            const rot = obj.rotation || 0;
            const cos = Math.cos(-rot);
            const sin = Math.sin(-rot);
            const lx = dx * cos - dy * sin;
            const ly = dx * sin + dy * cos;
            if (Math.abs(lx) < obj.w/2 && Math.abs(ly) < obj.h/2) {
                selectedobj = obj;
                dragobj = obj;
                dragoffx = mx - obj.x;
                dragoffy = my - obj.y;
                break;
            }
        }
        redraw();
    });

    canvas.addEventListener('touchmove', e => {
        e.preventDefault();
        if (!dragobj) return;
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const mx = touch.clientX - rect.left;
        const my = touch.clientY - rect.top;
        if (edmode === 'move') {
            dragobj.x = mx - dragoffx;
            dragobj.y = my - dragoffy;
        } else if (edmode === 'rotate') {
            const cx = dragobj.x + dragobj.w/2;
            const cy = dragobj.y + dragobj.h/2;
            const ang = Math.atan2(my - cy, mx - cx);
            dragobj.rotation = ang;
        }
        redraw();
    });

    canvas.addEventListener('touchend', () => { dragobj = null; redraw(); });

    if (!scriptpanel) {
        scriptpanel = document.createElement('div');
        scriptpanel.id = 'scriptpanel';
        scriptpanel.style.cssText = 'position:absolute;bottom:10px;right:10px;background:#1a1a1a;border:1px solid #444;padding:10px;border-radius:6px;color:#ccc;font-size:12px;max-width:300px;';
        scriptpanel.innerHTML = `
            <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
                <span>script</span>
                <button id="scriptclose" style="background:none;border:none;color:#888;cursor:pointer;">✕</button>
            </div>
            <textarea id="scriptarea" style="width:100%;height:60px;background:#0a0a0a;color:#ccc;border:1px solid #333;border-radius:4px;padding:4px;font-size:11px;resize:vertical;">// onupdate\n// this.x += 1;</textarea>
            <button id="scriptapply" style="background:#2a4a6a;border:1px solid #4a8aba;color:#fff;padding:2px 8px;border-radius:4px;cursor:pointer;margin-top:4px;">apply</button>
        `;
        document.getElementById('leveleditor').appendChild(scriptpanel);
        document.getElementById('scriptclose').onclick = () => scriptpanel.style.display = 'none';
        document.getElementById('scriptapply').onclick = () => {
            const code = document.getElementById('scriptarea').value;
            if (selectedobj) {
                selectedobj.script = code;
                alert('script applied to selected object');
            }
        };
    }

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
