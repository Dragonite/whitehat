const config = require("./botconfig.json");
const Discord = require('discord.js');
const fs = require('fs');
const Enmap = require('enmap');
const client = new Discord.Client();

const { prefix, token, adminList, activity, welcomeChannel, welcomeMessage, helperRoleList, eventChannel } = config;

client.commands = new Enmap();

function getAdminName(id) {
  if (id == adminList[0]) {
    return "Haolin Wu"
  } else if (id == adminList[1]) {
    return "David Glance"
  } else if (id == adminList[2]) {
    return "Jin Hong"
  }
}

console.log(config.startupMessage);

client.on("ready", () => {
  console.log(`Discord Connected!\nLogged in as ${client.user.tag}.`);
  // Set bot activity
  client.user.setActivity(activity, { type: 'WATCHING' });
  // Add welcome message to cache
  client.channels.get(welcomeChannel).fetchMessage(welcomeMessage).catch(console.error);
});

client.on('message', message => {

  // Checking for infinite bot loop, check if message begins with prefix
  if (message.author.bot) return;
  if (message.content.indexOf(config.prefix) !== 0) return;

  // Get arguments for space separated commands
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  args.shift();

  // Get arguments for new line separated commands
  const getCommandFromArgs = message.content.slice(prefix.length).trim().split(/[\n\r\s]+/g);
  const command = getCommandFromArgs.shift().toLowerCase();

  // Define announcement channel for sending messages
  const clientEventChannel = client.channels.get(eventChannel);
  const everyone = "@everyone";

  const cmd = client.commands.get(command);
  if (!cmd) return;
  cmd.run(client, message, args, clientEventChannel, everyone, getAdminName);
});

client.on("messageReactionAdd", async (reaction, user) => {
  if (user.bot) return;
  const guildmember = await reaction.message.guild.fetchMember(user);
  if (reaction.message.id === welcomeMessage){
    switch (reaction.emoji.name) {
      case 'HackTheBox':
        guildmember.addRole(helperRoleList[0]).catch(console.error);
        break;
      case 'Linux':
        guildmember.addRole(helperRoleList[1]).catch(console.error);
        break;
      case 'Helper':
        guildmember.addRole(helperRoleList[2]).catch(console.error);
        break;
      default:
        console.log("Invalid Reaction");
    }
  }
  console.log(`${user.username} reacted with "${reaction.emoji.name}".`);
});

client.on('messageReactionRemove', async (reaction, user) => {
  if (user.bot) return;
  const guildmember = await reaction.message.guild.fetchMember(user);
  if (reaction.message.id === welcomeMessage){
    switch (reaction.emoji.name) {
      case 'HackTheBox':
        guildmember.removeRole(helperRoleList[0]).catch(console.error);
        break;
      case 'Linux':
        guildmember.removeRole(helperRoleList[1]).catch(console.error);
        break;
      case 'Helper':
        guildmember.removeRole(helperRoleList[2]).catch(console.error);
        break;
      default:
        console.log("Invalid Reaction");
    }
  }
  console.log(`${user.username} removed their "${reaction.emoji.name}" reaction.`);
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

client.login(token)