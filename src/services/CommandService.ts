"use strict";

import Bot from "../../main";
import { CommandInteraction } from "discord.js";
import { BaseContext, CachedGuildContext } from "../utils/Context";

class CommandService {
	client: Bot;
	constructor(client: Bot) {
		this.client = client;
	}

	async handle(interaction: CommandInteraction) {
		const command = this.client.commands.findCommand(interaction.commandName);

		if (!command) return;

		if (command.ownerOnly && !this.client.config.bot.ownersIDs.includes(interaction.user.id)) {
			return interaction.reply("You can't use this command, it's for my creator.");
		}

		let ctx;
		if (interaction.inCachedGuild()) {

			const guild = interaction.guild;
			const channelBotPerms = interaction.channel?.permissionsFor(guild.members.me);

			if (!guild.members.me.permissions.has("EmbedLinks") || !channelBotPerms.has("EmbedLinks"))
				return interaction.reply("The bot must have the `EMBED_LINKS` permissions to work properly !");
	
			// Si le bot manques de permissions
			if (
				command.botPerms.length > 0 &&
				!command.botPerms.every(p => guild.members.me.permissions.has(p) && channelBotPerms.has(p))
			) {
				return interaction.reply(
					`The bot must have \`${command.botPerms.join("`, `")}\` permissions to execute this command.`
				);
			}
	
			// Si la commande est désactivée
			if (command.disabled && !this.client.config.bot.ownersIDs.includes(interaction.user.id)) {
				return interaction.reply("Sorry but this command is temporarly disabled.");
			}

			ctx = new CachedGuildContext(this.client, interaction);


		} else {
			ctx = new BaseContext(this.client, interaction);
		}

		this.client.logger.info(
			`Command ${command.name} executed by ${ctx.author.username}`
		);
		await command.run(ctx).catch(error => {
			if (interaction.replied || interaction.deferred) {
				interaction.editReply("Sorry but, an error occured.");
			} else {
				interaction.reply("Sorry but, an error occured.");
			}
			this.client.logger.error(error);
		});
	}
}

export default CommandService;
