const { Client, Collection } = require("discord.js");

const client = new Client({
    intents: 32767,
    allowedMentions: { parse: ['users'], repliedUser: true }
});
module.exports = client;

// Global Variables
client.commands = new Collection();
client.aliases = new Collection()
client.slashCommands = new Collection();
client.config = require("./config.json");
client.snipes = new Collection()
client.esnipes = new Collection()

// Initializing the project
require("./handler")(client);

process.on("unhandledRejection", (reason, p) => {
    console.log(" [antiCrash] :: Unhandled Rejection/Catch");
    console.log(reason, p);
});
process.on("uncaughtException", (err, origin) => {
    console.log(" [antiCrash] :: Uncaught Exception/Catch");
    console.log(err, origin);
});
process.on("uncaughtExceptionMonitor", (err, origin) => {
    console.log(" [antiCrash] :: Uncaught Exception/Catch (MONITOR)");
    console.log(err, origin);
});
process.on("multipleResolves", (type, promise, reason) => {
    console.log(" [antiCrash] :: Multiple Resolves");
    console.log(type, promise, reason);
});





client.login(client.config.token);