const config = require("../botconfig.json");
const { adminList, welcomeChannel, colors } = config;

exports.run = async (client, message, args) => {
  if (adminList.includes(message.author.id)) {
    if (args.length === 0) {
      message.channel.send({
        embed: {
          color: colors.info,
          title: "Create a Post",
          description: `**!post** takes one *parameter*. <@${client.user.id}> is able to generate static messages in channels based on this *parameter*.\n\nUsage: **!post parameter**\n\nAvailable Parameters:`,
          fields: [
            {
              name: "role",
              value: `The default role assignment message in <#${welcomeChannel}>`
            }
          ],
          footer: {
            icon_url: client.user.avatarURL,
            text: `UWA Ethical Hacking Club ${config.currentYear}`
          }
        }
      })
    } else if (args.length === 1) {
      switch (args[0].toLowerCase()) {
        case 'role':
          let msg = await message.channel.send({
            embed: {
              color: colors.info,
              title: "Welcome to the UWA Ethical Hacking Club Discord!",
              description: "This Discord Server will be used to communicate upcoming events, as well as provide a platform for discussion for the club.\n\n If you would like to help other students with Hack The Box, Linux, or anything else, please react to this post to receive a ***Helper Role*** that students can ping you with.",
              fields: [
                {
                  name: "Organisers",
                  value: `<@${config.adminList[1]}>\nJin Hong`
                },
                {
                  name: "Helper Roles",
                  value: `<@&${config.helperRoleList[0]}>\n<@&${config.helperRoleList[1]}>\n<@&${config.helperRoleList[2]}>`
                }
              ],
              footer: {
                icon_url: client.user.avatarURL,
                text: `UWA Ethical Hacking Club ${config.currentYear}`
              }
            }
          });

          config.helperEmojiList.forEach(async e => {
            console.log(`Added reaction for ${e}`)
            await msg.react(e);
          });

          break;
        default:
          message.channel.send(
            {
              embed: {
                color: colors.danger,
                title: "**!post** *parameter* does not exist!",
                footer: {
                  icon_url: client.user.avatarURL,
                  text: `UWA Ethical Hacking Club ${config.currentYear}`
                }
              }
            }
          )

      }
    } else {
      message.channel.send(
        {
          embed: {
            color: colors.danger,
            title: 'Invalid Command Structure',
            description: "Please check the posts available by typing **!post**",
            timestamp: new Date(),
            footer: {
              icon_url: client.user.avatarURL,
              text: 'Bot'
            }
          }
        }
      )
    }
  } else {
    message.channel.send("You must be an Administrator to use the **!post** command.");
  }
}

exports.help = {
  name: 'ping'
}