let level = null;
const groundy = 380;

function makelevel(n) {
    const lv = { n, platforms: [], hazards: [], coins: [], movers: [], saws: [], boss: null, doorx: 0, length: 0, theme: themefor(n) };
    const isboss = (n % 10 === 0);

    if (isboss) {
        for (let i = 0; i < 26; i++) {
            lv.platforms.push({ x: i * 60, y: groundy, w: 60, h: 200, ground: true });
        }
        lv.length = 26 * 60;
        lv.boss = makeboss(n);
        lv.doorx = lv.length - 100;
        lv.doorhidden = true;
        return lv;
    }

    let x = 0;
    const segs = 40 + n * 2;
    let y = groundy;
    lv.platforms.push({ x: 0, y: y, w: 300, h: 200, ground: true });
    x = 300;
    let rng = mulberry(n * 9301 + 49297);

    for (let s = 0; s < segs; s++) {
        const r = rng();
        if (r < 0.18 && n > 1) {
            const gap = 60 + rng() * (50 + n * 2.5);
            x += gap;
            const pw = 140 + rng() * 120;
            lv.platforms.push({ x: x, y: y, w: pw, h: 200, ground: true });
            x += pw;
        } else if (r < 0.32) {
            const pw = 180 + rng() * 100;
            lv.hazards.push({ x: x, y: y - 10, w: pw, h: 20, type: 'spike' });
            lv.platforms.push({ x: x, y: y, w: pw, h: 200, ground: true });
            x += pw;
        } else if (r < 0.46 && n > 3) {
            const pw = 120 + rng() * 80;
            lv.platforms.push({ x: x, y: y, w: pw, h: 200, ground: true });
            lv.platforms.push({ x: x + pw * 0.3, y: y - 90 - rng() * 40, w: 90, h: 18 });
            lv.coins.push({ x: x + pw * 0.3 + 30, y: y - 130 - rng() * 40, got: false });
            x += pw;
        } else if (r < 0.58 && n > 5) {
            const gap = 120 + rng() * 80;
            lv.movers.push({ x0: x, x: x, y: y - 50, w: 90, h: 18, range: gap, dir: 1, sp: 1 + rng() * 1.2, axis: rng() < 0.5 ? 'x' : 'y', phase: rng() * 6 });
            x += gap;
            const pw = 140 + rng() * 80;
            lv.platforms.push({ x: x, y: y, w: pw, h: 200, ground: true });
            x += pw;
        } else if (r < 0.70 && n > 7) {
            const pw = 200 + rng() * 80;
            lv.platforms.push({ x: x, y: y, w: pw, h: 200, ground: true });
            lv.saws.push({ x: x + pw * 0.5, y: y - 24, r: 24, a: 0, sp: 0.12, bx: x + pw * 0.5, range: pw * 0.35, move: rng() < 0.5, ph: rng() * 6 });
            x += pw;
        } else if (r < 0.80 && n > 4) {
            const pw = 200 + rng() * 80;
            lv.platforms.push({ x: x, y: y, w: pw, h: 200, ground: true });
            lv.hazards.push({ x: x + pw * 0.4, y: y - 70, w: 30, h: 70, type: 'low' });
            x += pw;
        } else {
            const pw = 180 + rng() * 140;
            lv.platforms.push({ x: x, y: y, w: pw, h: 200, ground: true });
            if (rng() < 0.5) lv.coins.push({ x: x + pw * 0.5, y: y - 40, got: false });
            x += pw;
        }
        if (rng() < 0.25 && n > 9) {
            lv.platforms.push({ x: x, y: y - 60, w: 70, h: 18 });
            lv.coins.push({ x: x + 35, y: y - 100, got: false });
        }
    }
    lv.platforms.push({ x: x, y: y, w: 220, h: 200, ground: true });
    lv.doorx = x + 140;
    lv.length = x + 220;
    return lv;
}

function themefor(n) {
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
        hover: 0
    };
        }
