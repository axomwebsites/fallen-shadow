const cv = document.getElementById('cv');
const ctx = cv.getContext('2d');
let W = 0, H = 0, DPR = Math.min(window.devicePixelRatio || 1, 2);

function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    cv.width = W * DPR;
    cv.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
}
window.addEventListener('resize', resize);
resize();

const save = JSON.parse(localStorage.getItem('fallen_shadow') || '{}');
if (!save.unlocked) save.unlocked = 1;
if (!save.best) save.best = 0;
if (!save.done) save.done = [];
const settings = JSON.parse(localStorage.getItem('fs_settings') || '{}');
if (settings.sound === undefined) settings.sound = true;
if (settings.shake === undefined) settings.shake = true;
if (settings.particles === undefined) settings.particles = true;
if (settings.controlsmode === undefined) settings.controlsmode = 'auto';
controlsmode = settings.controlsmode;

function persist() { localStorage.setItem('fallen_shadow', JSON.stringify(save)); }
function persistset() { localStorage.setItem('fs_settings', JSON.stringify(settings)); }

const statemenu = 0, stateplay = 1, statepause = 2, statedead = 3, statewin = 4, stateend = 5;
let state = statemenu;
let curlevel = 1;
let score = 0;
let shake = 0;
let camx = 0, camy = 0, camzoom = 1, camtargetzoom = 1.3;
let bossdeadflag = false;
let endseq = 0, endtimer = 0, cagey = -200, wifex = 0, wifewalk = 0, heartt = 0, wifefell = false, wifefally = 0;
let settingsfrompause = false;
let graintimer = 0;
let horrorenabled = false;

const savedskin = localStorage.getItem('playerskin');
if (savedskin) {
    try { player.skin = JSON.parse(savedskin); } catch(e) {}
}

function startlevel(n) {
    curlevel = n;
    level = makelevel(n);
    horrorenabled = level.horror || false;
    if (horrorenabled) {
        scarydrone();
        setTimeout(scarydrone, 5000);
        setTimeout(monsterroar, 2000);
    }
    player.x = 100; player.y = 320; player.vx = 0; player.vy = 0; player.alive = true;
    player.crouch = false; player.sliding = false; player.slidetime = 0; player.slidecd = 0;
    player.facing = 1; player.spawnx = 100; player.spawny = 320; player.footsteptimer = 0;
    score = 0; particles = []; shake = 0; camx = 0; camy = 0; camzoom = 1; camtargetzoom = 1.3;
    state = stateplay; bossdeadflag = false; endseq = 0;
    document.getElementById('hud').classList.remove('hidden');
    document.getElementById('lvlnum').textContent = n;
    document.getElementById('best').textContent = save.best;
    updatecontrolvisibility();
    document.getElementById('bossbarwrap').classList.toggle('hidden', !level.boss);
    hideoverlays();
}

function playerdie() {
    if (!player.alive || player.godmode) {
        if (player.godmode) { player.alive = true; return; }
    }
    if (!player.alive) return;
    player.alive = false;
    hitsfx();
    shake = 18;
    burst(player.x, player.y + player.h/2, '#c44', 30);
    if (horrorenabled) scaryscreech();
    setTimeout(() => {
        state = statedead;
        document.getElementById('hud').classList.add('hidden');
        document.getElementById('touchcontrols').classList.add('hidden');
        document.getElementById('joystickwrap').classList.add('hidden');
        document.getElementById('bossbarwrap').classList.add('hidden');
        document.getElementById('gameover').classList.remove('hidden');
    }, 800);
}

function levelwin() {
    winsfx();
    state = statewin;
    if (!save.done.includes(curlevel)) save.done.push(curlevel);
    if (curlevel + 1 > save.unlocked && curlevel < 30) save.unlocked = curlevel + 1;
    if (score > save.best) { save.best = score; }
    persist();
    burst(player.x, player.y, '#6c9', 40);
    if (curlevel === 30) { startendsequence(); return; }
    setTimeout(() => {
        document.getElementById('hud').classList.add('hidden');
        document.getElementById('touchcontrols').classList.add('hidden');
        document.getElementById('joystickwrap').classList.add('hidden');
        document.getElementById('bossbarwrap').classList.add('hidden');
        document.getElementById('levelcomplete').classList.remove('hidden');
    }, 600);
}

function startendsequence() {
    endseq = 1; endtimer = 0; cagey = -300; wifex = player.x + 260; wifewalk = 0; heartt = 0; wifefell = false; wifefally = 0;
    state = stateend;
    document.getElementById('hud').classList.add('hidden');
    document.getElementById('touchcontrols').classList.add('hidden');
    document.getElementById('joystickwrap').classList.add('hidden');
    document.getElementById('bossbarwrap').classList.add('hidden');
}

function updateend(dt) {
    endtimer += dt;
    const groundy = 380;
    if (endseq === 1) {
        cagey += 8;
        if (cagey >= groundy - 90) { cagey = groundy - 90; endseq = 2; endtimer = 0; beep(150, 0.4, 'sawtooth', 0.2); shake = 10; }
    } else if (endseq === 2) {
        if (endtimer < 400) { if (Math.random() < 0.3) burst(wifex, groundy - 50, '#888', 3); } else { endseq = 3; endtimer = 0; }
    } else if (endseq === 3) {
        wifewalk += dt;
        const tx = player.x + 40;
        if (wifex > tx) { wifex -= 2; } else { endseq = 4; endtimer = 0; heartt = 0; }
    } else if (endseq === 4) {
        heartt += dt;
        if (heartt > 1800) { endseq = 5; endtimer = 0; }
    } else if (endseq === 5) {
        if (!wifefell) { wifefell = true; shake = 14; beep(100, 0.5, 'sawtooth', 0.2); burst(wifex, groundy, '#444', 20); }
        wifefally += dt * 0.5;
        if (endtimer > 1500) { endseq = 6; endtimer = 0; camtargetzoom = 2.2; }
    } else if (endseq === 6) {
        if (endtimer > 2500) { endseq = 7; endtimer = 0; shake = 12; beep(90, 0.6, 'sawtooth', 0.25); burst(player.x, player.y, '#c33', 30); }
    } else if (endseq === 7) {
        if (endtimer > 1500) { endseq = 8; endtimer = 0; document.getElementById('fadeblack').classList.add('on'); }
    } else if (endseq === 8) {
        if (endtimer > 2200) { showendtext(); endseq = 9; }
    }
    const targetcamx = player.x - (W / camtargetzoom) * 0.4;
    camx += (targetcamx - camx) * 0.04;
    camzoom += (camtargetzoom - camzoom) * 0.03;
}

function showendtext() {
    document.getElementById('endscreen').classList.remove('hidden');
    document.getElementById('fadeblack').classList.add('on');
    const el = document.getElementById('endtext');
    el.textContent = "The Fallen Shadow\nThe End\n\nDeveloper : Axom\nArtist : Acone";
    setTimeout(() => el.classList.add('show'), 300);
    setTimeout(() => {
        const b = document.createElement('button');
        b.className = 'btn';
        b.textContent = 'MAIN MENU';
        b.style.marginTop = '40px';
        b.style.opacity = 0;
        b.style.transition = 'opacity 2s';
        b.onclick = gomenu;
        document.getElementById('endscreen').appendChild(b);
        setTimeout(() => b.style.opacity = 1, 100);
    }, 6000);
}

function drawend() {
    const th = level.theme;
    ctx.save();
    ctx.translate(W/2, H/2);
    ctx.scale(camzoom, camzoom);
    ctx.translate(-W/2, -H/2);
    ctx.fillStyle = '#0a0610';
    ctx.fillRect(camx - 50, 0, W + 100, H);
    const groundy = 380;
    ctx.fillStyle = th.ground;
    ctx.fillRect(camx - 50, groundy - camy, W + 100, 200);
    if (endseq >= 5) { ctx.fillStyle = '#000'; ctx.fillRect(wifex - camx - 30, groundy - camy, 60, 200); }
    if (endseq <= 4) {
        const cy = cagey;
        ctx.strokeStyle = '#555'; ctx.lineWidth = 4;
        if (endseq < 2) {
            ctx.strokeRect(wifex - camx - 35, cy - camy, 70, 90);
            for (let i = 0; i < 5; i++) {
                ctx.beginPath();
                ctx.moveTo(wifex - camx - 35 + i * 17.5, cy - camy);
                ctx.lineTo(wifex - camx - 35 + i * 17.5, cy - camy + 90);
                ctx.stroke();
            }
        }
    }
    if (endseq >= 2 && !(endseq >= 5)) {
        drawnightchargeneral(ctx, wifex - camx, groundy - camy, -1, '#e8b0c8');
    }
    if (endseq >= 5) {
        drawnightchargeneral(ctx, wifex - camx, groundy - camy + wifefally, -1, '#e8b0c8');
    }
    if (endseq === 4 && heartt < 1500) {
        const hx = (player.x + wifex)/2 - camx, hy = groundy - 90 - camy;
        const s = 1 + Math.sin(heartt/120)*0.15;
        drawheart(ctx, hx, hy, 14*s, '#e0407a');
    }
    if (endseq < 8 || endtimer < 1500) {
        drawnightchargeneral(ctx, player.x - camx, groundy - camy, 1, '#d9d2b8');
    }
    if (endseq >= 6) {
        const hx = player.x - camx, hy = groundy - 60 - camy;
        if (endseq === 6) {
            const glow = Math.min(1, endtimer/1500);
            ctx.globalAlpha = glow;
            drawheart(ctx, hx, hy, 10, '#ff4070');
            ctx.globalAlpha = 1;
        } else if (endseq >= 7) {
            drawbrokenheart(ctx, hx, hy, 10);
        }
    }
    ctx.restore();
    drawparticles(camx, camy);
}

function drawheart(ctx, x, y, s, c) {
    ctx.save(); ctx.translate(x, y); ctx.fillStyle = c;
    ctx.beginPath();
    ctx.moveTo(0, s*0.3);
    ctx.bezierCurveTo(-s, -s*0.6, -s, s*0.4, 0, s);
    ctx.bezierCurveTo(s, s*0.4, s, -s*0.6, 0, s*0.3);
    ctx.fill();
    ctx.shadowColor = c; ctx.shadowBlur = 15; ctx.fill();
    ctx.restore();
}

function drawbrokenheart(ctx, x, y, s) {
    ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#a02040';
    ctx.beginPath(); ctx.moveTo(0, s*0.3); ctx.bezierCurveTo(-s, -s*0.6, -s, s*0.4, -2, s); ctx.lineTo(-2, s*0.3); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(2, s*0.4); ctx.bezierCurveTo(s, s*0.4, s, -s*0.6, 2, s*0.3); ctx.lineTo(2, s); ctx.closePath(); ctx.fill();
    ctx.restore();
}

function update(dt) {
    const p = player;
    if (!p.alive && !p.godmode) { updateparticles(dt); shake *= 0.9; return; }
    if (p.godmode) p.alive = true;

    if (p.slidecd > 0) { p.slidecd -= dt; if (p.slidecd < 0) p.slidecd = 0; }
    const cd_el = document.getElementById('slidecd');
    cd_el.style.height = (p.slidecd / 15000 * 100) + '%';

    let target = 0;
    if (controlsmode !== 'desktop' && (controlsmode === 'mobile' || is_mobile)) {
        if (keys.right) target = p.superspeed ? 8 : 3.6;
        else if (keys.left) target = p.superspeed ? -8 : -3.6;
    } else {
        if (keys.left) { target = p.superspeed ? -8 : -3.6; p.facing = -1; }
        else if (keys.right) { target = p.superspeed ? 8 : 3.6; p.facing = 1; }
    }
    if (p.crouch) target *= 0.5;
    if (p.sliding) {
        p.slidetime -= dt;
        p.vx = 7 * p.facing * (p.slidetime / 400 + 0.3);
        if (p.slidetime <= 0) { p.sliding = false; }
    } else {
        p.vx += (target - p.vx) * 0.25;
    }

    if (p.jumpbuf > 0) p.jumpbuf -= dt;
    if (p.onground) p.coyote = 120;
    else p.coyote -= dt;
    if ((p.jumpbuf > 0 && p.coyote > 0 && !p.crouch) || p.infinitejumps) {
        p.vy = -13.5;
        p.onground = false; p.coyote = 0; p.jumpbuf = 0; p.sliding = false;
        jumpsfx();
        p.squash = 0.7;
        burst(p.x + p.w/2, p.y + p.h, '#bbb', 6);
    }
    if (p.infinitejumps) { p.coyote = 9999; p.jumpbuf = 9999; }

    p.vy += 0.7;
    if (p.vy > 16) p.vy = 16;
    p.x += p.vx;
    p.y += p.vy;
    p.squash += (1 - p.squash) * 0.2;

    p.onground = false;
    const ph = p.crouch ? p.h * 0.6 : (p.sliding ? p.h * 0.45 : p.h);
    const allplat = [...level.platforms, ...level.movers];
    for (const pl of allplat) {
        if (p.x + p.w > pl.x && p.x < pl.x + pl.w) {
            if (p.vy >= 0 && p.y + ph <= pl.y + 12 && p.y + ph + p.vy >= pl.y) {
                p.y = pl.y - ph; p.vy = 0; p.onground = true;
                if (pl.dx) p.x += pl.dx;
                if (pl.dy) p.y += pl.dy;
            }
        }
    }

    for (const hz of level.hazards) {
        if (p.x + p.w > hz.x + 4 && p.x < hz.x + hz.w - 4 && p.y + ph > hz.y && p.y < hz.y + hz.h) {
            if (hz.type === 'low') {
                if (!p.sliding && !p.crouch && p.y + ph > hz.y + 20) { playerdie(); return; }
            } else { playerdie(); return; }
        }
    }
    for (const s of level.saws) {
        s.a += s.sp;
        if (s.move) s.x = s.bx + Math.sin(s.ph + performance.now()/700) * s.range;
        const dx = (p.x + p.w/2) - s.x, dy = (p.y + ph/2) - s.y;
        if (dx*dx + dy*dy < (s.r+12)*(s.r+12)) { playerdie(); return; }
    }

    for (const e of level.enemies) {
        if (!e.alive) continue;
        e.x += e.vx * e.dir * dt/16;
        let onplat = false;
        for (const pl of level.platforms) {
            if (e.x + e.w > pl.x && e.x < pl.x + pl.w) {
                if (e.y + e.h >= pl.y - 2 && e.y + e.h <= pl.y + 10) {
                    onplat = true;
                    if (e.x + e.w > pl.x + pl.w - 4 || e.x < pl.x + 4) {
                        e.dir *= -1;
                    }
                }
            }
        }
        if (!onplat) e.dir *= -1;
        if (p.vy > 0 && p.x + p.w > e.x + 4 && p.x < e.x + e.w - 4) {
            if (p.y + p.h > e.y && p.y + p.h < e.y + e.h/2 + 6) {
                e.alive = false;
                p.vy = -8;
                burst(e.x + e.w/2, e.y, '#fa0', 12);
                score += 100;
                beep(500, 0.1, 'square', 0.1);
                continue;
            }
        }
        if (p.x + p.w > e.x + 4 && p.x < e.x + e.w - 4 && p.y + ph > e.y + 4 && p.y < e.y + e.h - 4) {
            playerdie(); return;
        }
    }

    for (const c of level.coins) {
        if (!c.got && Math.abs(p.x + p.w/2 - c.x) < 22 && Math.abs(p.y + ph/2 - c.y) < 26) {
            c.got = true; score += 50; coinsfx(); burst(c.x, c.y, '#fd6', 10);
        }
    }
    for (const m of level.movers) {
        const prevx = m.x, prevy = m.y;
        if (m.axis === 'x') {
            m.x = m.x0 + Math.sin(m.phase + performance.now()/800 * m.sp) * m.range;
            m.dx = m.x - prevx; m.dy = 0;
        } else {
            const base = m._b || (m._b = m.y);
            m.y = base + Math.sin(m.phase + performance.now()/800 * m.sp) * 40;
            m.dy = m.y - prevy; m.dx = 0;
        }
        if (m.spike) {
    
            const dx = (p.x + p.w/2) - (m.x + m.w/2);
            const dy = (p.y + ph/2) - (m.y + m.h/2);
            if (Math.abs(dx) < m.w/2 + p.w/2 - 2 && Math.abs(dy) < m.h/2 + ph/2 - 2) {
                playerdie(); return;
            }
        }
    }

    if (p.y > H + 200) { playerdie(); return; }

    if (level.boss && !level.boss.dead) updateboss(dt);

    score = Math.max(score, Math.floor(p.x/10));
    document.getElementById('score').textContent = score;

    if (!level.doorhidden || (level.boss && level.boss.dead)) {
        if (p.x + p.w > level.doorx && p.x < level.doorx + 40 && Math.abs(p.vy) < 20) {
            if (p.x + p.w > level.doorx + 10) { levelwin(); }
        }
    }

    p.animt += Math.abs(p.vx) + 1;
    updateparticles(dt);
    shake *= 0.88;

    if (p.onground && Math.abs(p.vx) > 0.8) {
        if (!p.footsteptimer) p.footsteptimer = 0;
        p.footsteptimer += dt;
        if (p.footsteptimer > 300) {
            footstepsfx();
            p.footsteptimer = 0;
        }
    } else {
        p.footsteptimer = 300;
    }

    const tz = 1.3;
    camtargetzoom = tz;
    let tcx = p.x - (W / camtargetzoom) * 0.4;
    tcx = Math.max(0, Math.min(level.length - (W / camtargetzoom), tcx));
    camx += (tcx - camx) * 0.12;
    camy = 0;
    camzoom += (camtargetzoom - camzoom) * 0.03;
}

function render() {
    ctx.clearRect(0, 0, W, H);
    if (state === stateend) {
        ctx.save();
        if (settings.shake && shake > 0.5) { ctx.translate((Math.random()-0.5)*shake, (Math.random()-0.5)*shake); }
        drawend();
        ctx.restore();
        return;
    }
    if (!level) return;
    const th = level.theme;
    ctx.save();
    if (settings.shake && shake > 0.5) { ctx.translate((Math.random()-0.5)*shake, (Math.random()-0.5)*shake); }

    ctx.translate(W/2, H/2);
    ctx.scale(camzoom, camzoom);
    ctx.translate(-W/2, -H/2);

    const grad = ctx.createLinearGradient(camx, 0, camx, H);
    if (horrorenabled) {
        grad.addColorStop(0, '#0a0000');
        grad.addColorStop(0.5, '#1a0505');
        grad.addColorStop(1, '#0a0202');
    } else {
        grad.addColorStop(0, '#050308');
        grad.addColorStop(0.5, th.sky);
        grad.addColorStop(1, th.fog);
    }
    ctx.fillStyle = grad;
    ctx.fillRect(camx - 50, 0, W + 100, H);

    if (!horrorenabled) {
        ctx.save();
        ctx.globalAlpha = 0.08;
        for (let i = 0; i < 6; i++) {
            let angle = performance.now() / 8000 + i * 1.2;
            let x = camx + Math.sin(angle) * 300 + 200;
            ctx.fillStyle = '#7af';
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x + 60, 0);
            ctx.lineTo(x + 300 + Math.sin(angle + 0.5) * 150, H);
            ctx.lineTo(x - 300 + Math.sin(angle - 0.5) * 150, H);
            ctx.closePath();
            ctx.fill();
        }
        ctx.restore();
    } else {
        for (let i = 0; i < 20; i++) {
            let x = camx + (i * 120 + performance.now() / 1000 * 30) % (W + 200);
            let y = (i * 50 + Math.sin(i + performance.now() / 2000) * 100) % H;
            ctx.fillStyle = `rgba(180, 30, 30, ${0.1 + 0.1 * Math.sin(i + performance.now() / 300)})`;
            ctx.beginPath();
            ctx.arc(x, y, 3 + Math.sin(i + performance.now() / 500) * 2, 0, Math.PI*2);
            ctx.fill();
        }
    }

    ctx.fillStyle = th.fog;
    for (let i = 0; i < 10; i++) {
        const bx = (i * 250 - camx * 0.2) % (W + 500) - 200;
        ctx.globalAlpha = horrorenabled ? 0.2 : 0.3 + Math.sin(i + performance.now()/5000)*0.1;
        ctx.fillRect(bx, 150, 120, 400);
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = th.accent;
    ctx.globalAlpha = horrorenabled ? 0.05 : 0.1;
    for (let i = 0; i < 8; i++) {
        const bx = (i * 300 - camx * 0.4) % (W + 400) - 200;
        ctx.beginPath();
        ctx.moveTo(bx, 420);
        ctx.lineTo(bx + 60, 280);
        ctx.lineTo(bx + 120, 420);
        ctx.fill();
    }
    ctx.globalAlpha = 1;

    for (const pl of level.platforms) {
        const sx = pl.x - camx, sy = pl.y - camy;
        if (sx > W || sx + pl.w < 0) continue;
        ctx.fillStyle = horrorenabled ? '#2a1010' : th.ground;
        ctx.fillRect(sx, sy, pl.w, pl.h);
        if (horrorenabled) {
            ctx.fillStyle = 'rgba(80, 0, 0, 0.4)';
        } else {
            ctx.fillStyle = 'rgba(0,0,0,0.6)';
        }
        ctx.fillRect(sx, sy, pl.w, 8);
        ctx.fillStyle = th.accent;
        ctx.globalAlpha = horrorenabled ? 0.2 : 0.15;
        ctx.fillRect(sx, sy + 8, pl.w, 2);
        ctx.globalAlpha = 1;
    }
    for (const m of level.movers) {
        const sx = m.x - camx, sy = m.y - camy;
        if (m.spike) {
            ctx.fillStyle = '#f44';
            ctx.shadowColor = '#f00';
            ctx.shadowBlur = 20;
            ctx.fillRect(sx, sy, m.w, m.h);
            ctx.shadowBlur = 0;
        } else {
            ctx.fillStyle = horrorenabled ? '#3a1010' : '#3a3050';
            ctx.shadowColor = horrorenabled ? '#f00' : '#6af';
            ctx.shadowBlur = 15;
            ctx.fillRect(sx, sy, m.w, m.h);
            ctx.shadowBlur = 0;
            ctx.fillStyle = th.accent;
            ctx.fillRect(sx, sy, m.w, 4);
        }
    }
    for (const hz of level.hazards) {
        const sx = hz.x - camx, sy = hz.y - camy;
        if (hz.type === 'spike') {
            ctx.fillStyle = horrorenabled ? '#f44' : '#a33';
            ctx.shadowColor = '#f44';
            ctx.shadowBlur = 10;
            const n = Math.floor(hz.w / 16);
            for (let i = 0; i < n; i++) {
                ctx.beginPath();
                ctx.moveTo(sx + i * 16, sy + hz.h);
                ctx.lineTo(sx + i * 16 + 8, sy);
                ctx.lineTo(sx + i * 16 + 16, sy + hz.h);
                ctx.fill();
            }
            ctx.shadowBlur = 0;
        } else {
            ctx.fillStyle = '#332';
            ctx.fillRect(sx, sy, hz.w, hz.h);
            ctx.fillStyle = '#553';
            ctx.fillRect(sx, sy, hz.w, 4);
            ctx.fillStyle = '#a33';
            ctx.fillRect(sx, sy + hz.h - 3, hz.w, 3);
        }
    }
    for (const s of level.saws) {
        const sx = s.x - camx, sy = s.y - camy;
        ctx.save();
        ctx.translate(sx, sy);
        ctx.rotate(s.a);
        ctx.shadowColor = horrorenabled ? '#f00' : '#f80';
        ctx.shadowBlur = 20;
        ctx.fillStyle = horrorenabled ? '#f88' : '#ccc';
        ctx.beginPath();
        for (let i = 0; i < 12; i++) {
            const a = i/12 * Math.PI * 2;
            const r = i%2 ? s.r : s.r * 0.6;
            ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
        }
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#444';
        ctx.beginPath();
        ctx.arc(0, 0, s.r * 0.3, 0, 7);
        ctx.fill();
        ctx.restore();
    }
    for (const c of level.coins) {
        if (c.got) continue;
        const sx = c.x - camx, sy = c.y - camy + Math.sin(performance.now()/300 + c.x) * 4;
        ctx.shadowColor = horrorenabled ? '#f80' : '#fd6';
        ctx.shadowBlur = 20;
        ctx.fillStyle = horrorenabled ? '#f90' : '#fd6';
        ctx.beginPath();
        ctx.arc(sx, sy, 8, 0, 7);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#a80';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = '#a80';
        ctx.fillRect(sx - 1, sy - 4, 2, 8);
    }

    for (const e of level.enemies) {
        if (!e.alive) continue;
        const sx = e.x - camx, sy = e.y - camy;
        ctx.fillStyle = horrorenabled ? '#d44' : '#4a4';
        ctx.shadowColor = horrorenabled ? '#f00' : '#0a0';
        ctx.shadowBlur = 10;
        ctx.fillRect(sx, sy, e.w, e.h);
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#fff';
        ctx.fillRect(sx + 4, sy + 4, 4, 4);
        ctx.fillRect(sx + e.w - 8, sy + 4, 4, 4);
        ctx.fillStyle = '#000';
        ctx.fillRect(sx + 6, sy + 6, 2, 2);
        ctx.fillRect(sx + e.w - 6, sy + 6, 2, 2);
    }

    drawboss(camx, camy);

    if (!level.doorhidden || (level.boss && level.boss.dead)) {
        const sx = level.doorx - camx, sy = 380 - camy;
        ctx.shadowColor = horrorenabled ? '#f44' : '#a8f';
        ctx.shadowBlur = 30;
        ctx.fillStyle = horrorenabled ? '#200' : '#1a1020';
        ctx.fillRect(sx - 4, sy - 70, 40, 70);
        const glow = 0.5 + Math.sin(performance.now()/300) * 0.3;
        ctx.fillStyle = horrorenabled ? `rgba(255,50,50,${glow})` : `rgba(180,140,255,${glow})`;
        ctx.fillRect(sx, sy - 62, 28, 58);
        ctx.shadowBlur = 0;
    }

    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur = 20;
    if (player.alive) drawplayer(camx, camy);
    ctx.shadowBlur = 0;
    drawparticles(camx, camy);
    ctx.restore();

    graintimer += 1;
    if (graintimer % 2 === 0) {
        const grainCount = horrorenabled ? 120 : 60;
        for (let i = 0; i < grainCount; i++) {
            ctx.fillStyle = horrorenabled ? `rgba(255,0,0,${Math.random() * 0.04})` : `rgba(255,255,255,${Math.random() * 0.025})`;
            ctx.fillRect(Math.random() * W, Math.random() * H, 2, 2);
        }
    }

    ctx.fillStyle = 'rgba(0,0,0,0.03)';
    for (let i = 0; i < H; i += 3) {
        ctx.fillRect(0, i, W, 1);
    }

    const vg = ctx.createRadialGradient(W/2, H/2, H*0.1, W/2, H/2, H*0.9);
    if (horrorenabled) {
        vg.addColorStop(0, 'rgba(0,0,0,0)');
        vg.addColorStop(0.4, 'rgba(30,0,0,0.3)');
        vg.addColorStop(1, 'rgba(60,0,0,0.8)');
    } else {
        vg.addColorStop(0, 'rgba(0,0,0,0)');
        vg.addColorStop(0.5, 'rgba(0,0,0,0.2)');
        vg.addColorStop(1, 'rgba(0,0,0,0.7)');
    }
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, W, H);

    if (player.weapon && player.alive) {
        ctx.fillStyle = 'rgba(255,200,50,0.1)';
        ctx.beginPath();
        ctx.arc(W/2, H/2, 60, 0, Math.PI*2);
        ctx.fill();
    }
}

let last = performance.now();
function gameloop(now) {
    let dt = now - last;
    last = now;
    if (dt > 50) dt = 50;

    if (state === stateplay) update(dt);
    else if (state === stateend) updateend(dt);
    else { updateparticles(dt); shake *= 0.9; }
    render();
    requestAnimationFrame(gameloop);
}

function init() {
    setupinput();
    setupui();
    document.getElementById('best').textContent = save.best;
    requestAnimationFrame(gameloop);
}

init();
