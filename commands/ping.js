const config = require("../botconfig.json");
const adminList = config.adminList;

exports.run = (client, message, args) => {
  message.channel.send("pong")
  if(args[0]) message.channel.send(`got first arg ${args[0]}`)
}

exports.help = {
  name: 'ping'
}