import { inputs, drawvirtualcontrols } from "./controls.js";
import { drawstylizedcharacter } from "./engine.js";
const canvasEl = document.getElementById("gamecanvas");
window.ctx = canvasEl.getContext("2d");
let scene = "menu"; let introtimer = 0; let currentstage = 1; let unlockedstage = 1; let fadealpha = 0; let fademode = "none"; let levelwidth = 4000;
let menuscrollx = 0; let targetmenuscrollx = 0;
let player = {x:100,y:350,vx:0,vy:0,w:44,h:68,onground:false,state:"idle",flip:false,ticks:0,dashtimer:0,slidetimer:0,dashcooldown:0,crouching:false,dead:false,deathtimer:0,invulnerable:0};
let platforms = []; let hazards = []; let enemies = []; let goals = []; let bosses = []; let particles = []; let camx = 0;
let outroscenestage = 0; let outrotimer = 0; let cageshake = 0; let cagey = -100; let cagebroken = false; let wifex = 0; let wifey = 0; let wifealive = true;
let heartalpha = 1; let heartscale = 1; let heartsnapeffect = 0; let tearsy = 0; let scrolly = 600;
if(localStorage.getItem("fallenshadow_unlocked")){ unlockedstage = parseInt(localStorage.getItem("fallenshadow_unlocked"),10); }
async function loadstage(stgnum) {
platforms = []; hazards = []; enemies = []; goals = []; bosses = []; particles = [];
try {
let mod = await import(`./stages/stage${stgnum}.js`); mod.init(platforms, hazards, enemies, goals, bosses); levelwidth = mod.width || 4000;
} catch(e) { buildfallbackstage(stgnum); }
player.x = 100; player.y = 300; player.vx = 0; player.vy = 0; player.dead = false; player.deathtimer = 0; player.state = "idle"; camx = 0;
}
function buildfallbackstage(num) {
levelwidth = 3000 + num * 500; platforms.push({x:0,y:450,w:800,h:200}); let cx = 750; let cy = 450;
while(cx < levelwidth - 500){
let g = 90 + Math.random()*80; let w = 200 + Math.random()*200; cy += (Math.random()-0.5)*100; if(cy > 480) cy = 480; if(cy < 280) cy = 280;
platforms.push({x:cx+g,y:cy,w:w,h:300}); if(Math.random()<0.5){ hazards.push({x:cx+g+50,y:cy-15,w:30,h:15,type:"spike"}); } cx += g + w;
}
platforms.push({x:levelwidth-450,y:450,w:450,h:200});
if(num % 10 === 0){ bosses.push({x:levelwidth-350,y:350,w:90,h:110,hp:5+(num/10)*4,maxhp:5+(num/10)*4,ticks:0,state:"idle",type:num===30?"void":"normal"}); } 
else { goals.push({x:levelwidth-150,y:390,w:50,h:60}); }
}
function boxcollide(b1,b2){return b1.x<b2.x+b2.w&&b1.x+b1.w>b2.x&&b1.y<b2.y+b2.h&&b1.y+b1.h>b2.y;}
function spawnparticle(x,y,color,count){
for(let i=0;i<count;i++){ particles.push({x:x,y:y,vx:(Math.random()-0.5)*10,vy:(Math.random()-0.5)*10,life:40,maxlife:40,color:color,sz:Math.random()*5+2}); }
}
function updatemenu() {
ctx.clearRect(0,0,960,540); ctx.fillStyle="#06040a"; ctx.fillRect(0,0,960,540);
menuscrollx += (targetmenuscrollx - menuscrollx) * 0.1;
ctx.fillStyle="#fff"; ctx.font="bold 32px sans-serif"; ctx.textAlign="center"; ctx.fillText("SELECT STAGE",480,60); ctx.font="14px sans-serif"; ctx.fillText("USE LEFT/RIGHT KEYS OR SWIPE TO NAVIGATE. PRESS SPACE OR TAP TO PLAY",480,95);
for(let i=1;i<=30;i++){
let cardx = 480 + (i - 1) * 260 - menuscrollx;
if(cardx < -200 || cardx > 1160) continue;
ctx.save(); ctx.translate(cardx, 280);
let islocked = i > unlockedstage;
ctx.fillStyle = islocked ? "#1a1625" : i === currentstage ? "#3d2b61" : "#251a3a";
ctx.strokeStyle = i === currentstage ? "#ffd700" : "#4a3b68"; ctx.lineWidth = islocked ? 2 : 4;
ctx.fillRect(-100,-120,200,240); ctx.strokeRect(-100,-120,200,240);
ctx.fillStyle="#fff"; ctx.font="bold 24px sans-serif"; ctx.fillText("STAGE "+i,0,-60);
if(islocked){ ctx.fillStyle="#ef5350"; ctx.font="16px sans-serif"; ctx.fillText("LOCKED",0,20); } 
else {
ctx.fillStyle="#66bb6a"; ctx.font="16px sans-serif"; ctx.fillText("UNLOCKED",0,20);
if(i%10===0){ ctx.fillStyle="#ff9100"; ctx.font="bold 14px sans-serif"; ctx.fillText("BOSS TIER",0,50); }
}
ctx.restore();
}
ctx.textAlign="left";
}
window.addEventListener("keydown",e=>{
if(scene!=="menu")return;
if(e.key==="ArrowRight"||e.key==="d"){ currentstage=Math.min(30,currentstage+1); targetmenuscrollx=(currentstage-1)*260; }
if(e.key==="ArrowLeft"||e.key==="a"){ currentstage=Math.max(1,currentstage-1); targetmenuscrollx=(currentstage-1)*260; }
if(e.key===" "||e.key==="Enter"){
if(currentstage<=unlockedstage){ document.getElementById("ui").innerHTML=""; introtimer=0; scene=currentstage===1?"intro":"game"; if(scene==="game")loadstage(currentstage); }
}
});
document.getElementById("touchcontrolslayer").addEventListener("click",e=>{
if(scene!=="menu")return;
let rect = canvasEl.getBoundingClientRect();
let mx = ((e.clientX - rect.left) / rect.width) * 960;
let my = ((e.clientY - rect.top) / rect.height) * 540;
if(my>160 && my<400){
if(mx<200){ currentstage=Math.max(1,currentstage-1); targetmenuscrollx=(currentstage-1)*260; }
else if(mx>760){ currentstage=Math.min(30,currentstage+1); targetmenuscrollx=(currentstage-1)*260; }
else { if(currentstage<=unlockedstage){ document.getElementById("ui").innerHTML=""; introtimer=0; scene=currentstage===1?"intro":"game"; if(scene==="game")loadstage(currentstage); } }
}
});
function updategame() {
if(player.invulnerable > 0) player.invulnerable--;
if(player.dead){ player.deathtimer++; if(player.deathtimer > 50) loadstage(currentstage); return; }
if(player.dashcooldown > 0) player.dashcooldown--;
if(player.dashtimer > 0){
player.dashtimer--; player.vy = 0; player.vx = player.flip ? -16 : 16; player.x += player.vx;
spawnparticle(player.x+player.w/2, player.y+player.h/2, "#fff", 1);
for(let p of platforms){ if(boxcollide(player, p)){ player.dashtimer=0; break; } }
checkcollisions(); return;
}
if(player.slidetimer > 0){
player.slidetimer--; player.vx = player.flip ? -10 : 10; player.vx *= 0.94; player.x += player.vx; player.state = "slide"; player.h = 36;
spawnparticle(player.x+(player.flip?player.w:0), player.y+player.h, "#aaa", 1);
player.vy += 0.6; player.y += player.vy; resolveplatforms(); checkcollisions(); return;
}
if(inputs.dash && player.dashcooldown === 0){ player.dashtimer = 14; player.dashcooldown = 40; return; }
if(inputs.slide && player.onground){ player.slidetimer = 22; return; }
if(inputs.crouch){ player.crouching = true; player.h = 46; player.state = "crouch"; } 
else { player.crouching = false; player.h = 68; }
let speed = player.crouching ? 2.5 : 6;
if(inputs.left){ player.vx = -speed; player.flip = true; if(!player.crouching) player.state = player.onground?"run":"jump"; }
else if(inputs.right){ player.vx = speed; player.flip = false; if(!player.crouching) player.state = player.onground?"run":"jump"; }
else { player.vx = 0; if(player.onground) player.state = player.crouching?"crouch":"idle"; else player.state="jump"; }
if(inputs.jump && player.onground){ player.vy = -14; player.onground = false; }
player.vy += 0.6; if(player.vy > 15) player.vy = 15;
player.x += player.vx; resolveplatforms(); player.y += player.vy; player.onground = false; resolveplatforms(); checkcollisions();
if(player.y > 600) triggerdeath();
for(let g of goals){
if(boxcollide(player, g)){
if(currentstage === 30){ scene = "outro"; outroscenestage = 1; outrotimer = 0; } 
else {
currentstage++; unlockedstage = Math.max(unlockedstage, currentstage); localStorage.setItem("fallenshadow_unlocked", unlockedstage);
fademode = "tonextstage";
}
}
}
}
function resolveplatforms() {
for(let p of platforms){
if(boxcollide(player, p)){
let ox = Math.min(player.x+player.w, p.x+p.w) - Math.max(player.x, p.x); let oy = Math.min(player.y+player.h, p.y+p.h) - Math.max(player.y, p.y);
if(ox < oy){ if(player.x+player.w/2 < p.x+p.w/2) player.x -= ox; else player.x += ox; player.vx = 0; } 
else { if(player.y+player.h/2 < p.y+p.h/2){ player.y -= oy; player.vy = 0; player.onground = true; } else { player.y += oy; if(player.vy < 0) player.vy = 0; } }
}
}
}
function checkcollisions() {
for(let h of hazards){ if(boxcollide(player, h)) triggerdeath(); }
if(player.invulnerable > 0) return;
for(let e of enemies){
if(boxcollide(player, e)){
if(player.state === "slide" || player.dashtimer > 0 || (player.vy > 0 && player.y+player.h-player.vy <= e.y+15)){ e.dead = true; spawnparticle(e.x+e.w/2, e.y+e.h/2, "#ff3333", 12); if(player.vy>0) player.vy = -8; } 
else { triggerdeath(); }
}
}
for(let b of bosses){
if(boxcollide(player, b)){
if(player.state === "slide" || player.dashtimer > 0 || (player.vy > 0 && player.y+player.h-player.vy <= b.y+25)){
b.hp--; player.invulnerable = 25; spawnparticle(b.x+b.w/2, b.y+b.h/2, "#ff9100", 20); if(player.vy > 0) player.vy = -11;
if(b.hp <= 0){
b.dead = true; spawnparticle(b.x+b.w/2, b.y+b.h/2, "#ff1111", 50);
if(currentstage === 30){ scene = "outro"; outroscenestage = 1; outrotimer = 0; cagey = -100; } 
else { goals.push({x:b.x+80,y:b.y+30,w:50,h:60}); }
}
} else { triggerdeath(); }
}
}
}
function triggerdeath() { if(!player.dead){ player.dead = true; player.deathtimer = 0; spawnparticle(player.x+player.w/2, player.y+player.h/2, "#ff5722", 25); } }
function updateentities() {
for(let i=enemies.length-1;i>=0;i--){ let e = enemies[i]; if(e.dead){ enemies.splice(i,1); continue; } e.ticks = (e.ticks || 0) + 1; e.x += e.vx; if(e.x < e.minx || e.x > e.maxx) e.vx = -e.vx; }
for(let b of bosses){ b.ticks++; let cd = currentstage === 30 ? 40 : currentstage === 20 ? 60 : 80; if(b.ticks % cd === 0){ hazards.push({x:b.x-20,y:b.y+30,vx:-(5+(currentstage/5)),vy:0,w:20,h:20,type:"projectile"}); } }
for(let i=hazards.length-1;i>=0;i--){ let h = hazards[i]; if(h.type==="projectile"){ h.x += h.vx; if(h.x < camx - 100) hazards.splice(i,1); } }
for(let i=particles.length-1;i>=0;i--){ let p = particles[i]; p.x += p.vx; p.y += p.vy; p.life--; if(p.life<=0) particles.splice(i,1); }
}
function drawgame() {
ctx.clearRect(0,0,960,540); camx = player.x - 300; if(camx < 0) camx = 0; if(camx > levelwidth-960) camx = levelwidth-960;
let bggrad = ctx.createLinearGradient(0,0,0,540); bggrad.addColorStop(0,"#070714"); bggrad.addColorStop(1, "#160f24"); ctx.fillStyle = bggrad; ctx.fillRect(0,0,960,540);
ctx.save(); ctx.translate(-camx, 0); ctx.fillStyle = "#23183a";
for(let p of platforms){ ctx.fillRect(p.x,p.y,p.w,p.h); ctx.strokeStyle="#3d2b61"; ctx.lineWidth=3; ctx.strokeRect(p.x,p.y,p.w,p.h); }
ctx.fillStyle = "#d32f2f";
for(let h of hazards){
if(h.type==="spike"){ ctx.beginPath(); ctx.moveTo(h.x,h.y+h.h); ctx.lineTo(h.x+h.w/2,h.y); ctx.lineTo(h.x+h.w,h.y+h.h); ctx.fill(); }
else if(h.type==="projectile"){ ctx.fillStyle="#ff3d00"; ctx.beginPath(); ctx.arc(h.x+10,h.y+10,10,0,Math.PI*2); ctx.fill(); }
}
for(let e of enemies){ ctx.fillStyle="#6a1b9a"; ctx.fillRect(e.x,e.y,e.w,e.h); }
for(let b of bosses){ drawstylizedcharacter(ctx, b.x+b.w/2, b.y+b.h/2, true, "idle", b.ticks, false, b.type==="void"); }
ctx.fillStyle = "#ffd700"; for(let g of goals){ ctx.fillRect(g.x,g.y,g.w,g.h); }
for(let p of particles){ ctx.fillStyle=p.color; ctx.globalAlpha=p.life/p.maxlife; ctx.fillRect(p.x,p.y,p.sz,p.sz); }
ctx.globalAlpha = 1.0; if(!player.dead && player.invulnerable % 4 < 2){ drawstylizedcharacter(ctx, player.x+player.w/2, player.y+player.h/2, player.flip, player.state, player.ticks, false, false); }
ctx.restore(); document.getElementById("ui").innerText = "stage: " + currentstage;
if(fademode==="tonextstage"){ fadealpha += 0.04; if(fadealpha>=1){ scene="menu"; targetmenuscrollx=(currentstage-1)*260; fademode="fromblack"; } } 
else if(fademode==="fromblack"){ fadealpha -= 0.04; if(fadealpha<=0) fademode="none"; }
if(fadealpha>0){ ctx.fillStyle=`rgba(0,0,0,${fadealpha})`; ctx.fillRect(0,0,960,540); }
drawvirtualcontrols(ctx);
}
function updateintro() {
introtimer++; ctx.clearRect(0,0,960,540); ctx.fillStyle="#120a1c"; ctx.fillRect(0,0,960,540); ctx.fillStyle="#3e2723"; ctx.fillRect(100,430,760,15); ctx.fillStyle="#4e342e"; ctx.fillRect(440,380,80,50);
if(introtimer < 120){ drawstylizedcharacter(ctx,350,370,false,"idle",introtimer,false,false); drawstylizedcharacter(ctx,600,370,true,"idle",introtimer,true,false); } 
else if(introtimer < 240){ drawstylizedcharacter(ctx,350,370,false,"idle",introtimer,false,false); drawstylizedcharacter(ctx,600,370,true,"idle",introtimer,true,false); drawstylizedcharacter(ctx,800,360,true,"idle",introtimer,false,true); } 
else if(introtimer < 340){ let dx = (introtimer-240)*6; drawstylizedcharacter(ctx,350,370,false,"idle",introtimer,false,false); drawstylizedcharacter(ctx,600+dx,370,true,"jump",introtimer,true,false); drawstylizedcharacter(ctx,800+dx,360,true,"idle",introtimer,false,true); } 
else if(introtimer < 460){ drawstylizedcharacter(ctx,350,370,false,"run",introtimer,false,false); ctx.fillStyle="#ef5350"; ctx.font="bold 36px sans-serif"; ctx.textAlign="center"; ctx.fillText("i have to get my wife",480,200); ctx.textAlign="left"; } 
else { fadealpha += 0.03; if(fadealpha>=1){ scene="game"; fademode="fromblack"; loadstage(currentstage); } ctx.fillStyle=`rgba(0,0,0,${fadealpha})`; ctx.fillRect(0,0,960,540); }
}
function drawheart(g,x,y,sz){ g.beginPath(); g.moveTo(x,y); g.bezierCurveTo(x-sz/2,y-sz/2,x-sz,y+sz/3,x,y+sz); g.bezierCurveTo(x+sz,y+sz/3,x+sz/2,y-sz/2,x,y); g.fill(); }
function updateoutro() {
outrotimer++; ctx.clearRect(0,0,960,540); ctx.fillStyle="#08040c"; ctx.fillRect(0,0,960,540);
let offsetx = outroscenestage === 5 ? (Math.random()-0.5)*cageshake : 0; let offsety = outroscenestage === 5 ? (Math.random()-0.5)*cageshake : 0;
ctx.save(); ctx.translate(offsetx, offsety);
if(outroscenestage <= 4){ ctx.fillStyle="#23183a"; ctx.fillRect(0,420,960,120); drawstylizedcharacter(ctx,250,355,false,"idle",outrotimer,false,false); }
if(outroscenestage === 1){ cagey += 8; if(cagey >= 355){ cagey = 355; outroscenestage = 2; outrotimer = 0; cageshake = 15; } ctx.fillStyle="#757575"; ctx.fillRect(550, cagey, 60, 65); } 
else if(outroscenestage === 2){ cageshake *= 0.9; ctx.fillStyle="#757575"; ctx.fillRect(550, 355, 60, 65); if(outrotimer > 40){ outroscenestage = 3; outrotimer = 0; cagebroken = true; wifex = 580; wifey = 355; } } 
else if(outroscenestage === 3){ if(cagebroken){ ctx.fillStyle="#424242"; ctx.fillRect(540,400,20,20); ctx.fillRect(610,405,15,15); } if(wifex > 310){ wifex -= 2; drawstylizedcharacter(ctx,wifex,wifey,true,"walk",outrotimer,true,false); } else { outroscenestage = 4; outrotimer = 0; } } 
else if(outroscenestage === 4){ drawstylizedcharacter(ctx,310,355,true,"idle",outrotimer,true,false); ctx.fillStyle="#ff4081"; ctx.font="20px sans-serif"; ctx.fillText("♥", 280, 320); if(outrotimer > 80){ outroscenestage = 5; outrotimer = 0; } } 
else if(outroscenestage === 5) {
ctx.fillStyle="#23183a"; ctx.fillRect(0,420,380,120); ctx.fillRect(580,420,380,120);
if(outrotimer < 40){ drawstylizedcharacter(ctx,250,355,false,"idle",outrotimer,false,false); drawstylizedcharacter(ctx,310,355,true,"idle",outrotimer,true,false); } 
else {
wifey += 6; if(wifey > 600) wifealive = false; drawstylizedcharacter(ctx,250,355,false,"idle",outrotimer,false,false);
if(wifealive) drawstylizedcharacter(ctx,310,wifey,true,"jump",outrotimer,true,false);
if(outrotimer > 90){ ctx.fillStyle="#fff"; ctx.save(); ctx.translate(250, 340); ctx.fillStyle="#7ec0ee"; ctx.fillRect(-2, tearsy, 4, 8); tearsy += 3; ctx.restore(); }
if(outrotimer > 150){
ctx.fillStyle="#ff1744"; ctx.save(); ctx.translate(250, 310); ctx.scale(heartscale, heartscale);
if(heartsnapeffect === 0){ heartscale = 1 + Math.sin(outrotimer*0.2)*0.15; if(outrotimer > 220){ heartsnapeffect = 1; outrotimer = 0; } drawheart(ctx, 0, 0, 15); } 
else if(heartsnapeffect === 1){ ctx.globalAlpha = heartalpha; ctx.save(); ctx.translate(-5 - outrotimer*0.5, 0); drawheart(ctx, 0, 0, 12); ctx.restore(); ctx.save(); ctx.translate(5 + outrotimer*0.5, 0); drawheart(ctx, 0, 0, 12); ctx.restore(); heartalpha -= 0.02; if(heartalpha <= 0){ heartsnapeffect = 2; outrotimer = 0; } }
ctx.restore(); ctx.globalAlpha = 1.0;
}
if(outrotimer > 240 && heartsnapeffect === 2){ outroscenestage = 6; outrotimer = 0; scrolly = 550; let link = document.createElement("a"); link.href="https://discord.gg/QAhCXgaDZg"; link.className="outrolink"; link.target="_blank"; link.innerText="join our discord"; document.getElementById("ui").appendChild(link); }
}
} else if(outroscenestage === 6){
scrolly -= 0.8; ctx.fillStyle="#fff"; ctx.textAlign="center"; ctx.font="bold 28px sans-serif"; ctx.fillText("THE END - FALLEN SHADOW", 480, scrolly);
ctx.font="18px sans-serif"; ctx.fillText("Fallen Shadow is A game made for entertainment.", 480, scrolly + 60); ctx.fillText("If you have enjoyed our game, please join our discord community for more games.", 480, scrolly + 100);
ctx.fillStyle="#aaa"; ctx.fillText("Idea : Acone", 480, scrolly + 220); ctx.fillText("Developer : Axom", 480, scrolly + 250); ctx.fillText("Original Character Artist : Acone", 480, scrolly + 280); ctx.textAlign="left";
}
ctx.restore();
}
function loop() {
if(scene==="menu") updatemenu(); else if(scene==="intro") updateintro(); else if(scene==="game"){ updategame(); updateentities(); drawgame(); } else if(scene==="outro") updateoutro();
requestAnimationFrame(loop);
}
window.addEventListener("resize",()=>{
let canvas = document.getElementById("gamecanvas");
if(!canvas) return;
let w = window.innerWidth; let h = window.innerHeight; let r = 960/540;
canvas.width = 960; canvas.height = 540;
if(w/h > r){ canvas.style.width = (h*r)+"px"; canvas.style.height = h+"px"; } else { canvas.style.width = w+"px"; canvas.style.height = (w/r)+"px"; }
ctx.imageSmoothingEnabled = false;
});
window.dispatchEvent(new Event("resize")); loop();
