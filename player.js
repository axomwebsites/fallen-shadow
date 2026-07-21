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
    ctx.moveTo(-11, -8 + bob);
    ctx.lineTo(-9, -hh * 0.7);
    ctx.lineTo(-7, -hh);
    ctx.quadraticCurveTo(0, -hh - 8, 7, -hh);
    ctx.lineTo(9, -hh * 0.7);
    ctx.lineTo(11, -8 + bob);
    ctx.quadraticCurveTo(0, -4, -11, -8 + bob);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.fillRect(0, -hh * 0.7, 11, hh * 0.62);

    ctx.fillStyle = p.morphed ? '#ff2200' : sk.hood;
    ctx.beginPath();
    ctx.ellipse(2, -hh + 6, 6, 8, 0, 0, 7);
    ctx.fill();

    ctx.fillStyle = '#cbc4aa';
    ctx.fillRect(5, -hh * 0.65, 5, hh * 0.4);

    if (p.weapon) {
        ctx.fillStyle = '#888';
        ctx.fillRect(14, -hh * 0.5, 10, 4);
        ctx.fillRect(20, -hh * 0.6, 4, 10);
    }

    ctx.restore();
}
