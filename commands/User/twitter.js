const Discord = require('discord.js');
const Twitter = require('twitter');
const config = require('../../config.json');
const twitterSchema = require('../../schemas/twitter-schema.js')

module.exports = {
  name: "twitter",
  aliases: ["twit"],
  description: "Displays your Twitter Profile",
  usage: "<Token>",
  run: async(client, message, args) => {
    var x
    const cli = new Twitter({
      consumer_key: config.consumer_key,
      consumer_secret: config.consumer_secret,
      access_token_key: config.access_token_key,
      access_token_secret: config.access_token_secret
    });
    twitterSchema.findOne({userId : message.author.id}, async (err, data) => {
      if (!data){
        return message.reply({content: 'Your Discord profile is not connected to this Bot'});
      }
       x = data.twitter
       console.log(x)
    var params = {user_id: x};
    cli.get(`users/show`, params,  function(error, tweets, response) {
      if (!error) {
        console.log(tweets)
         const embed = new Discord.MessageEmbed()
           .setColor('#0099ff')
           .setTitle('Twitter')
           .setURL(`https://twitter.com/${tweets.screen_name}`)
           
           .setThumbnail(tweets.profile_image_url_https)
           .addFields(
             { name: 'Name', value: tweets.name, inline: false},
           )
           .addFields(
            { name: 'UserName', value: tweets.screen_name, inline: false },
          )
          .addFields(
            { name: 'Following', value: `${tweets.friends_count}`, inline: true },
          )
          .addFields(
            { name: 'Followers', value: `${tweets.followers_count}`, inline: true },
          )
           .setImage(message.author.displayAvatarURL)
           .setTimestamp('timestamp')
           if(tweets.description ) {
            embed.setDescription('description')
           }
         
           return message.reply({embeds : [embed]})
      }else {
        console.log(error)
        return message.reply({content: 'Unable to access Details'});
      }
    });
  })
  },
};
