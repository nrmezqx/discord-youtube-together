const { ShardingManager } = require('discord.js');

const bumbe = new ShardingManager('./index.js', { //main
	totalShards: 1, //1,2,auto, (1 Değişme. -nomik)
});
bumbe.spawn();

bumbe.on('shardCreate', shard => {
    console.log(`${shard.id} İDli shard başlatıldı bot artık Canavar gibi!`);
});

//v12.init
