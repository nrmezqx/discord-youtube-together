require("dotenv").config();

const { Client } = require("discord.js");
const Discord = require("discord.js");
const fetch = require("node-fetch");
const fs = require("fs");
const client = new Client();
const PREFIX = "c!";

const ACTIVITIES = {
    "poker": {
        id: "755827207812677713",
        name: "Poker Night"
    },
    "betrayal": {
        id: "773336526917861400",
        name: "Betrayal.io"
    },
    "youtube": {
        id: "755600276941176913",
        name: "YouTube Together"
    },
    "fishington": {
        id: "814288819477020702",
        name: "Fishington.io"
    }
};
client.on('ready', async () => {
   client.appInfo = await client.fetchApplication();
  setInterval( async () => {
    client.appInfo = await client.fetchApplication();
  }, 1);
  
 client.user.setActivity(`Amogus ❤️ Github By NoMiK`, { type:'WATCHING' })

});

const log = message => {
  console.log(` ${message}`);
};


client.on("ready", () => console.log("Bot Aktif | NoMiK (nrmezqx)"));
client.on("warn", console.warn);
client.on("error", console.error);

client.on("message", async message => {
    if (message.author.bot || !message.guild) return;
    if (message.content.indexOf(PREFIX) !== 0) return;

    const args = message.content.slice(PREFIX.length).trim().split(" ");
    const cmd = args.shift().toLowerCase();

    if (cmd === "ping") return message.channel.send(`Pong! \`${client.ws.ping}ms\``);

    if (cmd === "yttogether") {
        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
        if (!channel || channel.type !== "voice") return message.channel.send("Geçersiz kanal belirtildi!");
        if (!channel.permissionsFor(message.guild.me).has("CREATE_INSTANT_INVITE")) return message.channel.send("CREATE_INSTANT_INVITE iznine ihtiyacım var");

        fetch(`https://discord.com/api/v8/channels/${channel.id}/invites`, {
            method: "POST",
            body: JSON.stringify({
                max_age: 86400,
                max_uses: 9,
                target_application_id: "830427926482255902", // youtube together
                target_type: 2,
                temporary: false,
                validate: null
            }),
            headers: {
                "Authorization": `Bot ${client.token}`,
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(invite => {
                if (invite.error || !invite.code) return message.channel.send("YouTube başlatılamadı!");
                message.channel.send(`**Yayını** Başlatmak İçin Tıklayın! ${channel.name}: <https://discord.gg/${invite.code}>`);
            })
            .catch(e => {
                message.channel.send("**Yayın** başlatılamadı!");
            })
    }
   
    
   

    // or use this
    if (cmd === "oynat") {
        const channel = message.guild.channels.cache.get(args[0]);
        if (!channel || channel.type !== "voice") return message.channel.send("**Şu Şekillerde Kullanın; \n**-------------------------------------** \n c!oynat KanalİD youtube | Youtube Üzerinden Video Oynatırsınız! \n c!oynat KanalİD poker | Poker Oyunu Oynarsınız! \n c!oynat KanalİD betrayal | Betrayal Oyunu Oynarsınız! \n c!oynat KanalİD fishington | Fishington Oyunu Oynarsınız!**");
        if (!channel.permissionsFor(message.guild.me).has("CREATE_INSTANT_INVITE")) return message.channel.send("CREATE_INSTANT_INVITE iznine ihtiyacım var");
        const activity = ACTIVITIES[args[1] ? args[1].toLowerCase() : null];
        if (!activity) return message.channel.send(`Doğru formatlar: \n${Object.keys(ACTIVITIES).map(m => `- **${PREFIX}activity <Channel_ID> ${m}**`).join("\n")}`);

        fetch(`https://discord.com/api/v8/channels/${channel.id}/invites`, {
            method: "POST",
            body: JSON.stringify({
                max_age: 86400,
                max_uses: 9,
                target_application_id: activity.id,
                target_type: 2,
                temporary: false,
                validate: null
            }),
            headers: {
                "Authorization": `Bot ${client.token}`,
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(invite => {
                if (invite.error || !invite.code) return message.channel.send(`Başlatılamadı **${activity.name}**!`);
                message.channel.send(`Başlatmak İçin Buraya Tıklayın! **${activity.name}** **${channel.name}**: <https://discord.gg/${invite.code}>`);
            })
            .catch(e => {
                message.channel.send(`Başlatılamadı **${activity.name}**!`);
            })
    }
});

client.login("token");

