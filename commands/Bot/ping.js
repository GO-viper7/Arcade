module.exports = { 
    name: "ping",
    description: "Returns bot latency",
    run: async (client, message, args) => {
        message.channel.send(`Pong! Latency is ${Math.round(client.ws.ping)}ms`);
    }
}