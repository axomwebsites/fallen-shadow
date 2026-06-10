export const width = 5300;
export function init(p, h, e, g, b) {
p.push({x:0,y:450,w:650,h:200},{x:800,y:400,w:650,h:250},{x:1600,y:360,w:550,h:290},{x:2300,y:430,w:750,h:220},{x:3200,y:450,w:2100,h:200});
h.push({x:950,y:385,w:60,h:15,type:"spike"},{x:1750,y:345,w:40,h:15,type:"spike"},{x:2500,y:415,w:60,h:15,type:"spike"});
e.push({x:1000,y:360,minx:850,maxx:1350,vx:4.2,w:40,h:40,dead:false},{x:3600,y:410,minx:3400,maxx:4800,vx:4.6,w:40,h:40,dead:false});
g.push({x:5150,y:390,w:50,h:60});
}
