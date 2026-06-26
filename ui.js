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
    ['startscreen', 'levelselect', 'pausemenu', 'settingsmenu', 'gameover', 'levelcomplete', 'endscreen', 'storyscreen'].forEach(id => {
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
    document.getElementById('playbtn').onclick = () => { getaudioctx();
        startstory(); };
    document.getElementById('levelsbtn').onclick = () => { buildlevelgrid();
        hideoverlays();
        document.getElementById('levelselect').classList.remove('hidden'); };
    document.getElementById('lvlback').onclick = gomenu;
    document.getElementById('pausebtn').onclick = pausegame;
    document.getElementById('resumebtn').onclick = resumegame;
    document.getElementById('menubtn').onclick = gomenu;
    document.getElementById('settingsbtn').onclick = () => { document.getElementById('pausemenu').classList.add('hidden');
        opensettings(true); };
    document.getElementById('settingsbtn2').onclick = () => { opensettings(false); };
    document.getElementById('settingsback').onclick = () => {
        document.getElementById('settingsmenu').classList.add('hidden');
        if (settingsfrompause) { document.getElementById('pausemenu').classList.remove('hidden');
            updatecontrolvisibility(); } else { document.getElementById('startscreen').classList.remove('hidden'); }
    };
    document.getElementById('retrybtn').onclick = () => startlevel(curlevel);
    document.getElementById('gomenubtn').onclick = gomenu;
    document.getElementById('nextbtn').onclick = () => startlevel(curlevel + 1);
    document.getElementById('lcmenubtn').onclick = gomenu;
    document.getElementById('edithudbtn').onclick = toggleeditmode;

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
