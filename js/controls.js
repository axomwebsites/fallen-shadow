export let inputs = {left:false,right:false,jump:false,dash:false,slide:false,crouch:false};
export let joystick = {active:false,startx:0,starty:0,curx:0,cury:0};
let keys = {};
window.addEventListener("keydown",e=>{
let k = e.key.toLowerCase();
keys[k] = true;
if(k===" "||k==="arrowup"||k==="w") inputs.jump = true;
if(k==="shift"||k==="x") inputs.dash = true;
if(k==="c") inputs.slide = true;
if(k==="arrowdown"||k==="s") inputs.crouch = true;
if(k==="arrowleft"||k==="a") inputs.left = true;
if(k==="arrowright"||k==="d") inputs.right = true;
});
window.addEventListener("keyup",e=>{
let k = e.key.toLowerCase();
keys[k] = false;
if(k===" "||k==="arrowup"||k==="w") inputs.jump = false;
if(k==="shift"||k==="x") inputs.dash = false;
if(k==="c") inputs.slide = false;
if(k==="arrowdown"||k==="s") inputs.crouch = false;
if(k==="arrowleft"||k==="a") inputs.left = false;
if(k==="arrowright"||k==="d") inputs.right = false;
});
const layer = document.getElementById("touchcontrolslayer");
let activebuttons = {};
layer.addEventListener("touchstart",e=>{
for(let t of e.changedTouches){
if(t.clientX < window.innerWidth / 2){
if(!joystick.active){
joystick.active = true;
joystick.startx = t.clientX;
joystick.starty = t.clientY;
joystick.curx = t.clientX;
joystick.cury = t.clientY;
activebuttons[t.identifier] = "joystick";
}
} else {
let btn = getactionbyposition(t.clientX, t.clientY);
if(btn){
inputs[btn] = true;
activebuttons[t.identifier] = btn;
}
}
}
},{passive:false});
layer.addEventListener("touchmove",e=>{
for(let t of e.changedTouches){
if(activebuttons[t.identifier] === "joystick"){
joystick.curx = t.clientX;
joystick.cury = t.clientY;
let dx = joystick.curx - joystick.startx;
if(dx < -20){ inputs.left = true; inputs.right = false; } 
else if(dx > 20){ inputs.right = true; inputs.left = false; } 
else { inputs.left = false; inputs.right = false; }
}
}
},{passive:false});
layer.addEventListener("touchend",e=>{
for(let t of e.changedTouches){
let act = activebuttons[t.identifier];
if(act === "joystick"){ joystick.active = false; inputs.left = false; inputs.right = false; } 
else if(act){ inputs[act] = false; }
delete activebuttons[t.identifier];
}
},{passive:false});
function getactionbyposition(x, y) {
let w = window.innerWidth; let h = window.innerHeight;
if(x > w - 100 && y > h - 100) return "slide";
if(x > w - 100 && y < h - 100 && y > h - 200) return "jump";
if(x < w - 100 && x > w - 200 && y > h - 100) return "crouch";
if(x < w - 100 && x > w - 200 && y < h - 100 && y > h - 200) return "dash";
return null;
}
export function drawvirtualcontrols(g) {
if(joystick.active){
g.save(); g.fillStyle = "rgba(255,255,255,0.15)"; g.strokeStyle = "rgba(255,255,255,0.3)"; g.lineWidth = 3;
let sx = (joystick.startx / window.innerWidth) * 960; let sy = (joystick.starty / window.innerHeight) * 540;
let cx = (joystick.curx / window.innerWidth) * 960; let cy = (joystick.cury / window.innerHeight) * 540;
g.beginPath(); g.arc(sx, sy, 50, 0, Math.PI*2); g.fill(); g.stroke();
g.fillStyle = "rgba(255,255,255,0.4)"; g.beginPath();
let dx = cx - sx; let dy = cy - sy; let d = Math.sqrt(dx*dx+dy*dy);
if(d > 50){ cx = sx + (dx/d)*50; cy = sy + (dy/d)*50; }
g.beginPath(); g.arc(cx, cy, 20, 0, Math.PI*2); g.fill(); g.restore();
}
let actions = [{n:"jmp",x:890,y:390},{n:"sld",x:890,y:490},{n:"dsh",x:790,y:390},{n:"crh",x:790,y:490}];
g.save();
for(let a of actions){
g.fillStyle = inputs[a.n==="jmp"?"jump":a.n==="sld"?"slide":a.n==="dsh"?"dash":"crouch"]?"rgba(255,255,0,0.3)":"rgba(255,255,255,0.15)";
g.strokeStyle = "rgba(255,255,255,0.3)"; g.lineWidth = 2;
g.beginPath(); g.arc(a.x, a.y, 30, 0, Math.PI*2); g.fill(); g.stroke();
g.fillStyle = "#fff"; g.font = "bold 12px sans-serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(a.n, a.x, a.y);
}
g.restore();
}
