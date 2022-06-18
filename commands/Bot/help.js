const { MessageEmbed, MessageActionRow, MessageSelectMenu, MessageButton } = require("discord.js")
const { readdirSync } = require("fs")
const serverConfig = require("../../schemas/server-config")
const config = require('../../config.json')

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = {
    name: "help",
    aliases: ["commands"],
    description: "Displays all the available bot commands.",
    run: async (client, message, args) => {
        let tBucks;

        serverConfig.findOne({ guildId: message.guild.id }, async (err, data) => {
            if (data) {
                tBucks = data.coin;
            } else {
                tBucks = config.coin;
            }
            if (data) {
                const prefix = data.prefix || client.config.prefix


                if (!args[0]) {
                    const emojis = {
                        actions: "🎩",
                        activities: "🚀",
                        configuration: "⚙️",
                        bot: "⚡",
                        moderation: "⚒️",
                        utility: "🔧",
                        games: "🎮",
                        image: "📸",
                        chatbot: "💬",
                        osu: "<:osu:876343647455547415>",
                        fun: "🎲",
                        gambling: "<:Bucks:946738019635957791>",
                        user: "<:deadinside:946739370625482762> ",
                        administrator: "<:Admin_Badge:946739961464508438>",
                        trivia: "<a:question:946741143859789884>"
                    }

                    const directories = [
                        ...new Set(client.commands.map((cmd) => cmd.directory))
                    ]

                    const formatString = (str) =>
                        `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`

                    const categories = directories.map((dir) => {
                        const getCommands = client.commands.filter(
                            (cmd) => cmd.directory === dir
                        ).map(cmd => {
                            return {
                                name: cmd.name || "There is no name for this command.",
                                description: cmd.description.replace('tBucks', tBucks) || "There is no description for this command."
                            }
                        })

                        return {
                            directory: formatString(dir),
                            commands: getCommands
                        }
                    })

                    const embed = new MessageEmbed()
                        .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL() })
                        .setTitle(`Help menu!`)
                        .addFields(
                            {
                                name: `Categories:`,
                                value: `**• Admin\n  • Bot\n  • Gambling \n  • Games \n  • Trivia \n  • User**`

                            },
                     
                        )
                        .setColor("FFFF00")
                        .setFooter({ text: `Help requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })

                    const components = (state) =>

                        new MessageActionRow().addComponents(
                            new MessageSelectMenu()
                                .setCustomId("help-menu")
                                .setPlaceholder("Please select a category!")
                                .setDisabled(state)
                                .addOptions(
                                    categories.map((cmd) => {
                                        return {
                                            label: cmd.directory,
                                            value: cmd.directory.toLowerCase(),
                                            description: `Commands from ${cmd.directory} category.`,
                                            emoji: emojis[cmd.directory.toLowerCase()] || null
                                        }
                                    })
                                )
                        )


                    const row = new MessageActionRow().addComponents(

                        home = new MessageButton()
                            .setCustomId("Home")
                            .setLabel("Home")
                            .setEmoji("🏠")
                            .setStyle("PRIMARY")
                            .setDisabled(true),

                        all = new MessageButton()
                            .setCustomId("all")
                            .setLabel("All Commands")
                            .setEmoji("📜")
                            .setStyle("PRIMARY")
                            .setDisabled(false),
                    )

                    const initialMessage = await message.reply({
                        embeds: [embed],
                        components: [components(false), row]
                    }).catch((err) => { })

                    const filter = (interaction) => {
                        if (interaction.user.id === message.author.id) return true;
                        return interaction.reply({
                            content: `Only ${message.author.tag} can use this interaction!`,
                            ephemeral: true,
                        });
                    };

                    const collector = initialMessage.createMessageComponentCollector({
                        filter,
                        componentType: "SELECT_MENU",
                        time: 60000,
                    })

                    const buttoncollector = initialMessage.createMessageComponentCollector({
                        filter,
                        componentType: "BUTTON",
                        time: 60000,
                    })



                    collector.on('collect', async (interaction) => {
                        const [directory] = interaction.values
                        const category = categories.find(
                            (x) => x.directory.toLowerCase() === directory
                        )

                        try {
                            const categoryEmbed = new MessageEmbed()
                                .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL() })
                                .setTitle(`${capitalizeFirstLetter(directory)}`)
                                .setDescription(`**Here are the list of commands under the \`${directory}\` category**`)
                                .addFields(
                                    category.commands.map((cmd) => {
                                        return {
                                            name: `\`${cmd.name}\``,
                                            value: cmd.description.replace('tBucks', tBucks),
                                            inline: true
                                        }
                                    })
                                )
                                
                                .setColor("FFFF00")
                            row.components[1].setDisabled(false)
                            row.components[0].setDisabled(false)


                            interaction.update({ embeds: [categoryEmbed], components: [components(false), row] }).catch((err) => { })
                        } catch (err) {
                            console.log(err)
                        }
                    })

                    buttoncollector.on('collect', async (interaction) => {
                        if (interaction.customId === "all") {
                            let categories = [];

                            readdirSync("./commands/").forEach((dir) => {
                                const commands = readdirSync(`./commands/${dir}/`).filter((file) =>
                                    file.endsWith(".js")
                                );

                                const cmds = commands.map((command) => {
                                    let file = require(`../../commands/${dir}/${command}`);

                                    if (!file.name) return "No command name.";

                                    let name = file.name.replace(".js", "");

                                    return `\`${name}\``;
                                });

                                let data = new Object();

                                data = {
                                    name: `${capitalizeFirstLetter(dir)}`,
                                    value: cmds.length === 0 ? "In progress." : cmds.join(", "),
                                };

                                categories.push(data);
                            });

                            try {
                                const otherEmbed = new MessageEmbed()
                                    .setAuthor({ name: `${client.user.tag}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
                                    .setTitle("📬 Need help? Here are all of my commands:")
                                    .addFields(categories)
                                    .setFooter(
                                        {
                                            text: `Requested by ${message.author.tag}`,
                                            iconURL: message.author.displayAvatarURL({ dynamic: true })
                                        }
                                    )
                                    .setTimestamp()
                                    .setColor("FFFF00");
                                row.components[1].setDisabled(true)
                                row.components[0].setDisabled(false)


                                interaction.update({ embeds: [otherEmbed], components: [components(false), row] })
                            } catch (err) {
                                console.log(err)
                            }
                        }

                        if (interaction.customId === "Home") {

                            try {

                                row.components[1].setDisabled(false)
                                row.components[0].setDisabled(true)


                                interaction.update({ embeds: [embed], components: [components(false), row] }).catch((err) => { })
                            } catch (err) {
                                console.log(err)
                            }
                        }
                    })

                    collector.on("end", () => {
                        row.components[1].setDisabled(true)
                        row.components[0].setDisabled(true)

                        initialMessage.edit({ components: [components(true), row] })
                    })

                } else {
                    const command =
                        client.commands.get(args[0].toLowerCase()) ||
                        client.commands.find(
                            (c) => c.aliases && c.aliases.includes(args[0].toLowerCase())
                        );

                    if (!command) {
                        try {
                            const embed = new MessageEmbed()
                                .setTitle(`Invalid command! Use \`${prefix}help\` for all of my commands!`)
                                .setColor("FF0000");
                            return await message.reply({ embeds: [embed] });
                        } catch (err) {
                            console.log(err)
                        }
                    }

                    try {
                        const embed = new MessageEmbed()
                            .setTitle("__Command Details!__")
                            .addField("PREFIX:", `\`${prefix}\``)
                            .addField(
                                "COMMAND:",
                                command.name ? `\`${command.name}\`` : "No name for this command."
                            )
                            .addField(
                                "ALIASES:",
                                command.aliases
                                    ? `\`${command.aliases.join("` `")}\``
                                    : "No aliases for this command."
                            )
                            .addField(
                                "USAGE:",
                                command.usage
                                    ? `\`${prefix}${command.name} ${command.usage}\``
                                    : `\`${prefix}${command.name}\``
                            )
                            .addField(
                                "DESCRIPTION:",
                                command.description.replace('tBucks', tBucks)
                                    ? command.description.replace('tBucks', tBucks)
                                    : "No description for this command."
                            )
                            .setFooter(
                                {
                                    text: `Requested by ${message.author.tag}`,
                                    iconURL: message.author.displayAvatarURL({ dynamic: true })
                                }
                            )
                            .setTimestamp()
                            .setColor("FFFF00");
                        return await message.reply({ embeds: [embed] });
                    } catch (err) {
                        console.log(err)
                    }
                }
            } else {
                const prefix = client.config.prefix


                if (!args[0]) {
                    const emojis = {
                        actions: "🎩",
                        configuration: "⚙️",
                        misc: "⚡",
                        moderation: "⚒️",
                        utility: "🔧",
                        gambling: "<:Bucks:946738019635957791>",
                        user: "<:deadinside:946739370625482762>",
                        administrator: "<:Admin_Badge:946739961464508438> ",
                        trivia: "<a:question:946741143859789884>"
                    }

                    const directories = [
                        ...new Set(client.commands.map((cmd) => cmd.directory))
                    ]

                    const formatString = (str) =>
                        `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`

                    const categories = directories.map((dir) => {
                        const getCommands = client.commands.filter(
                            (cmd) => cmd.directory === dir
                        ).map(cmd => {
                            return {
                                name: cmd.name || "There is no name for this command.",
                                description: cmd.description.replace('tBucks', tBucks) || "There is no description for this command."
                            }
                        })

                        return {
                            directory: formatString(dir),
                            commands: getCommands
                        }
                    })

                    const embed = new MessageEmbed()
                        .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL() })
                        .setTitle(`Help menu!`)
                        .setDescription(`Hi! I'm ${client.user.username}, a powerful multi-purpose bot that can do just about anything!`)
                        .addFields(
                            {
                                name: `Categories:`,
                                value: ` • Admin\n  • Bot\n  • Gambling \n  • Games \n  • Trivia \n  • User**`

                            },
                            {
                                name: `Links:`,
                                value: `[Invite](https://discord.com/api/oauth2/authorize?client_id=921717832251756554&permissions=8&scope=bot%20applications.commands) | [YouTube](https://youtube.com/octagonemusic) | [GitHub](https://github.com/octagonemusic)`
                            }
                        )
                        .setColor("FFFF00")
                        .setFooter({ text: `Help requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })

                    const components = (state) =>

                        new MessageActionRow().addComponents(
                            new MessageSelectMenu()
                                .setCustomId("help-menu")
                                .setPlaceholder("Please select a category!")
                                .setDisabled(state)
                                .addOptions(
                                    categories.map((cmd) => {
                                        return {
                                            label: cmd.directory,
                                            value: cmd.directory.toLowerCase(),
                                            description: `Commands from ${cmd.directory} category.`,
                                            emoji: emojis[cmd.directory.toLowerCase()] || null
                                        }
                                    })
                                )
                        )


                    const row = new MessageActionRow().addComponents(

                        home = new MessageButton()
                            .setCustomId("Home")
                            .setLabel("Home")
                            .setEmoji("🏠")
                            .setStyle("PRIMARY")
                            .setDisabled(true),

                        all = new MessageButton()
                            .setCustomId("all")
                            .setLabel("All Commands")
                            .setEmoji("📜")
                            .setStyle("PRIMARY")
                            .setDisabled(false),
                    )

                    const initialMessage = await message.reply({
                        embeds: [embed],
                        components: [components(false), row]
                    }).catch((err) => { })

                    const filter = (interaction) => {
                        if (interaction.user.id === message.author.id) return true;
                        return interaction.reply({
                            content: "Only owner can use this command",
                            ephemeral: true,
                        });
                    };

                    const collector = initialMessage.createMessageComponentCollector({
                        filter,
                        componentType: "SELECT_MENU",
                        time: 60000
                    })

                    const buttoncollector = initialMessage.createMessageComponentCollector({
                        filter,
                        componentType: "BUTTON",
                        time: 60000
                    })

                    collector.on('collect', async (interaction) => {
                        const [directory] = interaction.values
                        const category = categories.find(
                            (x) => x.directory.toLowerCase() === directory
                        )

                        try {
                            const categoryEmbed = new MessageEmbed()
                                .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL() })
                                .setTitle(`${capitalizeFirstLetter(directory)}`)
                                .setDescription(`**Here are the list of commands under the \`${directory}\` category**`)
                                .addFields(
                                    category.commands.map((cmd) => {
                                        return {
                                            name: `\`${cmd.name}\``,
                                            value: cmd.description.replace('tBucks', tBucks),
                                            inline: true
                                        }
                                    })
                                )
                                .setColor("FFFF00")

                            row.components[1].setDisabled(false)
                            row.components[0].setDisabled(false)


                            interaction.update({ embeds: [categoryEmbed], components: [components(false), row] }).catch((err) => { })
                        } catch (err) {
                            console.log(err)
                        }

                    })

                    buttoncollector.on('collect', async (interaction) => {
                        if (interaction.customId === "all") {
                            let categories = [];

                            readdirSync("./commands/").forEach((dir) => {
                                const commands = readdirSync(`./commands/${dir}/`).filter((file) =>
                                    file.endsWith(".js")
                                );

                                const cmds = commands.map((command) => {
                                    let file = require(`../../commands/${dir}/${command}`);

                                    if (!file.name) return "No command name.";

                                    let name = file.name.replace(".js", "");

                                    return `\`${name}\``;
                                });

                                let data = new Object();

                                data = {
                                    name: `${capitalizeFirstLetter(dir)}`,
                                    value: cmds.length === 0 ? "In progress." : cmds.join(", "),
                                };

                                categories.push(data);
                            });

                            try {
                                const otherEmbed = new MessageEmbed()
                                    .setAuthor({ name: `${client.user.tag}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
                                    .setTitle("📬 Need help? Here are all of my commands:")
                                    .addFields(categories)
                                    .setFooter(
                                        {
                                            text: `Requested by ${message.author.tag}`,
                                            iconURL: message.author.displayAvatarURL({ dynamic: true })
                                        }
                                    )
                                    .setTimestamp()
                                    .setColor("FFFF00");
                                row.components[1].setDisabled(true)
                                row.components[0].setDisabled(false)


                                interaction.update({ embeds: [otherEmbed], components: [components(false), row] })
                            } catch (err) {
                                console.log(err)
                            }
                        }

                        try {
                            if (interaction.customId === "Home") {
                                row.components[1].setDisabled(false)
                                row.components[0].setDisabled(true)


                                interaction.update({ embeds: [embed], components: [components(false), row] }).catch((err) => { })
                            }
                        } catch (err) {
                            console.log(err)
                        }
                    })

                    collector.on("end", () => {
                        row.components[1].setDisabled(true)
                        row.components[0].setDisabled(true)

                        initialMessage.edit({ components: [components(true), row] })
                    })
                } else {
                    const command =
                        client.commands.get(args[0].toLowerCase()) ||
                        client.commands.find(
                            (c) => c.aliases && c.aliases.includes(args[0].toLowerCase())
                        );

                    if (!command) {
                        try {
                            const embed = new MessageEmbed()
                                .setTitle(`Invalid command! Use \`${prefix}help\` for all of my commands!`)
                                .setColor("FF0000");
                            return await message.reply({ embeds: [embed] });
                        } catch (err) {
                            console.log(err)
                        }
                    }

                    try {
                        const embed = new MessageEmbed()
                            .setTitle("__Command Details!__")
                            .addField("PREFIX:", `\`${prefix}\``)
                            .addField(
                                "COMMAND:",
                                command.name ? `\`${command.name}\`` : "No name for this command."
                            )
                            .addField(
                                "ALIASES:",
                                command.aliases
                                    ? `\`${command.aliases.join("` `")}\``
                                    : "No aliases for this command."
                            )
                            .addField(
                                "USAGE:",
                                command.usage
                                    ? `\`${prefix}${command.name} ${command.usage}\``
                                    : `\`${prefix}${command.name}\``
                            )
                            .addField(
                                "DESCRIPTION:",
                                command.description.replace('tBucks', tBucks)
                                    ? command.description.replace('tBucks', tBucks)
                                    : "No description for this command."
                            )
                            .setFooter(
                                {
                                    text: `Requested by ${message.author.tag}`,
                                    iconURL: message.author.displayAvatarURL({ dynamic: true })
                                }
                            )
                            .setTimestamp()
                            .setColor("FFFF00");
                        return await message.reply({ embeds: [embed] });
                    } catch (err) {
                        console.log(err)
                    }
                }
            }
        })
    }
}