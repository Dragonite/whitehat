const config = require("../botconfig.json");
const { adminList, colors } = config;
let pool = require('../sql');

exports.run = (client, message, args, clientEventChannel, everyone, getAdminName) => {

  // Prevent infinite bot loop
  if (message.author.bot) return;

  // Get user information from ID, returns promise
  async function addEvent(title, location, time, info) {
    let query = `INSERT INTO events(title, location, time, info) VALUES ("${title}", "${location}", "${time}", "${info}")`;
    return new Promise((resolve, reject) => {
      pool.query(query, function (err, result) {
        if (err) throw err;
        resolve(result)
      })
    })
  }

  const newLineArgs = message.content.slice(config.prefix.length).trim().split('\n');
  newLineArgs.shift();
  if (adminList.includes(message.author.id)) {
    if (newLineArgs.length > 0) {
      if (newLineArgs.length <= 4) {
        const title = newLineArgs[0] || "Not Specified";
        const location = newLineArgs[1] || "Not Specified";
        const dateAndTime = newLineArgs[2] || "Not Specified";
        const extraInformation = newLineArgs[3] || "Not Specified";

        addEvent(title, location, dateAndTime, extraInformation).then(clientEventChannel.send({
          embed: {
            color: colors.info,
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
              icon_url: client.user.avatarURL,
              text: `UWA Ethical Hacking Club ${config.currentYear}`
            }
          }
        }).then(clientEventChannel.send(everyone).then(msg => { msg.delete(1) }).then(
          message.channel.send({
            embed: {
              color: colors.success,
              title: "Event created successfully!",
              timestamp: new Date(),
              footer: {
                icon_url: message.author.avatarURL,
                text: 'Created by ' + getAdminName(message.author.id)
              }
            }
          })
        ).then(console.log(`New event created by ${message.author.username}!`)).catch(console.error))).catch(console.error)
      } else {
        message.channel.send(
          {
            embed: {
              color: colors.danger,
              title: 'Invalid Command Structure',
              description: "Please check the structure to creating an event by typing **!event**",
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
      message.channel.send({
        embed: {
          color: colors.info,
          title: "Create an Event",
          description: "Events can be created using the **!event** command. Parameters are separated by a new line character. \n ```!event\nTitle\nLocation\nTime\nExtra Information```",
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
            icon_url: client.user.avatarURL,
            text: client.user.username
          }
        }
      });
    }
  } else {
    message.channel.send("You must be an Administrator to use the `!event` command.");
  }
}

exports.help = {
  name: 'event'
}