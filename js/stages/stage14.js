export const width = 5700;
export function init(p, h, e, g, b) {
p.push({x:0,y:450,w:750,h:200},{x:900,y:430,w:500,h:220},{x:1550,y:380,w:600,h:270},{x:2300,y:450,w:750,h:200},{x:3200,y:420,w:2500,h:230});
h.push({x:1050,y:415,w:40,h:15,type:"spike"},{x:1700,y:365,w:60,h:15,type:"spike"},{x:2500,y:435,w:80,h:15,type:"spike"});
e.push({x:1600,y:340,minx:1560,maxx:2100,vx:4.2,w:40,h:40,dead:false},{x:3600,y:380,minx:3350,maxx:5200,vx:4.7,w:40,h:40,dead:false});
g.push({x:5500,y:360,w:50,h:60});
}
