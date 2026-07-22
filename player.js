const player = {
    x: 100, y: 0, w: 26, h: 46,
    vx: 0, vy: 0,
    onground: false,
    crouch: false,
    sliding: false,
    slidetime: 0,
    slidecd: 0,
    facing: 1,
    alive: true,
    animt: 0,
    coyote: 0,
    jumpbuf: 0,
    squash: 1,
    spawnx: 100,
    spawny: 0,
    footsteptimer: 0,
    godmode: false,
    infinitejumps: false,
    superspeed: false,
    skin: { color: '#d9d2b8', hood: '#100c16', size: 1 },
    weapon: false,
    morphed: false
};

function drawplayer(camx, camy) {
    const p = player;
    const sk = p.skin;
    ctx.save();
    const sx = p.x - camx;
    const sy = p.y - camy;
    ctx.translate(sx + p.w/2, sy + p.h);
    ctx.scale(p.facing, 1);
    let bob = p.onground ? Math.sin(p.animt * 0.25) * 1.5 : 0;
    const sq = p.squash;
    ctx.scale(1/sq, sq);
    const hh = p.crouch ? p.h * 0.6 : (p.sliding ? p.h * 0.45 : p.h);
    const sz = sk.size || 1;
    ctx.scale(sz, sz);

    if (!p.sliding) {
        const stride = Math.sin(p.animt * 0.3) * 5 * (Math.abs(p.vx) > 0.5 ? 1 : 0);
        ctx.fillStyle = '#1a1620';
        ctx.fillRect(-8, -10, 6, 12 + stride);
        ctx.fillRect(3, -10, 6, 12 - stride);
    }

    ctx.fillStyle = p.morphed ? '#4a0a0a' : sk.color;
    ctx.beginPath();
    ctx.moveTo(-14, -6 + bob);
    ctx.lineTo(-12, -hh * 0.5);
    ctx.lineTo(-10, -hh * 0.75);
    ctx.lineTo(-7, -hh);
    ctx.quadraticCurveTo(0, -hh - 12, 7, -hh);
    ctx.lineTo(10, -hh * 0.75);
    ctx.lineTo(12, -hh * 0.5);
    ctx.lineTo(14, -6 + bob);
    ctx.quadraticCurveTo(0, -2, -14, -6 + bob);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fillRect(-10, -hh * 0.6, 20, hh * 0.4);

    ctx.fillStyle = p.morphed ? '#ff2200' : sk.hood;
    ctx.beginPath();
    ctx.ellipse(2, -hh + 8, 8, 10, 0, 0, 7);
    ctx.fill();

    ctx.fillStyle = p.morphed ? '#ff4400' : '#e0e0ff';
    ctx.shadowColor = '#8af';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(-3, -hh + 5, 2.5, 0, 7);
    ctx.arc(7, -hh + 5, 2.5, 0, 7);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#100c16';
    ctx.beginPath();
    ctx.arc(-3, -hh + 5, 1.2, 0, 7);
    ctx.arc(7, -hh + 5, 1.2, 0, 7);
    ctx.fill();

    ctx.fillStyle = '#cbc4aa';
    ctx.fillRect(5, -hh * 0.55, 5, hh * 0.35);
    ctx.fillRect(-10, -hh * 0.55, 5, hh * 0.35);

    ctx.fillStyle = '#8a7a6a';
    ctx.fillRect(9, -hh * 0.4, 8, 3);
    ctx.fillRect(-17, -hh * 0.4, 8, 3);

    if (p.weapon) {
        ctx.fillStyle = '#aaa';
        ctx.shadowColor = '#ff0';
        ctx.shadowBlur = 12;
        ctx.fillRect(14, -hh * 0.5, 14, 4);
        ctx.fillRect(24, -hh * 0.65, 4, 12);
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#666';
        ctx.fillRect(26, -hh * 0.6, 2, 8);
    }

    ctx.restore();
}
