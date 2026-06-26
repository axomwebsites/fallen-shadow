let storyplaying = false;
let storydone = false;

function startstory() {
    const hasseen = localStorage.getItem('fallen_shadow_story_seen');
    if (hasseen) {
        startlevel(save.unlocked <= 30 ? save.unlocked : 1);
        return;
    }
    storyplaying = true;
    document.getElementById('storyscreen').classList.remove('hidden');
    document.getElementById('startscreen').classList.add('hidden');
    const canvas = document.getElementById('storycv');
    const ctx_story = canvas.getContext('2d');
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
    let t = 0;
    const text_el = document.getElementById('storytext');
    const skip_btn = document.getElementById('storyskipbtn');

    function drawstory() {
        const w = canvas.width;
        const h = canvas.height;
        ctx_story.clearRect(0, 0, w, h);
        ctx_story.fillStyle = '#0a0810';
        ctx_story.fillRect(0, 0, w, h);

        const cx = w / 2;
        const cy = h / 2 + 40;
        ctx_story.fillStyle = '#3a2a20';
        ctx_story.fillRect(cx - 120, cy + 40, 240, 16);
        ctx_story.fillRect(cx - 100, cy + 56, 16, 50);
        ctx_story.fillRect(cx + 84, cy + 56, 16, 50);

        drawnightchar(ctx_story, cx - 70, cy + 40, 1, '#c9c2d4');
        let wifex = cx + 70;
        const kidnap = t > 3000;
        const shadowprog = Math.max(0, Math.min(1, (t - 3000) / 2000));
        if (kidnap) wifex = cx + 70 + shadowprog * (w * 0.6);
        if (shadowprog < 1) drawnightchar(ctx_story, wifex, cy + 40 - shadowprog * 120, -1, '#e8b0c8');

        const fl = Math.sin(t / 120) * 3;
        ctx_story.fillStyle = 'rgba(255,180,80,' + (0.3 + Math.sin(t / 100) * 0.1) + ')';
        ctx_story.beginPath();
        ctx_story.arc(cx, cy + 30, 18 + fl, 0, 7);
        ctx_story.fill();
        ctx_story.fillStyle = '#ffd060';
        ctx_story.beginPath();
        ctx_story.arc(cx, cy + 24, 4, 0, 7);
        ctx_story.fill();

        if (t > 2000) {
            const sp = Math.min(1, (t - 2000) / 1500);
            const shx = w - (1 - sp) * (w - (cx + 70));
            ctx_story.fillStyle = 'rgba(0,0,0,0.7)';
            ctx_story.beginPath();
            ctx_story.arc(shx, cy - 20, 40 + sp * 30, 0, 7);
            ctx_story.fill();
            ctx_story.strokeStyle = 'rgba(120,40,160,0.6)';
            ctx_story.lineWidth = 3;
            ctx_story.beginPath();
            ctx_story.arc(shx, cy - 20, 46 + sp * 30, 0, 7);
            ctx_story.stroke();
        }

        let msg = '';
        if (t < 2500) msg = 'A quiet evening... together at last.';
        else if (t < 5000) msg = 'But darkness creeps from the shadows...';
        else if (t < 7000) msg = 'SHE IS TAKEN! Chase the shadow!';
        else msg = 'Tap or click to begin your journey.';
        ctx_story.fillStyle = '#cfc8d8';
        ctx_story.textAlign = 'center';
        ctx_story.font = '20px Georgia';
        ctx_story.fillText(msg, cx, h - 80);
        if (t > 7000) {
            ctx_story.font = '14px Georgia';
            ctx_story.fillStyle = '#7a6f90';
            ctx_story.fillText('(click/tap)', cx, h - 50);
        }
    }

    function drawnightchar(ctx, x, y, facing, color) {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(facing, 1);
        ctx.fillStyle = color || '#d9d2c4';
        ctx.beginPath();
        ctx.moveTo(-14, 0);
        ctx.lineTo(-10, -30);
        ctx.lineTo(-8, -44);
        ctx.quadraticCurveTo(0, -54, 8, -44);
        ctx.lineTo(10, -30);
        ctx.lineTo(14, 0);
        ctx.quadraticCurveTo(0, 6, -14, 0);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = 'rgba(20,15,25,0.85)';
        ctx.beginPath();
        ctx.ellipse(2, -40, 7, 9, 0, 0, 7);
        ctx.fill();
        ctx.restore();
    }

    function storyloop(timestamp) {
        if (!storyplaying) return;
        t += 16;
        drawstory();
        if (t > 7000) {
            skip_btn.classList.remove('hidden');
            skip_btn.onclick = finishstory;
        }
        requestAnimationFrame(storyloop);
    }

    function finishstory() {
        storyplaying = false;
        localStorage.setItem('fallen_shadow_story_seen', '1');
        document.getElementById('storyscreen').classList.add('hidden');
        startlevel(save.unlocked <= 30 ? save.unlocked : 1);
    }

    document.getElementById('storyscreen').addEventListener('click', () => {
        if (t > 7000) finishstory();
    });

    requestAnimationFrame(storyloop);
}

function drawnightchargeneral(ctx, x, y, facing, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(facing, 1);
    ctx.fillStyle = color || '#d9d2c4';
    ctx.beginPath();
    ctx.moveTo(-14, 0);
    ctx.lineTo(-10, -30);
    ctx.lineTo(-8, -44);
    ctx.quadraticCurveTo(0, -54, 8, -44);
    ctx.lineTo(10, -30);
    ctx.lineTo(14, 0);
    ctx.quadraticCurveTo(0, 6, -14, 0);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = 'rgba(20,15,25,0.85)';
    ctx.beginPath();
    ctx.ellipse(2, -40, 7, 9, 0, 0, 7);
    ctx.fill();
    ctx.restore();
                                          }
