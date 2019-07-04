const config = require("../botconfig.json");
const { adminList, botChannel, colors } = config;
let connection = require('../sql');

exports.run = async (client, message, args) => {
  // Prevent infinite bot loop
  if(message.author.bot) return;

  // Get user information from ID, returns promise
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
  
  // Deletes a user from the database based on ID, returns a promise
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

  // RegEx that checks that the start and end of the provided string are only digits
  const expression = /^\d*$/g;
  // id and proceedWithMessage variables, id is based on how many arguments there are, proceed with message depends on a RegEx test
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

  // If we don't proceed with message, return a failed command structure message.
  if (!proceedWithMessage) {
    message.channel.send(
      {
        embed: {
          color: colors.danger,
          title: 'Invalid Command Structure',
          description: "Please check someone's profile by tagging them **!profile @user**, or **!profile** for your own profile. ",
          timestamp: new Date(),
          footer: {
            icon_url: client.user.avatarURL,
            text: 'Bot'
          }
        }
      }
    );

  } else {
    // Logic for own profile and also for checking other users profiles
    if (args.length <= 1) {
      getUserInformation(id).then((result) => {
        if (result === null || result === undefined || result.length === 0) {
          message.channel.send(
            {
              embed: {
                color: colors.info,
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
                color: colors.info,
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
      // If a second argument is provided, i.e. delete, etc
    } else if (args.length == 2) {
      // delete case, check for administrator status, turn into switch case in the future if more commands are needed
      if (args[1].toLowerCase() === 'delete' && adminList.includes(message.author.id)) {
        // SQL Query is immediately fired, and the result returned's affectedRows property tells us if a user was deleted or not
        deleteUserInformation(id).then((result) => {
          if (result.affectedRows === 0) {
            message.channel.send(
              {
                embed: {
                  color: colors.info,
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
                  color: colors.success,
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
      } else {
        message.channel.send(
          {
            embed: {
              color: colors.info,
              title: "You must be an administrator to delete a profile.",
              timestamp: new Date(),
              footer: {
                icon_url: client.user.avatarURL,
                text: Bot
              }
            }
          }
        )
      }
    }
  }
}

exports.help = {
  name: 'profile'
}