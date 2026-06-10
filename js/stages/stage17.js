export const width = 6000;
export function init(p, h, e, g, b) {
p.push({x:0,y:450,w:800,h:200},{x:950,y:420,w:500,h:230},{x:1600,y:370,w:600,h:280},{x:2350,y:440,w:800,h:200},{x:3300,y:410,w:2700,h:240});
h.push({x:1100,y:405,w:40,h:15,type:"spike"},{x:1750,y:355,w:40,h:15,type:"spike"},{x:2550,y:425,w:80,h:15,type:"spike"});
e.push({x:1700,y:330,minx:1610,maxx:2150,vx:4.6,w:40,h:40,dead:false},{x:3600,y:370,minx:3400,maxx:5600,vx:5.1,w:40,h:40,dead:false});
g.push({x:5850,y:350,w:50,h:60});
}
