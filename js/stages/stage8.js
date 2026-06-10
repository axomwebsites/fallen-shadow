export const width = 5200;
export function init(p, h, e, g, b) {
p.push({x:0,y:450,w:800,h:200},{x:950,y:390,w:600,h:260},{x:1700,y:440,w:500,h:210},{x:2350,y:380,w:800,h:270},{x:3300,y:450,w:1900,h:200});
h.push({x:1100,y:375,w:40,h:15,type:"spike"},{x:1850,y:425,w:60,h:15,type:"spike"},{x:2550,y:365,w:40,h:15,type:"spike"},{x:2850,y:365,w:40,h:15,type:"spike"});
e.push({x:2450,y:340,minx:2400,maxx:3000,vx:4.0,w:40,h:40,dead:false},{x:3800,y:410,minx:3500,maxx:4600,vx:4.4,w:40,h:40,dead:false});
g.push({x:5050,y:390,w:50,h:60});
}
