export const width = 4700;
export function init(p, h, e, g, b) {
p.push({x:0,y:450,w:900,h:200},{x:1050,y:380,w:400,h:270},{x:1600,y:450,w:700,h:200},{x:2450,y:400,w:600,h:250},{x:3200,y:430,w:1500,h:220});
h.push({x:1200,y:365,w:60,h:15,type:"spike"},{x:1800,y:435,w:40,h:15,type:"spike"},{x:2700,y:385,w:40,h:15,type:"spike"});
e.push({x:1700,y:410,minx:1650,maxx:2100,vx:3.0,w:40,h:40,dead:false},{x:3600,y:390,minx:3400,maxx:4000,vx:3.5,w:40,h:40,dead:false});
g.push({x:4500,y:370,w:50,h:60});
}
