"use strict";

import { ApplicationCommandOptionType, ApplicationCommandType, ChannelType, ChatInputCommandInteraction, PermissionsBitField } from "discord.js";
import Command from "../../utils/Command";
import { CachedGuildContext } from "../../utils/Context";

class Botinfo extends Command {
	constructor() {
		super({
			type: ApplicationCommandType.ChatInput,
			name: "setlogschannel",
			category: "utils",
			description: "Displays the bot informations.",
			options: [{
				type: ApplicationCommandOptionType.Channel,
				name: "channel",
				description: "Logs channel",
				required: true,
				channelTypes: [ChannelType.GuildText]
			}],
			userPerms: [PermissionsBitField.Flags.ManageGuild],
		});
	}

	async run(ctx: CachedGuildContext<ChatInputCommandInteraction<"cached">>) {

		const channel = ctx.args.getChannel("channel", true, [ChannelType.GuildText]);

		await ctx.updateGuildSettings({
			logs_channel: channel.id
		});

		await ctx.reply(`Logs channel set to ${channel}`);

	}
}

module.exports = new Botinfo();
