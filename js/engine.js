export function drawstylizedcharacter(g, x, y, flip, state, ticks, iswife, isvoid) {
g.save(); g.translate(x, y);
if(flip) g.scale(-1, 1);
if(isvoid){
g.fillStyle = "#000"; g.shadowColor = "#f00"; g.shadowBlur = 20; g.beginPath(); g.arc(0, -10, 45, 0, Math.PI*2); g.fill(); g.shadowBlur = 0;
g.fillStyle = "#ff0000"; g.beginPath(); g.ellipse(-15, -15, 8, 4, Math.PI*0.1, 0, Math.PI*2); g.ellipse(15, -15, 8, 4, -Math.PI*0.1, 0, Math.PI*2); g.fill(); g.restore(); return;
}
let bob = Math.sin(ticks * 0.15) * 3; let bodyh = 55; let bodyw = 48; let haty = -bodyh/2;
if(state==="walk") bob = Math.sin(ticks * 0.25) * 4;
else if(state==="run") bob = Math.sin(ticks * 0.4) * 6;
else if(state==="jump"||state==="dash") bob = -6;
else if(state==="crouch"){ bodyh = 32; haty = -bodyh/2; bob = 6; }
else if(state==="slide"){ g.rotate(-Math.PI * 0.18); bodyh = 24; haty = -bodyh/2; bob = 9; }
g.save(); g.translate(0, bob);
let grad = g.createLinearGradient(-bodyw/2, 0, bodyw/2, 0);
if(iswife){ grad.addColorStop(0, "#e57373"); grad.addColorStop(0.5, "#f48fb1"); grad.addColorStop(1, "#c2185b"); } 
else { grad.addColorStop(0, "#d4af37"); grad.addColorStop(0.4, "#ffd700"); grad.addColorStop(1, "#b8860b"); }
g.fillStyle = grad; g.beginPath(); g.moveTo(-bodyw/2, bodyh/2); g.lineTo(bodyw/2, bodyh/2); g.lineTo(0, -bodyh/2); g.closePath(); g.fill();
g.strokeStyle = iswife ? "#880e4f" : "#1b5e20"; g.lineWidth = 4; g.beginPath(); g.moveTo(-bodyw/3, bodyh/4); g.lineTo(bodyw/3, bodyh/4); g.moveTo(-bodyw/2.5, bodyh/8); g.lineTo(bodyw/2.5, bodyh/8); g.stroke();
g.fillStyle = iswife ? "#ea80fc" : "#fbc02d"; g.beginPath(); g.moveTo(-18, haty); g.lineTo(18, haty); g.lineTo(0, haty - 50); g.closePath(); g.fill();
g.fillStyle = iswife ? "#f8bbd0" : "#2e7d32"; g.beginPath(); g.moveTo(-10, haty - 20); g.lineTo(10, haty - 20); g.lineTo(0, haty - 50); g.closePath(); g.fill();
g.fillStyle = "#ffeb3b"; g.beginPath(); g.arc(0, haty - 50, 7, 0, Math.PI * 2); g.fill();
g.fillStyle = "#111"; g.beginPath(); g.ellipse(0, 4, 22, 14, 0, 0, Math.PI * 2); g.fill();
g.fillStyle = "#ff5722"; g.strokeStyle = "#fff"; g.lineWidth = 3; g.beginPath(); g.arc(-8, 4, 10, 0, Math.PI * 2); g.arc(8, 4, 10, 0, Math.PI * 2); g.fill(); g.stroke();
g.fillStyle = "#000"; g.beginPath(); g.arc(-7, 4, 5, 0, Math.PI * 2); g.arc(7, 4, 5, 0, Math.PI * 2); g.fill();
g.fillStyle = "#fff"; g.beginPath(); g.arc(-8, 2, 2, 0, Math.PI * 2); g.arc(6, 2, 2, 0, Math.PI * 2); g.fill();
if(!iswife){
g.strokeStyle = "#424242"; g.lineWidth = 3; g.beginPath();
if(state==="dash"||state==="slide"){ g.moveTo(12, 6); g.lineTo(38, 6); } else { g.moveTo(12, 10); g.lineTo(28, 4); }
g.stroke(); g.fillStyle = "#fff"; g.fillRect(state==="dash"||state==="slide"?38:28, state==="dash"||state==="slide"?-6:-12, 4, 16);
g.fillStyle = "#ff9100"; g.shadowColor = "#ff3d00"; g.shadowBlur = 12; g.beginPath(); g.arc(state==="dash"||state==="slide"?40:30, state==="dash"||state==="slide"?-10:-16, 8 + Math.random()*4, 0, Math.PI*2); g.fill(); g.shadowBlur = 0;
}
g.restore(); g.strokeStyle = "#4e342e"; g.lineWidth = 6; let lcyc = Math.sin(ticks * 0.3);
if(state==="walk"||state==="run"){
let amp = state==="run" ? 16 : 10; g.beginPath(); g.moveTo(-12, bodyh/2+bob); g.lineTo(-16+lcyc*amp, bodyh/2+18); g.moveTo(12, bodyh/2+bob); g.lineTo(16-lcyc*amp, bodyh/2+18); g.stroke();
} else { g.beginPath(); g.moveTo(-12, bodyh/2+bob); g.lineTo(-14, bodyh/2+16); g.moveTo(12, bodyh/2+bob); g.lineTo(14, bodyh/2+16); g.stroke(); }
g.restore();
}
