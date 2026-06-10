export const width = 6000;
export function init(p, h, e, g, b) {
p.push({x:0,y:450,w:600,h:200},{x:750,y:350,w:500,h:300},{x:1400,y:430,w:900,h:200},{x:2450,y:320,w:500,h:350},{x:3100,y:400,w:800,h:250},{x:4100,y:330,w:500,h:300},{x:4800,y:450,w:1200,h:200});
h.push({x:900,y:335,w:60,h:15,type:"spike"},{x:1600,y:415,w:100,h:15,type:"spike"},{x:2600,y:305,w:60,h:15,type:"spike"},{x:3500,y:385,w:80,h:15,type:"spike"},{x:4300,y:315,w:40,h:15,type:"spike"});
e.push({x:1650,y:390,minx:1420,maxx:2200,vx:4.5,w:40,h:40,dead:false},{x:3300,y:360,minx:3120,maxx:3800,vx:5.0,w:40,h:40,dead:false},{x:5000,y:410,minx:4850,maxx:5600,vx:5.5,w:40,h:40,dead:false});
g.push({x:5800,y:390,w:50,h:60});
}
