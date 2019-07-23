const config = require("../botconfig.json");
let pool = require('../sql');
const { colors } = config;

exports.run = (client, message, args) => {

  async function createUser(id, full_name, description, link, htb) {
    let query = `INSERT IGNORE INTO users (discord_id, full_name, description, link, htb) VALUES ("${id}", "${full_name}", "${description}", "${link}", "${htb}")`;
    return new Promise((resolve, reject) => {
      pool.query(query, function (err, result) {
        if (err) throw err;
        resolve(result)
      })
    })
  }

  const newLineArgs = message.content.slice(config.prefix.length).trim().split('\n');
  newLineArgs.shift();
  if (newLineArgs.length === 0) {
    message.channel.send({
      embed: {
        color: colors.info,
        title: "Register your Profile",
        description: "It's often hard to know who's who on Discord, so please register yourself in the following format:\n```!register\nFull Name\nDescription (Short description about yourself)\nLink (Github, LinkedIn, etc)\nHackTheBox Profile ID```",
        footer: {
          icon_url: client.user.avatarURL,
          text: `UWA Ethical Hacking Club ${config.currentYear}`
        }
      }
    })

  } else if (newLineArgs.length == 2 || newLineArgs.length == 3 || newLineArgs.length == 4) {
    const full_name = newLineArgs[0];
    const description = newLineArgs[1];
    const link = newLineArgs[2] ? newLineArgs[2] : "No link provided";
    const htb = newLineArgs[3] ? newLineArgs[3] : "No HackTheBox Profile provided"
    createUser(message.author.id, full_name, description, link, htb).then((result) => {
      if (result === null || result === undefined || result.affectedRows === 0) {
        message.channel.send(
          {
            embed: {
              color: colors.warning,
              title: 'Profile already exists!',
              description: 'You already have a profile. Use **!profile** to view it',
              timestamp: new Date(),
              footer: {
                icon_url: client.user.avatarURL,
                text: 'Bot'
              }
            }
          }
        )
      } else {
        message.channel.send(
          {
            embed: {
              color: colors.success,
              title: "Profile created successfully!",
              timestamp: new Date(),
              footer: {
                icon_url: message.author.avatarURL,
                text: message.author.username
              }
            }
          }
        )
      }
    })
  } else {
    message.channel.send(
      {
        embed: {
          color: colors.danger,
          title: 'Invalid Command Structure',
          description: "Please check the structure to register a profile by typing **!register**, otherwise if you have a profile already, type **!profile**",
          timestamp: new Date(),
          footer: {
            icon_url: client.user.avatarURL,
            text: 'Bot'
          }
        }
      }
    )
  }
}

exports.help = {
  name: 'register'
}