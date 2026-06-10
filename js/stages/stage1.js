export const width = 3200;
export function init(platforms, hazards, enemies, goals, bosses) {
platforms.push({x:0,y:440,w:700,h:200});
platforms.push({x:820,y:400,w:400,h:240});
platforms.push({x:1350,y:440,w:500,h:200});
platforms.push({x:1950,y:350,w:350,h:300});
platforms.push({x:2450,y:440,w:800,h:200});
hazards.push({x:950,y:385,w:40,h:15,type:"spike"});
hazards.push({x:1500,y:425,w:60,h:15,type:"spike"});
enemies.push({x:1400,y:400,minx:1360,maxx:1650,vx:2,w:40,h:40,dead:false});
enemies.push({x:2600,y:400,minx:2500,maxx:2850,vx:3,w:40,h:40,dead:false});
goals.push({x:3050,y:380,w:50,h:60});
}
