export const width = 5900;
export function init(p, h, e, g, b) {
p.push({x:0,y:450,w:700,h:200},{x:850,y:390,w:600,h:260},{x:1600,y:430,w:550,h:220},{x:2300,y:380,w:750,h:270},{x:3200,y:450,w:2700,h:200});
h.push({x:1000,y:375,w:60,h:15,type:"spike"},{x:1750,y:415,w:40,h:15,type:"spike"},{x:2500,y:365,w:60,h:15,type:"spike"});
e.push({x:900,y:350,minx:860,maxx:1400,vx:4.5,w:40,h:40,dead:false},{x:2450,y:340,minx:2350,maxx:2950,vx:5.0,w:40,h:40,dead:false});
g.push({x:5700,y:390,w:50,h:60});
}
