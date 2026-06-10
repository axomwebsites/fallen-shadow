export const width = 5000;
export function init(p, h, e, g, b) {
p.push({x:0,y:450,w:700,h:200},{x:850,y:400,w:650,h:250},{x:1650,y:430,w:550,h:220},{x:2350,y:390,w:750,h:260},{x:3250,y:450,w:1750,h:200});
h.push({x:1000,y:385,w:60,h:15,type:"spike"},{x:1800,y:415,w:40,h:15,type:"spike"},{x:2600,y:375,w:60,h:15,type:"spike"});
e.push({x:950,y:360,minx:900,maxx:1400,vx:3.6,w:40,h:40,dead:false},{x:2500,y:350,minx:2400,maxx:2900,vx:4.1,w:40,h:40,dead:false});
g.push({x:4850,y:390,w:50,h:60});
}
