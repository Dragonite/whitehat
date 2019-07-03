const config = require("../botconfig.json");
const { adminList, botChannel } = config;

const { host, user, database } = config.database;

const mysql = require('mysql');

let connection = mysql.createConnection({ host, user, database });

connection.connect(function (err) {
  if (err) {
    throw err;
  };
  console.log("MySQL Connected!");
});

async function getUserInformation(id) {
  let query = `SELECT full_name,description,link FROM users WHERE discord_id = ${id}`;
  let promise = new Promise((resolve, reject) => {
    connection.query(query, function (err, result) {
      if (err) throw err;
      resolve(result);
    })
  });
  return promise;
}

async function deleteUserInformation(id) {
  let query = `DELETE FROM users WHERE discord_id = ${id}`;
  let promise = new Promise((resolve, reject) => {
    connection.query(query, function (err, result) {
      if (err) throw err;
      resolve(result);
    })
  });
  return promise;
}

exports.run = async (client, message, args) => {
  const expression = /^\d*$/g;
  let id;
  let proceedWithMessage = false;
  if (args.length > 0) {
    if (args[0].length < 21) {
      proceedWithMessage = false;
    } else if (args[0].length >= 21 && expression.test(args[0].slice(2).slice(0, -1))) {
      proceedWithMessage = true;
      id = args[0].slice(2).slice(0, -1);
    }
  } else {
    proceedWithMessage = true;
    id = message.author.id;
  }
  if (!proceedWithMessage) {
    message.channel.send(
      {
        embed: {
          color: 25500,
          title: 'Invalid Command Structure',
          description: "Please check someone's profile by tagging them `!profile @user`, or `!profile` for your own profile. ",
          timestamp: new Date(),
          footer: {
            icon_url: client.user.avatarURL,
            text: 'Bot'
          }
        }
      }
    );

  } else {
    if (args.length <= 1) {
      getUserInformation(id).then((result) => {
        if (result === null || result === undefined || result.length === 0) {
          message.channel.send(
            {
              embed: {
                color: 25500,
                title: 'No Profile Exists',
                description: args.length == 0 ? `To create your profile, use the **!register** command in <#${botChannel}>.` : "This user has not registered a profile yet.",
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
                color: 3447003,
                title: result[0].full_name,
                description: result[0].description,
                fields: [
                  {
                    name: "Discord Tag",
                    value: client.users.get(id).tag
                  },
                  {
                    name: "Link",
                    value: result[0].link ? result[0].link : "No link provided."
                  }
                ],
                footer: {
                  icon_url: client.users.get(id).avatarURL,
                  text: client.users.get(id).username
                }
              }
            }
          )
        }
      })
    } else if (args.length == 2) {
      if (args[1].toLowerCase() === 'delete') {
        deleteUserInformation(id).then((result) => {
          if (result.affectedRows === 0) {
            message.channel.send(
              {
                embed: {
                  color: 25500,
                  title: 'No profile exists to be deleted.',
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
                  color: 3447003,
                  title: "Profile deleted!",
                  timestamp: new Date(),
                  footer: {
                    icon_url: client.users.get(id).avatarURL,
                    text: client.users.get(id).username
                  }
                }
              }
            )
          }
        })
      }
    }
  }
}

exports.help = {
  name: 'profile'
}