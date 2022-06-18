const Discord = require('discord.js');
const Twitter = require('twitter');
const { guilds } = require('../..');
const config = require('../../config.json');
const twitterSchema = require('../../schemas/twitter-schema.js')

module.exports = {
  name: "settwitter",
  aliases: ["settwit"],
  description: "Connects your Twitter account to Discord Profile",
  usage: "<Token>",
  run: async (client, message, args) => {
    twitterSchema.findOne({ token: args[0] }, async (err, data) => {
      if (data) {
        return message.reply({ content: 'Expired Token!' });
      }
      else {
        let decode = args[0];
        let fake = '', x = '';
        fake = decode.split('');
        for (let k = 0; k < fake.length; k++) {
          if ((k + 1) % 3 == 0) {
            x += fake[k];
          }
        }
        const cli = new Twitter({
          consumer_key: config.consumer_key,
          consumer_secret: config.consumer_secret,
          access_token_key: config.access_token_key,
          access_token_secret: config.access_token_secret
        });
        var params = { user_id: x };
        cli.get('users/show', params, function (error, tweets, response) {

          if (!error) {
            console.log(tweets)
            twitterSchema.findOne({ userId: message.author.id }, async (err, data) => {
              if (data) {
                data.twitter = x
                data.token = args[0]
                
                await twitterSchema.findOneAndUpdate({ userId: message.author.id }, data)
                return message.reply({ content: `**Twitter account** has been successfully udated and set to **${tweets.screen_name}**` });
              } else {
                new twitterSchema({
                  userId: message.author.id,
                  twitter: x,
                  token: args[0],
                  member: message.author.tag,
                  guildId: message.guild.id,
                  screen: tweets.screen_name
                }).save()
                return message.reply({ content: `**Twitter account** has been successfully connected and set to **${tweets.screen_name}**` });
              }
            })

          } else {
            console.log(error)
            return message.reply({ content: 'unable to find twitter account, provide a valid secret token' });
          }
        });
      }
    })

  },
};
