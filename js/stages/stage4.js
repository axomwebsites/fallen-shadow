export const width = 4800;
export function init(p, h, e, g, b) {
p.push({x:0,y:450,w:600,h:200},{x:750,y:420,w:550,h:230},{x:1450,y:370,w:450,h:280},{x:2050,y:440,w:900,h:200},{x:3100,y:410,w:1700,h:240});
h.push({x:900,y:405,w:40,h:15,type:"spike"},{x:1600,y:355,w:60,h:15,type:"spike"},{x:2300,y:425,w:40,h:15,type:"spike"},{x:2600,y:425,w:40,h:15,type:"spike"});
e.push({x:2150,y:400,minx:2100,maxx:2800,vx:3.2,w:40,h:40,dead:false},{x:3500,y:370,minx:3300,maxx:4200,vx:3.8,w:40,h:40,dead:false});
g.push({x:4650,y:350,w:50,h:60});
}
