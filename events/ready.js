const client = require("../index")
const config = require("../config.json")
const mongo = require("../handler/mongoose");
const Discord = require('discord.js');
const Twitter = require('twitter');
const twitterSchema = require('../schemas/twitter-schema')
const economy = require('../utils/economy')
const invites = new Discord.Collection();
const roleSchema = require('../schemas/role-schema')
const likeSchema = require('../schemas/like-schema')
client.on("ready", async () => {

    const arrayOfStatus = [
        `Bot's still in Testing`
    ];

    let index = 0
    setInterval(() => {
        if (index === arrayOfStatus.length) index = 0
        const status = arrayOfStatus[index]
        client.user.setActivity(status);
        index++
    }, 10000)

    console.log(`${client.user.tag} is ready to go!`)

    await mongo().then(mongoose => {
        try {
            console.log("Connected to mongo!")
        } catch (err) {
            console.log(err)
        }
    }) 
    const cli = new Twitter({
      consumer_key: config.consumer_key,
      consumer_secret: config.consumer_secret,
      access_token_key: config.access_token_key,
      access_token_secret: config.access_token_secret
    });
  func = () =>{
    twitterSchema.find({}, (err, twits) => {
      twits.forEach(elem => {
        var params = {user_id: elem.twitter, count: 100};
        var i =0
        cli.get('favorites/list', params,  async function(error, tweets, response) {
          if (!error) {
              tweets.forEach(x => {
                // if (params.user_id === "1473122033512837124" ) {
                //   console.log(`${i} -------> ${tweets[i].text}`)
                //   i++
                // }
                  if(x.user.id==config.mainId) {
                    likeSchema.findOne({userId: elem.twitter,  tweetId: x.id}, async (err, data) => {
                      if (data == undefined) {
                        console.log('giving rewards')
                        const embed = new Discord.MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle(`${elem.member.slice(0,elem.member.length-5)} earned 300 coins by liking the following tweet`)
                        .setURL(`https://twitter.com/${x.user.screen_name}`)
                        
                        .setThumbnail(x.user.profile_image_url_https)
                        .addFields(
                          { name: 'Name', value: x.user.name, inline: true},
                        )
                        .addFields(
                         { name: 'UserName', value: x.user.screen_name, inline: true },
                       )
                       .addFields(
                         { name: 'Tweet', value: `${x.text}`, inline: false },
                       )
                       
                        .setTimestamp('timestamp')
                        //console.log(client.channels)
                        client.channels.cache.get(config.channelId).send({content: `<@${elem.id}>`, embeds: [embed]});
                        await economy.addCoins(elem.guildId, elem.userId, 300)
                       
                        await new likeSchema({
                          tweetId: x.id,
                          userId: elem.twitter
                      }).save()
                      }

                    })
                   
                }
              })  
              i=0
          }else {
            //
          }
        });
      })
      
    })
 
  }
  setInterval(() => {
    func()
  }, 10000)
    
})
