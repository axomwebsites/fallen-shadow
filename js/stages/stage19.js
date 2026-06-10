export const width = 6200;
export function init(p, h, e, g, b) {
p.push({x:0,y:450,w:700,h:200},{x:850,y:400,w:650,h:250},{x:1650,y:360,w:550,h:290},{x:2350,y:430,w:850,h:220},{x:3350,y:450,w:2850,h:200});
h.push({x:1000,y:385,w:60,h:15,type:"spike"},{x:1800,y:345,w:40,h:15,type:"spike"},{x:2550,y:415,w:60,h:15,type:"spike"});
e.push({x:1050,y:360,minx:900,maxx:1450,vx:5.0,w:40,h:40,dead:false},{x:3800,y:410,minx:3550,maxx:5900,vx:5.5,w:40,h:40,dead:false});
g.push({x:6050,y:390,w:50,h:60});
}
