export const width = 5100;
export function init(p, h, e, g, b) {
p.push({x:0,y:450,w:750,h:200},{x:900,y:420,w:500,h:230},{x:1550,y:370,w:600,h:280},{x:2300,y:440,w:700,h:200},{x:3150,y:410,w:1950,h:240});
h.push({x:1050,y:405,w:40,h:15,type:"spike"},{x:1700,y:355,w:40,h:15,type:"spike"},{x:2500,y:425,w:80,h:15,type:"spike"});
e.push({x:1650,y:330,minx:1600,maxx:2050,vx:3.8,w:40,h:40,dead:false},{x:3500,y:370,minx:3300,maxx:4400,vx:4.2,w:40,h:40,dead:false});
g.push({x:4950,y:350,w:50,h:60});
}
