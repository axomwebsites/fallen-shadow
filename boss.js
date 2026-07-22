function updateboss(dt) {
    const b = level.boss;
    const p = player;
    if (!b || b.dead) return;
    b.t += dt;
    b.attackt += dt;
    b.balltimer += dt;

    const ph = b.hp > 75 ? 0 : b.hp > 50 ? 1 : b.hp > 25 ? 2 : 3;
    if (ph !== b.phase) {
        b.phase = ph;
        bosssfx();
        shake = 10;
        b.attackt = 0;
        document.getElementById('bossphase').textContent = b.phasenames[ph];
        if (b.type === 'vereus' && ph === 2) {
            b.chargecooldown = 0;
        }
    }
    document.getElementById('bossfill').style.width = (b.hp / b.maxhp * 100) + '%';

    const spd = [1, 1.8, 1.3, 2.6][b.phase];

    if (b.type === 'land') {
        b.jumpt += dt;
        const dir = p.x > b.x ? 1 : -1;
        if (b.y >= groundy - b.h - 1) {
            b.vx += (dir * spd - b.vx) * 0.05;
            if (b.jumpt > (b.phase >= 3 ? 900 : 1500)) {
                b.vy = -14 - b.phase * 1.5;
                b.jumpt = 0;
            }
        }
        b.vy += 0.6;
        b.x += b.vx;
        b.y += b.vy;
        if (b.y > groundy - b.h) {
            b.y = groundy - b.h;
            b.vy = 0;
            if (Math.abs(b.vx) < 0.1) { burst(b.x + b.w/2, b.y + b.h, '#822', 8); shake = 6; }
        }
        b.baited = (b.phase === 2 && Math.sin(b.t/600) > 0.6);
        if (b.attackt > 1400) {
            b.attackt = 0;
            b.projectiles.push({ x: b.x + b.w/2, y: groundy - 12, vx: (p.x > b.x ? 1 : -1) * 5, vy: 0, r: 10, gx: true });
        }
    } else if (b.type === 'vereus') {
        b.hover += dt;
        const basey = b.phase === 0 ? 180 : (b.phase === 1 ? 160 : 140);
        const ty = basey + Math.sin(b.hover/500) * 30;
        const tx = p.x + Math.sin(b.hover/800) * 150;
        b.x += (tx - b.x) * 0.02 * spd;
        b.y += (ty - b.y) * 0.04;
        b.baited = (b.phase === 2 && Math.cos(b.t/700) > 0.5);

        if (b.phase === 0) {
            if (b.attackt > 900) {
                b.attackt = 0;
                const ang = Math.atan2((p.y + 20) - (b.y + b.h/2), (p.x) - (b.x + b.w/2));
                const sp = 5;
                b.projectiles.push({ x: b.x + b.w/2, y: b.y + b.h/2, vx: Math.cos(ang)*sp, vy: Math.sin(ang)*sp, r: 6, ray: true });
            }
        } else if (b.phase === 1) {
            if (b.attackt > 700) {
                b.attackt = 0;
                const ang = Math.atan2((p.y + 20) - (b.y + b.h/2), (p.x) - (b.x + b.w/2));
                const sp = 6.5;
                b.projectiles.push({ x: b.x + b.w/2, y: b.y + b.h/2, vx: Math.cos(ang)*sp, vy: Math.sin(ang)*sp, r: 8, ray: true });
            }
        } else if (b.phase === 2) {
            if (!b.charging) {
                if (b.attackt > 500) {
                    b.attackt = 0;
                    b.charging = true;
                    b.chargecooldown = 200;
                    b.chargevx = (p.x > b.x ? 1 : -1) * 8;
                    b.chargevy = -2;
                    shake = 8;
                }
            } else {
                b.x += b.chargevx * dt/16;
                b.y += b.chargevy * dt/16;
                b.chargevy += 0.5;
                if (b.y > groundy - b.h) {
                    b.y = groundy - b.h;
                    b.chargevy = 0;
                    shake = 14;
                    burst(b.x + b.w/2, b.y + b.h, '#222', 20);
                    b.charging = false;
                    b.chargecooldown = 1200;
                }
                if (b.x < 50 || b.x > level.length - 50) {
                    b.charging = false;
                    b.chargecooldown = 1000;
                }
                const dx = (p.x + p.w/2) - (b.x + b.w/2);
                const dy = (p.y + p.h/2) - (b.y + b.h/2);
                if (Math.abs(dx) < 50 && Math.abs(dy) < 50 && b.charging) {
                    playerdie();
                    return;
                }
                if (b.chargecooldown > 0) b.chargecooldown -= dt;
                else if (!b.charging) {
                    b.attackt = 500;
                }
            }
            if (b.hp < b.maxhp * 0.4 && b.hp > 0) {
                b.hp += 0.08;
                if (b.hp > b.maxhp * 0.45) b.hp = b.maxhp * 0.45;
            }
        }
    } else {
        b.hover += dt;
        b.baited = (b.phase === 2 && Math.sin(b.t/500) > 0.4);
        if (b.attackt > (b.phase >= 3 ? 1100 : 1800)) {
            b.attackt = 0;
            b.x = p.x + (Math.random() < 0.5 ? -260 : 260);
            b.x = Math.max(100, Math.min(level.length - 200, b.x));
            b.telegraph = 400;
            shake = 6;
            bosssfx();
        }
        if (b.telegraph > 0) {
            b.telegraph -= dt;
            if (b.telegraph <= 0) {
                const ang = Math.atan2((p.y + 20) - (b.y + b.h/2 - 30), (p.x) - (b.x + b.w/2));
                const sp = 2 + b.phase;
                b.projectiles.push({ x: b.x + b.w/2, y: b.y + b.h/2 - 30, vx: Math.cos(ang)*sp, vy: Math.sin(ang)*sp, r: 12, dark: true });
            }
        }
        b.y = 160 + Math.sin(b.hover/400) * 30;
    }

    if (b.balltimer > 3000 && !b.dead) {
        b.balltimer = 0;
        const starty = b.type === 'shadow' ? b.y + b.h + 30 : b.y + b.h + 10;
        const ball = { x: b.x + b.w/2, y: starty, vy: 1.2, r: 12, life: 180, onground: false };
        b.greenballs.push(ball);
        beep(300, 0.1, 'sine', 0.1);
    }

    for (let i = b.greenballs.length - 1; i >= 0; i--) {
        const ball = b.greenballs[i];
        ball.y += ball.vy;
        ball.life -= 1;
        if (ball.y >= groundy - 5) {
            ball.y = groundy - 5;
            ball.onground = true;
        }
        if (ball.y > groundy + 50 || ball.life <= 0) {
            b.greenballs.splice(i, 1);
            continue;
        }
        const dx = (p.x + p.w/2) - ball.x;
        const dy = (p.y + p.h/2) - ball.y;
        const dist = dx*dx + dy*dy;
        if (dist < (ball.r + 16)*(ball.r + 16)) {
            if (ball.onground) {
                b.greenballs.splice(i, 1);
                const ang = Math.atan2((b.y + b.h/2) - (p.y + p.h/2), (b.x + b.w/2) - (p.x + p.w/2));
                const sp = 12;
                b.projectiles.push({ x: p.x + p.w/2, y: p.y + p.h/2, vx: Math.cos(ang)*sp, vy: Math.sin(ang)*sp, r: 12, green: true });
                beep(600, 0.15, 'square', 0.15);
            } else {
                playerdie();
                return;
            }
        }
    }

    for (let i = b.projectiles.length - 1; i >= 0; i--) {
        const pr = b.projectiles[i];
        if (!pr.green) continue;
        pr.x += pr.vx;
        pr.y += pr.vy;
        const dx = (b.x + b.w/2) - pr.x;
        const dy = (b.y + b.h/2) - pr.y;
        if (dx*dx + dy*dy < (pr.r + 20)*(pr.r + 20)) {
            b.hp -= 15;
            shake = 12;
            burst(pr.x, pr.y, '#0f0', 20);
            b.projectiles.splice(i, 1);
            if (b.hp <= 0) {
                b.hp = 0;
                b.dead = true;
                shake = 20;
                burst(b.x + b.w/2, b.y + b.h/2, '#e04', 50);
                document.getElementById('bossbarwrap').classList.add('hidden');
                level.doorhidden = false;
                bosssfx();
            }
        }
        if (pr.x < camx - 100 || pr.x > camx + W + 100 || pr.y > H + 100) {
            b.projectiles.splice(i, 1);
        }
    }

    for (let i = b.projectiles.length - 1; i >= 0; i--) {
        const pr = b.projectiles[i];
        if (pr.green) continue;
        if (pr.ray) {
            pr.x += pr.vx;
            pr.y += pr.vy;
        } else {
            pr.vy = (pr.vy || 0) + 0.3;
            pr.x += pr.vx;
            pr.y += pr.vy;
            if (pr.y >= groundy - pr.r) {
                pr.y = groundy - pr.r;
                pr.vy = 0;
                pr.vx = 0;
                pr.onground = true;
                if (!pr.life) pr.life = 180;
            }
        }
        if (pr.life !== undefined) {
            pr.life -= 1;
            if (pr.life <= 0) {
                b.projectiles.splice(i, 1);
                continue;
            }
        }
        if (pr.x < camx - 100 || pr.x > camx + W + 100 || pr.y > H + 100) {
            b.projectiles.splice(i, 1);
            continue;
        }
        const dx = (p.x + p.w/2) - pr.x;
        const dy = (p.y + p.h/2) - pr.y;
        if (dx*dx + dy*dy < (pr.r + 14)*(pr.r + 14)) {
            playerdie();
            return;
        }
    }

    const hittop = p.vy > 2 && p.y + p.h < b.y + b.h*0.5 && p.x + p.w > b.x && p.x < b.x + b.w && p.y + p.h > b.y;
    const hitbait = b.baited && p.sliding && p.x + p.w > b.x && p.x < b.x + b.w && p.y + p.h > b.y && p.y < b.y + b.h;
    if (hittop || hitbait) {
        b.hp -= hitbait ? 12 : 8;
        p.vy = -10;
        p.jumpbuf = 0;
        beep(660, 0.1, 'square', 0.15);
        shake = 8;
        burst(b.x + b.w/2, b.y, '#e04', 14);
        if (b.hp <= 0) {
            b.hp = 0;
            b.dead = true;
            shake = 20;
            burst(b.x + b.w/2, b.y + b.h/2, '#e04', 50);
            document.getElementById('bossbarwrap').classList.add('hidden');
            level.doorhidden = false;
            bosssfx();
        }
    } else {
        if (p.x + p.w > b.x + 6 && p.x < b.x + b.w - 6 && p.y + p.h > b.y + 6 && p.y < b.y + b.h - 6 && !hittop) {
            playerdie();
            return;
        }
    }
}

function drawboss(camx, camy) {
    const b = level.boss;
    if (!b || b.dead) return;
    const sx = b.x - camx;
    const sy = b.y - camy;
    ctx.save();

    if (b.type === 'land') {
        const isangry = b.phase >= 2;
        ctx.shadowColor = 'rgba(0,0,0,0.6)';
        ctx.shadowBlur = 15;

        ctx.fillStyle = isangry ? '#2a0a0a' : '#4a1a1a';
        ctx.fillRect(sx + 6, sy + 10, b.w - 12, 30);
        ctx.fillRect(sx + 10, sy + 40, b.w - 20, 20);

        ctx.fillStyle = isangry ? '#4a1a1a' : '#6a2a2a';
        ctx.beginPath();
        ctx.ellipse(sx + 14, sy + 16, 10, 8, 0.2, 0, 7);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(sx + b.w - 14, sy + 16, 10, 8, -0.2, 0, 7);
        ctx.fill();

        ctx.fillStyle = isangry ? '#aaa' : '#ddd';
        ctx.shadowBlur = 5;
        ctx.beginPath();
        ctx.moveTo(sx + 20, sy + 18);
        ctx.lineTo(sx + 28, sy + 14);
        ctx.lineTo(sx + 36, sy + 18);
        ctx.lineTo(sx + 28, sy + 22);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(sx + b.w - 20, sy + 18);
        ctx.lineTo(sx + b.w - 28, sy + 14);
        ctx.lineTo(sx + b.w - 36, sy + 18);
        ctx.lineTo(sx + b.w - 28, sy + 22);
        ctx.closePath();
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.fillStyle = '#a00';
        ctx.beginPath();
        ctx.arc(sx + 24, sy + 18, 3, 0, 7);
        ctx.arc(sx + b.w - 24, sy + 18, 3, 0, 7);
        ctx.fill();

        ctx.fillStyle = isangry ? '#800' : '#a44';
        ctx.fillRect(sx + 30, sy + 32, 20, 5);
        for (let i = 0; i < 4; i++) {
            ctx.fillRect(sx + 28 + i*6, sy + 37, 3, 6);
        }

        ctx.fillStyle = isangry ? '#4a0a0a' : '#3a1a1a';
        ctx.fillRect(sx + 4, sy + 8, 6, 20);
        ctx.fillRect(sx + b.w - 10, sy + 8, 6, 20);

        ctx.fillStyle = isangry ? '#6a2a2a' : '#8a4a4a';
        for (let i = 0; i < 4; i++) {
            ctx.beginPath();
            ctx.moveTo(sx + 8 + i*12, sy + b.h - 6);
            ctx.lineTo(sx + 14 + i*12, sy + b.h - 18);
            ctx.lineTo(sx + 20 + i*12, sy + b.h - 6);
            ctx.fill();
        }

        ctx.shadowBlur = 0;
    } else if (b.type === 'vereus') {
        const isangry = b.phase === 2;
        const scale = b.phase === 0 ? 1 : (b.phase === 1 ? 1.2 : 1.5);
        const cx = sx + b.w/2;
        const cy = sy + b.h/2;

        ctx.shadowColor = 'rgba(0,0,0,0.7)';
        ctx.shadowBlur = 20;

        ctx.fillStyle = isangry ? '#1a0505' : '#c8b8a8';
        ctx.beginPath();
        ctx.ellipse(cx, cy, 28*scale, 32*scale, 0, 0, 7);
        ctx.fill();

        for (let i = 0; i < 6; i++) {
            ctx.fillStyle = isangry ? 'rgba(60,0,0,0.3)' : 'rgba(0,0,0,0.08)';
            ctx.fillRect(cx - 22*scale + i*8, cy - 24*scale, 2, 48*scale);
        }

        ctx.fillStyle = isangry ? '#2a1a1a' : '#5a4a3a';
        ctx.beginPath();
        ctx.ellipse(cx - 18*scale, cy - 20*scale, 8*scale, 3*scale, 0.3, 0, 7);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(cx + 18*scale, cy - 20*scale, 8*scale, 3*scale, -0.3, 0, 7);
        ctx.fill();

        const eyeangle = Math.atan2((player.y + 20) - (cy), (player.x) - (cx));
        const eyedist = 12 * scale;
        const eyeoffset = 6 * scale;

        const ex1 = cx - eyedist * 0.5 + Math.cos(eyeangle)*eyeoffset;
        const ey1 = cy - 5*scale + Math.sin(eyeangle)*eyeoffset;
        const ex2 = cx + eyedist * 0.5 + Math.cos(eyeangle)*eyeoffset;
        const ey2 = cy - 5*scale + Math.sin(eyeangle)*eyeoffset;

        ctx.shadowBlur = 15;
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.fillStyle = '#ff0000';
        ctx.beginPath();
        ctx.ellipse(ex1, ey1, 4*scale, 6*scale, 0, 0, 7);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(ex2, ey2, 4*scale, 6*scale, 0, 0, 7);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.ellipse(ex1 + 2*scale, ey1 + 1*scale, 2*scale, 3*scale, 0, 0, 7);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(ex2 + 2*scale, ey2 + 1*scale, 2*scale, 3*scale, 0, 0, 7);
        ctx.fill();

        if (isangry) {
            ctx.fillStyle = '#000';
            ctx.fillRect(cx - 18*scale, cy + 8*scale, 36*scale, 3*scale);
            for (let i = 0; i < 6; i++) {
                ctx.fillStyle = '#fff';
                const tx = cx - 16*scale + i*6*scale;
                ctx.fillRect(tx, cy + 11*scale, 2, 5*scale);
                ctx.fillRect(tx+1, cy + 13*scale, 2, 5*scale);
            }
        } else {
            ctx.fillStyle = '#3a2a2a';
            ctx.fillRect(cx - 10*scale, cy + 6*scale, 20*scale, 2*scale);
        }

        ctx.shadowBlur = 0;

        const hx = cx - 36*scale;
        const hy = cy - 32*scale;
        ctx.fillStyle = isangry ? '#5a2a2a' : '#7a6a5a';
        ctx.beginPath();
        ctx.moveTo(hx, hy);
        ctx.lineTo(hx - 12*scale, hy - 22*scale);
        ctx.lineTo(hx - 8*scale, hy - 8*scale);
        ctx.fill();
        const hx2 = cx + 36*scale;
        ctx.beginPath();
        ctx.moveTo(hx2, hy);
        ctx.lineTo(hx2 + 12*scale, hy - 22*scale);
        ctx.lineTo(hx2 + 8*scale, hy - 8*scale);
        ctx.fill();

        ctx.fillStyle = isangry ? '#7a4a4a' : '#9a8a7a';
        ctx.beginPath();
        ctx.ellipse(cx - 32*scale, cy + 14*scale, 8*scale, 6*scale, 0, 0, 7);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(cx + 32*scale, cy + 14*scale, 8*scale, 6*scale, 0, 0, 7);
        ctx.fill();

        ctx.fillStyle = isangry ? '#1a0a0a' : '#3a2a1a';
        ctx.beginPath();
        ctx.ellipse(cx - 32*scale, cy + 14*scale, 4*scale, 3*scale, 0, 0, 7);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(cx + 32*scale, cy + 14*scale, 4*scale, 3*scale, 0, 0, 7);
        ctx.fill();

        ctx.fillStyle = 'rgba(0,0,0,0.15)';
        for (let i = 0; i < 4; i++) {
            const dx2 = (i - 1.5) * 14 * scale;
            ctx.fillRect(cx + dx2 - 2*scale, cy + 24*scale, 4*scale, 14*scale);
        }

        ctx.shadowBlur = 0;
        ctx.restore();

        for (const pr of b.projectiles) {
            if (!pr.ray) continue;
            const px = pr.x - camx;
            const py = pr.y - camy;
            ctx.save();
            ctx.shadowColor = 'rgba(0,0,0,0.3)';
            ctx.shadowBlur = 10;
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.ellipse(px, py, pr.r, pr.r*0.6, 0, 0, 7);
            ctx.fill();
            ctx.restore();
        }

    } else if (b.type === 'shadow') {
        const isangry = b.phase >= 2;
        const cx = sx + b.w/2;
        const cy = sy + b.h/2;

        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 25;

        ctx.fillStyle = isangry ? '#0a000a' : '#050208';
        ctx.beginPath();
        ctx.ellipse(cx, cy, b.w*0.5, b.h*0.5, 0, 0, 7);
        ctx.fill();

        for (let i = 0; i < 12; i++) {
            const angle = i/12 * Math.PI * 2 + b.t/200;
            const len = b.w*0.45 + Math.sin(b.t/300 + i)*8;
            ctx.fillStyle = isangry ? 'rgba(60,0,60,0.2)' : 'rgba(30,0,40,0.2)';
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx + Math.cos(angle)*len, cy + Math.sin(angle)*len);
            ctx.lineTo(cx + Math.cos(angle+0.2)*len*0.6, cy + Math.sin(angle+0.2)*len*0.6);
            ctx.fill();
        }

        ctx.shadowBlur = 0;
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 10;

        ctx.fillStyle = isangry ? '#cc0000' : '#a040a0';
        ctx.beginPath();
        ctx.ellipse(cx - 18, cy - 8, 6, 4, 0.2, 0, 7);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(cx + 18, cy - 8, 6, 4, -0.2, 0, 7);
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.ellipse(cx - 18, cy - 8, 3, 2, 0, 0, 7);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(cx + 18, cy - 8, 3, 2, 0, 0, 7);
        ctx.fill();

        if (isangry) {
            ctx.fillStyle = '#a000a0';
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.ellipse(cx, cy + 8, 8, 5, 0, 0, 7);
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.ellipse(cx, cy + 8, 4, 2, 0, 0, 7);
            ctx.fill();
            ctx.fillStyle = '#a000a0';
            ctx.fillRect(cx - 14, cy + 18, 28, 3);
            for (let i = 0; i < 5; i++) {
                ctx.fillRect(cx - 12 + i*6, cy + 21, 3, 6);
            }
        } else {
            ctx.fillStyle = '#804080';
            ctx.fillRect(cx - 10, cy + 12, 20, 2);
        }

        ctx.shadowBlur = 0;

        ctx.fillStyle = isangry ? 'rgba(150,0,150,0.15)' : 'rgba(80,0,80,0.15)';
        for (let i = 0; i < 6; i++) {
            const a = i/6 * Math.PI * 2 + b.t/500;
            const r = b.w*0.35 + Math.sin(b.t/400 + i)*6;
            ctx.beginPath();
            ctx.ellipse(cx + Math.cos(a)*r, cy + Math.sin(a)*r, 6, 4, a, 0, 7);
            ctx.fill();
        }

        ctx.shadowColor = 'rgba(0,0,0,0.4)';
        ctx.shadowBlur = 8;
        ctx.fillStyle = isangry ? '#cc00cc' : '#600060';
        ctx.beginPath();
        ctx.ellipse(cx - 28, cy - 22, 4, 6, 0.3, 0, 7);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(cx + 28, cy - 22, 4, 6, -0.3, 0, 7);
        ctx.fill();
        ctx.shadowBlur = 0;

    } else {
        ctx.shadowColor = 'rgba(0,0,0,0.7)';
        ctx.shadowBlur = 15;
        ctx.fillStyle = 'rgba(10,5,20,0.8)';
        ctx.beginPath();
        ctx.ellipse(sx + b.w/2, sy + b.h/2, b.w*0.6, b.h*0.6, 0, 0, 7);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = 'rgba(80,40,120,0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(sx + b.w/2, sy + b.h/2, b.w*0.6+4, b.h*0.6+4, 0, 0, 7);
        ctx.stroke();

        ctx.fillStyle = '#ccc';
        ctx.beginPath();
        ctx.ellipse(sx + 22, sy + 30, 6, 4, 0.2, 0, 7);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(sx + b.w - 22, sy + 30, 6, 4, -0.2, 0, 7);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.ellipse(sx + 22, sy + 30, 3, 2, 0, 0, 7);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(sx + b.w - 22, sy + 30, 3, 2, 0, 0, 7);
        ctx.fill();

        ctx.fillStyle = '#a0a';
        ctx.fillRect(sx + 30, sy + 44, 20, 4);
        for (let i = 0; i < 4; i++) {
            ctx.fillRect(sx + 28 + i*6, sy + 48, 3, 6);
        }
    }
    ctx.restore();

    for (const ball of b.greenballs) {
        const px = ball.x - camx;
        const py = ball.y - camy;
        ctx.shadowColor = 'rgba(0,0,0,0.3)';
        ctx.shadowBlur = 10;
        ctx.fillStyle = ball.onground ? '#8a8' : '#0a0';
        ctx.beginPath();
        ctx.arc(px, py, ball.r, 0, 7);
        ctx.fill();
        ctx.shadowBlur = 0;
    }

    for (const pr of b.projectiles) {
        if (pr.ray) continue;
        const px = pr.x - camx;
        const py = pr.y - camy;
        ctx.fillStyle = pr.green ? '#0a0' : (pr.dark ? '#808' : pr.gx ? '#880' : '#448');
        ctx.shadowColor = 'rgba(0,0,0,0.3)';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(px, py, pr.r, 0, 7);
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}
