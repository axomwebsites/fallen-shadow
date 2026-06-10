export const width = 5400;
export function init(p, h, e, g, b) {
p.push({x:0,y:450,w:700,h:200},{x:850,y:380,w:450,h:300},{x:1450,y:460,w:800,h:200},{x:2400,y:340,w:600,h:300},{x:3150,y:420,w:700,h:250},{x:4000,y:450,w:1400,h:200});
h.push({x:1000,y:365,w:40,h:15,type:"spike"},{x:1700,y:445,w:80,h:15,type:"spike"},{x:2600,y:325,w:40,h:15,type:"spike"},{x:3400,y:405,w:60,h:15,type:"spike"});
e.push({x:1500,y:420,minx:1460,maxx:2100,vx:3.5,w:40,h:40,dead:false},{x:3300,y:380,minx:3160,maxx:3700,vx:4.0,w:40,h:40,dead:false});
g.push({x:5200,y:390,w:50,h:60});
}
