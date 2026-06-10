export const width = 6100;
export function init(p, h, e, g, b) {
p.push({x:0,y:450,w:900,h:200},{x:1050,y:390,w:600,h:260},{x:1800,y:440,w:500,h:210},{x:2450,y:380,w:850,h:270},{x:3450,y:450,w:2650,h:200});
h.push({x:1200,y:375,w:40,h:15,type:"spike"},{x:1950,y:425,w:60,h:15,type:"spike"},{x:2650,y:365,w:40,h:15,type:"spike"},{x:2950,y:365,w:40,h:15,type:"spike"});
e.push({x:2550,y:340,minx:2460,maxx:3200,vx:4.8,w:40,h:40,dead:false},{x:3900,y:410,minx:3600,maxx:5800,vx:5.3,w:40,h:40,dead:false});
g.push({x:5950,y:390,w:50,h:60});
}
