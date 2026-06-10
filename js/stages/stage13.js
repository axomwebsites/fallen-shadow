export const width = 5600;
export function init(p, h, e, g, b) {
p.push({x:0,y:450,w:600,h:200},{x:750,y:400,w:600,h:250},{x:1500,y:360,w:550,h:290},{x:2200,y:430,w:800,h:220},{x:3150,y:450,w:2450,h:200});
h.push({x:900,y:385,w:60,h:15,type:"spike"},{x:1650,y:345,w:40,h:15,type:"spike"},{x:2400,y:415,w:60,h:15,type:"spike"});
e.push({x:850,y:360,minx:800,maxx:1300,vx:4.0,w:40,h:40,dead:false},{x:3500,y:410,minx:3300,maxx:5000,vx:4.5,w:40,h:40,dead:false});
g.push({x:5400,y:390,w:50,h:60});
}
