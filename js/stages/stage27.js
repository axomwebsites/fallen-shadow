export const width = 6600;
export function init(p, h, e, g, b) {
p.push({x:0,y:450,w:650,h:200},{x:800,y:350,w:450,h:300},{x:1400,y:430,w:850,h:220},{x:2400,y:310,w:550,h:340},{x:3100,y:410,w:750,h:240},{x:4000,y:320,w:550,h:330},{x:4700,y:450,w:1900,h:200});
h.push({x:950,y:335,w:40,h:15,type:"spike"},{x:1600,y:415,w:80,h:15,type:"spike"},{x:2550,y:295,w:60,h:15,type:"spike"},{x:3300,y:395,w:60,h:15,type:"spike"});
e.push({x:1500,y:390,minx:1420,maxx:2200,vx:5.1,w:40,h:40,dead:false},{x:3250,y:370,minx:3120,maxx:3800,vx:5.7,w:40,h:40,dead:false});
g.push({x:6400,y:390,w:50,h:60});
}
