let level = null;
const groundy = 380;

function makelevel(n) {
    const lv = { n, platforms: [], hazards: [], coins: [], movers: [], saws: [], enemies: [], boss: null, doorx: 0, length: 0, theme: themefor(n), horror: false };
    if (n >= 21 && n <= 25) lv.horror = true;
    const isboss = (n % 10 === 0);

    if (isboss) {
        for (let i = 0; i < 30; i++) {
            lv.platforms.push({ x: i * 60, y: groundy, w: 60, h: 200, ground: true });
        }
        if (lv.horror) {
            for (let i = 0; i < 12; i++) {
                lv.enemies.push({ x: 200 + i * 130, y: groundy - 30, w: 28, h: 34, vx: 1.2, dir: 1, alive: true });
            }
        }
        lv.length = 30 * 60;
        lv.boss = makeboss(n);
        lv.doorx = lv.length - 100;
        lv.doorhidden = true;
        return lv;
    }

    let x = 0;
    const segs = 35 + n * 2;
    let y = groundy;
    lv.platforms.push({ x: 0, y: y, w: 300, h: 200, ground: true });
    x = 300;
    let rng = mulberry(n * 9301 + 49297);
    let lasttype = 0;

    for (let s = 0; s < segs; s++) {
        const r = rng();
        let type = 0;
        if (r < 0.12 && n > 2) type = 1;
        else if (r < 0.24 && n > 3) type = 2;
        else if (r < 0.36 && n > 4) type = 3;
        else if (r < 0.48 && n > 6) type = 4;
        else if (r < 0.58 && n > 8) type = 5;
        else if (r < 0.68 && n > 10) type = 6;
        else if (r < 0.78 && n > 12) type = 7;
        else if (r < 0.88 && n > 14) type = 8;
        else type = 0;

        if (type === lasttype && rng() < 0.5) type = 0;
        lasttype = type;

        if (type === 1) {
            const gap = 50 + rng() * 70;
            x += gap;
            const pw = 120 + rng() * 100;
            lv.platforms.push({ x: x, y: y, w: pw, h: 200, ground: true });
            x += pw;
        } else if (type === 2) {
            const gapw = 60 + rng() * 80;
            const pitdepth = 40 + rng() * 40;
            lv.hazards.push({ x: x + 10, y: y + 10, w: gapw - 20, h: pitdepth, type: 'spike' });
            x += gapw;
            const pw = 80 + rng() * 80;
            lv.platforms.push({ x: x, y: y, w: pw, h: 200, ground: true });
            x += pw;
        } else if (type === 3) {
            const pw = 40 + rng() * 40;
            const height = 80 + rng() * 60;
            lv.platforms.push({ x: x, y: y - height, w: pw, h: height });
            lv.platforms.push({ x: x, y: y, w: pw, h: 200, ground: true });
            lv.hazards.push({ x: x + pw * 0.1, y: y - 50, w: pw * 0.8, h: 20, type: 'low' });
            x += pw;
            const pw2 = 100 + rng() * 80;
            lv.platforms.push({ x: x, y: y, w: pw2, h: 200, ground: true });
            x += pw2;
        } else if (type === 4) {
            const pw = 120 + rng() * 80;
            lv.platforms.push({ x: x, y: y, w: pw, h: 200, ground: true });
            const count = 1 + Math.floor(rng() * 2);
            for (let i = 0; i < count; i++) {
                lv.enemies.push({ x: x + 20 + i * 40, y: y - 30, w: 26, h: 32, vx: 0.8 + rng() * 0.6, dir: 1, alive: true });
            }
            x += pw;
        } else if (type === 5) {
            const gap = 100 + rng() * 80;
            lv.movers.push({ x0: x, x: x, y: y - 50, w: 80, h: 18, range: gap, dir: 1, sp: 1 + rng() * 1.2, axis: rng() < 0.5 ? 'x' : 'y', phase: rng() * 6 });
            x += gap;
            const pw = 120 + rng() * 80;
            lv.platforms.push({ x: x, y: y, w: pw, h: 200, ground: true });
            x += pw;
        } else if (type === 6) {
            const pw = 160 + rng() * 80;
            lv.platforms.push({ x: x, y: y, w: pw, h: 200, ground: true });
            lv.saws.push({ x: x + pw * 0.5, y: y - 24, r: 24, a: 0, sp: 0.12, bx: x + pw * 0.5, range: pw * 0.35, move: rng() < 0.5, ph: rng() * 6 });
            x += pw;
        } else if (type === 7) {
            const pw = 100 + rng() * 80;
            lv.platforms.push({ x: x, y: y, w: pw, h: 200, ground: true });
            const count = 1 + Math.floor(rng() * 2);
            for (let i = 0; i < count; i++) {
                lv.movers.push({ x0: x + 20 + i * 50, x: x + 20 + i * 50, y: y - 60 - rng() * 40, w: 16, h: 16, range: 40 + rng() * 40, dir: 1, sp: 1.5 + rng() * 1.5, axis: rng() < 0.5 ? 'x' : 'y', phase: rng() * 6, spike: true });
            }
            x += pw;
        } else if (type === 8) {
            const pw = 120 + rng() * 80;
            lv.platforms.push({ x: x, y: y, w: pw, h: 200, ground: true });
            const count = 2 + Math.floor(rng() * 3);
            for (let i = 0; i < count; i++) {
                lv.hazards.push({ x: x + 10 + i * 25, y: y - 20, w: 16, h: 20, type: 'spike' });
            }
            x += pw;
        } else {
            const pw = 120 + rng() * 120;
            lv.platforms.push({ x: x, y: y, w: pw, h: 200, ground: true });
            if (rng() < 0.5) lv.coins.push({ x: x + pw * 0.5, y: y - 40, got: false });
            x += pw;
        }
        if (rng() < 0.2 && n > 5) {
            lv.platforms.push({ x: x, y: y - 60 - rng() * 40, w: 60, h: 18 });
            lv.coins.push({ x: x + 30, y: y - 100 - rng() * 40, got: false });
        }
        if (rng() < 0.15 && n > 8) {
            lv.enemies.push({ x: x + 20, y: y - 80 - rng() * 30, w: 26, h: 32, vx: 0.5 + rng() * 0.5, dir: 1, alive: true });
        }
    }
    lv.platforms.push({ x: x, y: y, w: 220, h: 200, ground: true });
    lv.doorx = x + 140;
    lv.length = x + 220;
    return lv;
}

function themefor(n) {
    if (n >= 21 && n <= 25) {
        return { sky: '#0a0005', ground: '#1a0a0a', accent: '#4a0a0a', fog: '#0a0202' };
    }
    const themes = [
        { sky: '#1a1228', ground: '#2a2236', accent: '#5a3f80', fog: '#15101e' },
        { sky: '#101824', ground: '#1c2832', accent: '#3a6f80', fog: '#0c141c' },
        { sky: '#1e1015', ground: '#301a20', accent: '#80405a', fog: '#160a0e' },
        { sky: '#15101a', ground: '#241a2e', accent: '#6a4f90', fog: '#0e0a14' }
    ];
    return themes[Math.floor((n - 1) / 3) % themes.length];
}

function makeboss(n) {
    const type = n === 10 ? 'land' : n === 20 ? 'float' : 'shadow';
    return {
        type, n,
        x: 1200,
        y: type === 'float' ? 180 : 330,
        w: 80,
        h: type === 'shadow' ? 120 : 80,
        maxhp: 100,
        hp: 100,
        phase: 0,
        phasenames: ['normal', 'fast', 'baited', 'angry'],
        t: 0,
        attackt: 0,
        dead: false,
        projectiles: [],
        shockwaves: [],
        vx: 0, vy: 0,
        baited: false,
        baitt: 0,
        telegraph: 0,
        jumpt: 0,
        hover: 0,
        greenballs: [],
        balltimer: 0
    };
}V
