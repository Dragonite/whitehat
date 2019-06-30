const config = require("./botconfig.json");

const Discord = require('discord.js');

const client = new Discord.Client();

const adminList = config.adminList;

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity('you hack ethically!', {type: 'WATCHING'});
});

client.on('message', msg => {
  if(msg.author.bot) return;
  if(msg.content === 'test' && adminList.includes(msg.author.id)){
    // msg.channel.send('hello haolin')
    msg.channel.send("You are an administrator.");
  }

  if(msg.channel.type === "dm") return;
  if (msg.content === 'ping') {
    msg.reply('pong');
  }
});

client.login(config.token)