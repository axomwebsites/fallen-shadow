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
            b.projectiles.push({ x: b.x, y: groundy - 12, vx: -5, vy: 0, r: 10, gx: true });
            b.projectiles.push({ x: b.x + b.w, y: groundy - 12, vx: 5, vy: 0, r: 10, gx: true });
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
                b.projectiles.push({ x: b.x + b.w/2, y: b.y + b.h/2, vx: Math.cos(ang+0.3)*sp*0.8, vy: Math.sin(ang+0.3)*sp*0.8, r: 6, ray: true });
                b.projectiles.push({ x: b.x + b.w/2, y: b.y + b.h/2, vx: Math.cos(ang-0.3)*sp*0.8, vy: Math.sin(ang-0.3)*sp*0.8, r: 6, ray: true });
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
                    burst(b.x + b.w/2, b.y + b.h, '#f44', 20);
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
                if (b.type === 'shadow') {
                    const ang = Math.atan2((p.y + 20) - (b.y + b.h/2 - 30), (p.x) - (b.x + b.w/2));
                    const sp = 2 + b.phase;
                    b.projectiles.push({ x: b.x + b.w/2, y: b.y + b.h/2 - 30, vx: Math.cos(ang)*sp, vy: Math.sin(ang)*sp, r: 12, dark: true });
                } else {
                    const n = 6 + b.phase * 2;
                    for (let i = 0; i < n; i++) {
                        const a = i/n * Math.PI * 2;
                        b.projectiles.push({ x: b.x + b.w/2, y: b.y + b.h/2, vx: Math.cos(a)*(3+b.phase), vy: Math.sin(a)*(3+b.phase), r: 8, dark: true });
                    }
                }
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
        ctx.fillStyle = b.baited ? '#a44' : '#822';
        ctx.fillRect(sx, sy, b.w, b.h);
        ctx.fillStyle = b.baited ? '#d88' : '#966';
        ctx.fillRect(sx + 4, sy + 4, b.w - 8, 10);
        ctx.fillStyle = '#ff0';
        ctx.shadowColor = '#ff0';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(sx + 20, sy + 28, 7, 0, 7);
        ctx.arc(sx + 60, sy + 28, 7, 0, 7);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#a00';
        ctx.beginPath();
        ctx.arc(sx + 20, sy + 28, 3, 0, 7);
        ctx.arc(sx + 60, sy + 28, 3, 0, 7);
        ctx.fill();
        ctx.fillStyle = '#600';
        ctx.beginPath();
        ctx.arc(sx + 20, sy + 42, 4, 0, 7);
        ctx.arc(sx + 60, sy + 42, 4, 0, 7);
        ctx.fill();
        for (let i = 0; i < 5; i++) {
            ctx.fillStyle = '#a33';
            ctx.beginPath();
            ctx.moveTo(sx + i*16 + 4, sy + b.h - 16);
            ctx.lineTo(sx + i*16 + 12, sy + b.h - 4);
            ctx.lineTo(sx + i*16 + 20, sy + b.h - 16);
            ctx.fill();
        }
    } else if (b.type === 'vereus') {
        const isangry = b.phase === 2;
        const scale = b.phase === 0 ? 1 : (b.phase === 1 ? 1.2 : 1.5);
        const cx = sx + b.w/2;
        const cy = sy + b.h/2;

        ctx.shadowColor = isangry ? '#f00' : '#48f';
        ctx.shadowBlur = isangry ? 40 : 20;

        ctx.fillStyle = isangry ? '#4a0a0a' : '#d4c8b8';
        ctx.beginPath();
        ctx.arc(cx, cy, 30 * scale, 0, 7);
        ctx.fill();

        for (let i = 0; i < 8; i++) {
            ctx.fillStyle = isangry ? 'rgba(80,0,0,0.3)' : 'rgba(0,0,0,0.1)';
            ctx.fillRect(cx - 25*scale + i*7, cy - 20*scale, 2, 40*scale);
        }

        ctx.fillStyle = isangry ? '#3a3a3a' : '#6a5a4a';
        ctx.beginPath();
        ctx.ellipse(cx - 20*scale, cy - 18*scale, 10*scale, 4*scale, 0.3, 0, 7);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(cx + 20*scale, cy - 18*scale, 10*scale, 4*scale, -0.3, 0, 7);
        ctx.fill();

        const eyeangle = Math.atan2((player.y + 20) - (cy), (player.x) - (cx));
        const eyedist = 12 * scale;
        const eyeoffset = 6 * scale;

        const ex1 = cx - eyedist * 0.5 + Math.cos(eyeangle)*eyeoffset;
        const ey1 = cy - 5*scale + Math.sin(eyeangle)*eyeoffset;
        const ex2 = cx + eyedist * 0.5 + Math.cos(eyeangle)*eyeoffset;
        const ey2 = cy - 5*scale + Math.sin(eyeangle)*eyeoffset;

        ctx.shadowBlur = isangry ? 30 : 15;
        ctx.shadowColor = isangry ? '#f44' : '#f00';
        ctx.fillStyle = '#ff0000';
        ctx.beginPath();
        ctx.arc(ex1, ey1, 5*scale, 0, 7);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(ex2, ey2, 5*scale, 0, 7);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(ex1 + 2*scale, ey1 + 1*scale, 2*scale, 0, 7);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(ex2 + 2*scale, ey2 + 1*scale, 2*scale, 0, 7);
        ctx.fill();

        if (isangry) {
            ctx.fillStyle = '#000';
            ctx.fillRect(cx - 20*scale, cy + 8*scale, 40*scale, 4*scale);
            for (let i = 0; i < 8; i++) {
                ctx.fillStyle = '#fff';
                const tx = cx - 18*scale + i*5*scale;
                ctx.fillRect(tx, cy + 12*scale, 2, 6*scale);
                ctx.fillRect(tx+1, cy + 14*scale, 2, 6*scale);
            }
        } else {
            ctx.fillStyle = '#4a3a3a';
            ctx.fillRect(cx - 10*scale, cy + 6*scale, 20*scale, 2*scale);
        }

        ctx.shadowBlur = 0;

        const hx = cx - 40*scale;
        const hy = cy - 30*scale;
        ctx.fillStyle = isangry ? '#6a3a3a' : '#8a7a6a';
        ctx.beginPath();
        ctx.moveTo(hx, hy);
        ctx.lineTo(hx - 15*scale, hy - 25*scale);
        ctx.lineTo(hx - 10*scale, hy - 10*scale);
        ctx.fill();
        const hx2 = cx + 40*scale;
        ctx.beginPath();
        ctx.moveTo(hx2, hy);
        ctx.lineTo(hx2 + 15*scale, hy - 25*scale);
        ctx.lineTo(hx2 + 10*scale, hy - 10*scale);
        ctx.fill();

        ctx.fillStyle = isangry ? '#8a5a5a' : '#aaa090';
        ctx.beginPath();
        ctx.arc(cx - 35*scale, cy + 15*scale, 10*scale, 0, 7);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx + 35*scale, cy + 15*scale, 10*scale, 0, 7);
        ctx.fill();

        ctx.fillStyle = isangry ? '#2a0a0a' : '#4a3a2a';
        ctx.beginPath();
        ctx.arc(cx - 35*scale, cy + 15*scale, 6*scale, 0, 7);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx + 35*scale, cy + 15*scale, 6*scale, 0, 7);
        ctx.fill();

        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        for (let i = 0; i < 4; i++) {
            const dx2 = (i - 1.5) * 15 * scale;
            ctx.fillRect(cx + dx2 - 2*scale, cy + 25*scale, 4*scale, 15*scale);
        }

        ctx.shadowBlur = 0;
        ctx.restore();

        for (const pr of b.projectiles) {
            if (!pr.ray) continue;
            const px = pr.x - camx;
            const py = pr.y - camy;
            ctx.save();
            ctx.shadowColor = '#fff';
            ctx.shadowBlur = 30;
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(px, py, pr.r, 0, 7);
            ctx.fill();
            ctx.restore();
        }

    } else {
        const op = b.baited ? 0.7 : 0.92;
        ctx.fillStyle = 'rgba(5,2,10,'+op+')';
        ctx.beginPath();
        ctx.arc(sx + b.w/2, sy + b.h/2, b.w*0.7, 0, 7);
        ctx.fill();
        ctx.shadowColor = b.telegraph > 0 ? '#f4f' : 'rgba(120,40,160,0.8)';
        ctx.shadowBlur = 30;
        ctx.strokeStyle = b.telegraph > 0 ? '#f4f' : 'rgba(120,40,160,0.7)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(sx + b.w/2, sy + b.h/2, b.w*0.7 + 6, 0, 7);
        ctx.stroke();
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#fff';
        ctx.shadowColor = '#f0f';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(sx + 22, sy + 32, 7, 0, 7);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(sx + 22, sy + 32, 3, 0, 7);
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(sx + 16, sy + 32);
        ctx.lineTo(sx + 28, sy + 32);
        ctx.stroke();

        ctx.fillStyle = '#fff';
        ctx.shadowColor = '#f0f';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(sx + 58, sy + 32, 7, 0, 7);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(sx + 58, sy + 32, 3, 0, 7);
        ctx.fill();

        ctx.fillStyle = '#fff';
        ctx.shadowColor = '#f0f';
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(sx + 40, sy + 14, 8, 0, 7);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(sx + 40, sy + 14, 4, 0, 7);
        ctx.fill();

        ctx.fillStyle = '#f0f';
        ctx.shadowColor = '#f0f';
        ctx.shadowBlur = 30;
        ctx.beginPath();
        ctx.arc(sx + 40, sy + 14, 8, 0, 7);
        ctx.stroke();
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#a0a';
        ctx.fillRect(sx + 30, sy + 48, 20, 6);
        ctx.fillRect(sx + 34, sy + 54, 12, 4);
    }
    ctx.restore();

    for (const ball of b.greenballs) {
        const px = ball.x - camx;
        const py = ball.y - camy;
        ctx.shadowColor = '#0f0';
        ctx.shadowBlur = 30;
        ctx.fillStyle = ball.onground ? '#afa' : '#0f0';
        ctx.beginPath();
        ctx.arc(px, py, ball.r, 0, 7);
        ctx.fill();
        ctx.shadowBlur = 0;
    }

    if (b.type !== 'vereus') {
        for (const pr of b.projectiles) {
            if (pr.ray) continue;
            const px = pr.x - camx;
            const py = pr.y - camy;
            ctx.fillStyle = pr.green ? '#0f0' : (pr.dark ? '#a0f' : pr.gx ? '#f80' : '#48f');
            ctx.shadowColor = ctx.fillStyle;
            ctx.shadowBlur = 12;
            ctx.beginPath();
            ctx.arc(px, py, pr.r, 0, 7);
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }
}
