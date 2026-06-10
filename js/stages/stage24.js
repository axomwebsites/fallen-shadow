export const width = 6300;
export function init(p, h, e, g, b) {
p.push({x:0,y:450,w:600,h:200},{x:750,y:330,w:550,h:320},{x:1450,y:410,w:800,h:240},{x:2400,y:350,w:500,h:300},{x:3050,y:420,w:900,h:230},{x:4100,y:310,w:500,h:340},{x:4750,y:450,w:1550,h:200});
h.push({x:900,y:315,w:40,h:15,type:"spike"},{x:1650,y:395,w:100,h:15,type:"spike"},{x:2550,y:335,w:60,h:15,type:"spike"},{x:3300,y:405,w:80,h:15,type:"spike"});
e.push({x:1550,y:370,minx:1470,maxx:2200,vx:4.8,w:40,h:40,dead:false},{x:3250,y:380,minx:3070,maxx:3900,vx:5.4,w:40,h:40,dead:false});
g.push({x:6100,y:390,w:50,h:60});
}
