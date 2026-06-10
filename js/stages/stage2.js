export const width = 3600;
export function init(platforms, hazards, enemies, goals, bosses) {
platforms.push({x:0,y:450,w:600,h:200});
platforms.push({x:720,y:450,w:250,h:200});
platforms.push({x:1080,y:380,w:300,h:300});
platforms.push({x:1480,y:460,w:400,h:200});
platforms.push({x:2000,y:400,w:300,h:300});
platforms.push({x:2450,y:330,w:250,h:300});
platforms.push({x:2850,y:450,w:800,h:200});
hazards.push({x:780,y:435,w:40,h:15,type:"spike"});
hazards.push({x:1600,y:445,w:80,h:15,type:"spike"});
hazards.push({x:2100,y:385,w:40,h:15,type:"spike"});
enemies.push({x:1100,y:340,minx:1090,maxx:1320,vx:2.5,w:40,h:40,dead:false});
enemies.push({x:2950,y:410,minx:2900,maxx:3200,vx:3.5,w:40,h:40,dead:false});
goals.push({x:3450,y:390,w:50,h:60});
}
