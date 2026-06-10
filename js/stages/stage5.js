export const width = 4900;
export function init(p, h, e, g, b) {
p.push({x:0,y:450,w:800,h:200},{x:950,y:390,w:500,h:260},{x:1600,y:360,w:600,h:290},{x:2350,y:420,w:650,h:230},{x:3150,y:450,w:1750,h:200});
h.push({x:1100,y:375,w:40,h:15,type:"spike"},{x:1800,y:345,w:40,h:15,type:"spike"},{x:2500,y:405,w:60,h:15,type:"spike"});
e.push({x:1700,y:320,minx:1650,maxx:2100,vx:3.5,w:40,h:40,dead:false},{x:3400,y:410,minx:3250,maxx:4000,vx:4.0,w:40,h:40,dead:false});
g.push({x:4750,y:390,w:50,h:60});
}
