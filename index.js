const config = require("./botconfig.json");
const Discord = require('discord.js');
const fs = require('fs');
const Enmap = require('enmap');
const client = new Discord.Client();

const adminList = config.adminList;

client.commands = new Enmap();

function getAdminName(id) {
  if (id == adminList[0]) {
    return "Haolin Wu"
  } else if (id == adminList[1]) {
    return "David Glance"
  }
}

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  // Set bot activity
  client.user.setActivity('you hack ethically!', { type: 'WATCHING' });
});

client.on('message', message => {

  // Checking for infinite bot loop, check if message begins with prefix
  if (message.author.bot) return;
  if (message.content.indexOf(config.prefix) !== 0) return;

  // Get arguments for space separated commands
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  args.shift();

  // Get arguments for new line separated commands
  const getCommandFromArgs = message.content.slice(config.prefix.length).trim().split(/[\n\r\s]+/g);
  const command = getCommandFromArgs.shift().toLowerCase();

  // Define announcement channel for sending messages
  const announcementChannel = client.channels.get(config.announcements);
  const everyone = "@everyone";

  const cmd = client.commands.get(command);
  if (!cmd) return;
  cmd.run(client, message, args, announcementChannel, everyone, getAdminName);
});

fs.readdir('./commands/', async (err, files) => {
  if (err) return console.error;
  files.forEach(file => {
    if (!file.endsWith('.js')) return;
    let props = require(`./commands/${file}`);
    let cmdName = file.split('.')[0];
    console.log(`Loaded command '${cmdName}'.`)
    client.commands.set(cmdName, props);
  })
});

client.login(config.token)