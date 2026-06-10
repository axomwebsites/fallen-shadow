export const width = 6500;
export function init(p, h, e, g, b) {
p.push({x:0,y:450,w:600,h:200},{x:750,y:340,w:500,h:310},{x:1400,y:420,w:900,h:230},{x:2450,y:320,w:500,h:330},{x:3100,y:400,w:850,h:250},{x:4100,y:330,w:550,h:320},{x:4800,y:450,w:1700,h:200});
h.push({x:900,y:325,w:60,h:15,type:"spike"},{x:1650,y:405,w:100,h:15,type:"spike"},{x:2600,y:305,w:60,h:15,type:"spike"},{x:3400,y:385,w:80,h:15,type:"spike"});
e.push({x:1550,y:380,minx:1420,maxx:2250,vx:5.0,w:40,h:40,dead:false},{x:3300,y:360,minx:3120,maxx:3900,vx:5.6,w:40,h:40,dead:false});
g.push({x:6300,y:390,w:50,h:60});
}
