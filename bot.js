const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");

function clean(text) {
    if (typeof(text) === "string")
      return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
}

var prefix = "+";
var token = "NDE5ODMwODI5NjM2NzgwMDMz.DX12dQ.XTliK3aQNzIwGie1eLyqvyM3eQo";

let ticketIndex = parseInt(fs.readFileSync("./ticketIndex").toString()) || 0;

client.on("ready", () => {
  console.log("BlocksBot | Logged in! Server count: ${client.guilds.size}");
  client.user.setStatus(`dnd`);
});

client.on("message", (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  if (message.content.toLowerCase().startsWith(prefix + `help`)) {
    const embed = new Discord.RichEmbed()
    .setTitle(`:mailbox_with_mail: BlocksBot Help`)
    .setColor(0xff0000)
    .setDescription(`Hello! I am BlocksBot, created by Blockshub Development Team. I love to help, and i work as a bridge between the BlocksHub Management and Server Members! Anytime you need help, regarding anything, with Management, i can do the job with my stunning features. Here are some things i can flawless:`)
    .addField(`:tickets: Tickets`, `[${prefix}new]() :: Opens up a new ticket and tags the Support Team.\n[${prefix}close]() :: Closes a ticket that has been resolved or been opened by accident.`)
    .addField(`:shield: Moderation`, `Coming soon!`)
    .addField(`:star2: Other`, `[${prefix}ping]() :: Pings the bot to see how long it takes to react.`)
    .setTimestamp();
    message.channel.send({ embed: embed });
  }

  if (message.content.toLowerCase().startsWith(prefix + `ping`)) {
    message.channel.send(`Hold on!!`).then(m => {
    m.edit(`:ping_pong:**Pong!**\nDiscord API heartbeat is ` + Math.round(client.ping) + `ms.`);
    });

}   
if (message.content.toLowerCase().startsWith(prefix + `new`)) {
    const reason = message.content.split(" ").slice(1).join(" ");
    if (!message.guild.roles.exists("name", "Support")) return message.channel.send(`This server doesn't have a \`Support Team\` role made, so the ticket won't be opened.\nIf you are an administrator, make one with that name exactly and give it to users that should be able to see tickets.`);
    if (message.guild.channels.exists("name", "ticket-" + message.author.id)) return message.channel.send(`You already have a ticket open.`);
    ticketIndex++;
    fs.writeFileSync("./ticketIndex", ticketIndex.toString())
    message.guild.createChannel(`ticket-${ticketIndex}`, "text").then(c => {
        c.setParent("419825475209396224");
        let role = message.guild.roles.find("name", "Support");
        let role2 = message.guild.roles.find("name", "@everyone");
        c.overwritePermissions(role, {
            SEND_MESSAGES: true,
            READ_MESSAGES: true
        });
        c.overwritePermissions(role2, {
            SEND_MESSAGES: false,
            READ_MESSAGES: false
        });
        c.overwritePermissions(message.author, {
            SEND_MESSAGES: true,
            READ_MESSAGES: true
        });
        const embed1 = new Discord.RichEmbed()
        .setTitle(`:tickets: **BlocksBot**`)
        .setColor(0xff0000)
        .setDescription(`:white_check_mark: Successfully created a Support ticket for you :ok_hand: <#${c.id}>.`)
        .setTimestamp();
        message.channel.send({ embed: embed1 });
        const embed = new Discord.RichEmbed()
        .setColor(0xff0000)
        .addField(`Hey ${message.author.username}!`, `This is your private support ticket, where you can get assistance regarding basically any issue you might be suffering from, and we will try to respond as soon as possible.\nFor now, begin with explaining your issue and instructing us how can we assist you.\nIf support doesn't respond in a while, feel free to tag any staff member for assistance.`)
        .setTimestamp();
        c.send({ embed: embed });
    }).catch(console.error);
}
if (message.content.toLowerCase().startsWith(prefix + `close`)) {
    if (!message.channel.name.startsWith(`ticket-`)) return message.channel.send(`You can't use the close command outside of a ticket channel.`);

    message.channel.send(`Are you sure? Once confirmed, you cannot reverse this action!\nTo confirm, type \`-confirm\`. This will time out in 10 seconds and be cancelled.`)
    .then((m) => {
      message.channel.awaitMessages(response => response.content === '-confirm', {
        max: 1,
        time: 10000,
        errors: ['time'],
      })
      .then((collected) => {
          message.channel.delete();
        })
        .catch(() => {
          m.edit('Ticket close timed out, the ticket was not closed.').then(m2 => {
              m2.delete();
          }, 3000);
        });
    });
  }
});

client.login(process.env.BOT_TOKEN);
