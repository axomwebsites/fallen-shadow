function mulberry(a) {
    return function() {
        a |= 0;
        a = a + 0x6d2b79f5 | 0;
        let t = Math.imul(a ^ a >>> 15, 1 | a);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}

let particles = [];
function addparticle(x, y, color, vx, vy) {
    if (!settings.particles) return;
    particles.push({
        x, y,
        vx: vx !== undefined ? vx : (Math.random() - 0.5) * 4,
        vy: vy !== undefined ? vy : -Math.random() * 4,
        life: 1,
        color,
        size: 2 + Math.random() * 3
    });
}

function burst(x, y, color, n) {
    for (let i = 0; i < n; i++) addparticle(x, y, color);
}

function updateparticles(dt) {
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.2;
        p.life -= 0.02 * (dt / 16);
        if (p.life <= 0) particles.splice(i, 1);
    }
}

function drawparticles(camx, camy) {
    for (const p of particles) {
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - camx - p.size / 2, p.y - camy - p.size / 2, p.size, p.size);
    }
    ctx.globalAlpha = 1;
}
