const config = require("../botconfig.json");
let connection = require('../sql');
const adminList = config.adminList;

exports.run = (client, message, args, clientEventChannel, everyone, getAdminName) => {
  const newLineArgs = message.content.slice(config.prefix.length).trim().split('\n');
  newLineArgs.shift();
  if (newLineArgs.length === 0) {
    message.channel.send({
      embed: {
        color: 3447003,
        title: "Register your Profile",
        description: "It's often hard to know who's who on Discord, so please register yourself in the following format:\n```!register\nFull Name\nDescription (Short description about yourself)\nLink (Github, LinkedIn, etc)```",
        footer: {
          icon_url: client.user.avatarURL,
          text: `UWA Ethical Hacking Club ${config.currentYear}`
        }
      }
    })

  }
}

exports.help = {
  name: 'event'
}