require("dotenv").config();

const { Client } = require("discord.js");
const fetch = require("node-fetch");
const client = new Client();
const PREFIX = "a!";

const ACTIVITIES = {
    "poker": {
        id: "",
        name: "Poker Night"
    },
    "betrayal": {
        id: "",
        name: "Betrayal.io"
    },
    "youtube": {
        id: "",
        name: "YouTube Together"
    },
    "fishington": {
        id: "",
        name: "Fishington.io"
    }
};

client.on("ready", () => console.log("Bot is online!"));
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
        if (!channel || channel.type !== "voice") return message.channel.send("❌ | Geçersiz kanal belirtildi!");
        if (!channel.permissionsFor(message.guild.me).has("CREATE_INSTANT_INVITE")) return message.channel.send("❌ | CREATE_INSTANT_INVITE iznine ihtiyacım var");

        fetch(`https://discord.com/api/v8/channels/${channel.id}/invites`, {
            method: "POST",
            body: JSON.stringify({
                max_age: 99999,
                max_uses: 0,
                target_application_id: "", // youtube together
                target_type: 9,
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
                if (invite.error || !invite.code) return message.channel.send("❌ | YouTube Birlikte başlatılamadı!");
                message.channel.send(`✅ |** YouTube Together ** 'ı başlatmak için burayı tıklayın ${channel.name}: <https://discord.gg/${invite.code}>`);
            })
            .catch(e => {
                message.channel.send("❌ | ** YouTube Together ** başlatılamadı!");
            })
    }
    
    // or use this
    if (cmd === "activity") {
        const channel = message.guild.channels.cache.get(args[0]);
        if (!channel || channel.type !== "voice") return message.channel.send("❌ | Geçersiz kanal belirtildi!");
        if (!channel.permissionsFor(message.guild.me).has("CREATE_INSTANT_INVITE")) return message.channel.send("❌ | CREATE_INSTANT_INVITE iznine ihtiyacım var");
        const activity = ACTIVITIES[args[1] ? args[1].toLowerCase() : null];
        if (!activity) return message.channel.send(`❌ | Doğru formatlar: \n${Object.keys(ACTIVITIES).map(m => `- **${PREFIX}activity <Channel_ID> ${m}**`).join("\n")}`);

        fetch(`https://discord.com/api/v8/channels/${channel.id}/invites`, {
            method: "POST",
            body: JSON.stringify({
                max_age: 99999,
                max_uses: 0,
                target_application_id: activity.id,
                target_type: 9,
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
                if (invite.error || !invite.code) return message.channel.send(`❌ | Başlatılamadı **${activity.name}**!`);
                message.channel.send(`✅ | Başlatmak için burayı tıklatın **${activity.name}** in **${channel.name}**: <https://discord.gg/${invite.code}>`);
            })
            .catch(e => {
                message.channel.send(`❌ | Başlatılamadı **${activity.name}**!`);
            })
    }
});

client.login();
