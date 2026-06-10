export const width = 5500;
export function init(p, h, e, g, b) {
p.push({x:0,y:450,w:800,h:200},{x:950,y:420,w:500,h:230},{x:1600,y:390,w:650,h:260},{x:2400,y:460,w:700,h:200},{x:3250,y:410,w:2250,h:240});
h.push({x:1100,y:405,w:40,h:15,type:"spike"},{x:1800,y:375,w:60,h:15,type:"spike"},{x:2600,y:445,w:40,h:15,type:"spike"});
e.push({x:1000,y:380,minx:960,maxx:1400,vx:3.7,w:40,h:40,dead:false},{x:3600,y:370,minx:3400,maxx:4900,vx:4.2,w:40,h:40,dead:false});
g.push({x:5300,y:350,w:50,h:60});
}
