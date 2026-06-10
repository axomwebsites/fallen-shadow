export const width = 6400;
export function init(p, h, e, g, b) {
p.push({x:0,y:450,w:700,h:200},{x:850,y:370,w:450,h:280},{x:1450,y:450,w:950,h:200},{x:2550,y:340,w:550,h:310},{x:3250,y:390,w:800,h:260},{x:4200,y:350,w:500,h:300},{x:4900,y:450,w:1500,h:200});
h.push({x:1000,y:355,w:60,h:15,type:"spike"},{x:1700,y:435,w:80,h:15,type:"spike"},{x:2700,y:325,w:40,h:15,type:"spike"},{x:3500,y:375,w:60,h:15,type:"spike"});
e.push({x:1650,y:410,minx:1470,maxx:2350,vx:4.9,w:40,h:40,dead:false},{x:3400,y:350,minx:3270,maxx:4000,vx:5.5,w:40,h:40,dead:false});
g.push({x:6200,y:390,w:50,h:60});
}
