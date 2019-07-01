const config = require("../botconfig.json");
const adminList = config.adminList;

exports.run = (client, message, args, announcementChannel, everyone, getAdminName) => {
  const newLineArgs = message.content.slice(config.prefix.length).trim().split('\n');
  newLineArgs.shift();
  console.log(newLineArgs)
  if (adminList.includes(message.author.id)) {
    if (newLineArgs.length > 0) {
      const title = newLineArgs[0] || "Not Specified";
      const location = newLineArgs[1] || "Not Specified";
      const dateAndTime = newLineArgs[2] || "Not Specified";
      const extraInformation = newLineArgs[3] || "Not Specified";
      announcementChannel.send({
        embed: {
          color: 3447003,
          title,
          fields: [
            {
              name: "Location",
              value: location
            },
            {
              name: "Date and Time",
              value: dateAndTime
            },
            {
              name: "Extra Information",
              value: extraInformation
            }
          ],
          timestamp: new Date(),
          footer: {
            icon_url: message.author.avatarURL,
            text: getAdminName(message.author.id)
          }
        }
      })
      announcementChannel.send(everyone).then(msg => { msg.delete(1) });
    } else {
      message.channel.send({
        embed: {
          color: 3447003,
          title: "Create an Event",
          description: "Events can be created using the !event command. Fields are separated by a new line character. \n ```!event\nTitle\nLocation\nTime\nExtra Information```",
          fields: [{
            name: "Title",
            value: "Title of the event"
          },
          {
            name: "Location",
            value: "Location of the event"
          },
          {
            name: "Date and Time",
            value: "Date and Time of the event"
          },
          {
            name: "Extra Information",
            value: "Any additional information, i.e. bring laptop, available refreshments."
          }
          ],
          timestamp: new Date(),
          footer: {
            // icon_url: message.author.avatarURL,
            // text: getAdminName(message.author.id)
            icon_url: client.user.avatarURL,
            text: client.user.username
          }
        }
      });
    }
    // let time = newLineArgs[1];
    message.channel.send("You can use the `!event` command.");
    // message.channel.send(`The event is at ${time}`)
  } else {
    message.channel.send("You must be an administrator to use the `!event` command.");
  }
}

exports.help = {
  name: 'event'
}