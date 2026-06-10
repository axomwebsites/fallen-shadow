export const width = 5800;
export function init(p, h, e, g, b) {
p.push({x:0,y:450,w:850,h:200},{x:1000,y:410,w:550,h:240},{x:1700,y:370,w:500,h:280},{x:2350,y:440,w:850,h:200},{x:3350,y:450,w:2450,h:200});
h.push({x:1150,y:395,w:40,h:15,type:"spike"},{x:1850,y:355,w:40,h:15,type:"spike"},{x:2550,y:425,w:60,h:15,type:"spike"});
e.push({x:1050,y:370,minx:1010,maxx:1500,vx:4.4,w:40,h:40,dead:false},{x:3700,y:410,minx:3500,maxx:5400,vx:4.9,w:40,h:40,dead:false});
g.push({x:5600,y:390,w:50,h:60});
}
