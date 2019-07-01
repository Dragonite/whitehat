const config = require("../botconfig.json");
const adminList = config.adminList;

exports.run = async (client, message, args) => {
  if (adminList.includes(message.author.id)) {

      let msg = await message.channel.send({
        embed: {
          color: 3447003,
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
    
  } else {
    message.channel.send("You must be an Administrator to use the `!createrolemessage` command.");
  }
}

exports.help = {
  name: 'ping'
}