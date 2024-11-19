"use strict";

import {
	CommandInteraction,
	ShardClientUtil,
	User,
	InteractionReplyOptions,
	MessagePayload,
	InteractionDeferReplyOptions,
	WebhookFetchMessageOptions} from "discord.js";
import Bot from "../../main";
import { Guild, Prisma } from "@prisma/client";
import prisma from "./PrismaClient";

/*
Ca va paraitre énervent au début mais c'est super utile ! Au lieu de faire à chaque fois dans vos commandes
Au lieu de message, ou client ca sera -> ctx.message ou ctx.client
Avantages:
Au lieu de faire message.guild.members.cache.get(message.author.id); dans vos commandes
ctx.member; utile non ?
remplacer aussi ctx.message.channel.send() par ctx.send(); !
*/
/*class Context {
	interaction: CommandInteraction;
	client: Bot;
	args: CommandInteractionOptionResolver;
	lang: string;

	constructor(client: Bot, interaction: CommandInteraction) {
		this.interaction = interaction;
		this.client = client;
		this.args = (
			interaction instanceof CommandInteraction ? interaction.options : null
		) as CommandInteractionOptionResolver;
		this.lang = client.config.mainLang;
	}
	get shards(): ShardClientUtil {
		if (!this.client?.shard) throw new Error("Shard non trouvable");
		return this.client.shard;
	}

	get guild(): Guild {
		if (!this.interaction.guild) throw new Error("Not a guild");
		return this.interaction.guild;
	}

	get channel(): TextBasedChannel {
		if (this.interaction.channel.isTextBased()) throw new Error("Not a text channel");
		return this.interaction.channel;
	}

	get author(): User {
		return this.interaction.user;
	}

	get member(): GuildMember {
		return this.interaction.member instanceof GuildMember
			? this.interaction.member
			: this.guild.members.cache.get(this.interaction.member.user.id);
	}

	get me(): GuildMember {
		return this.guild.members.me;
	}

	reply(content: string | MessagePayload | InteractionReplyOptions) {
		return this.interaction.reply(content); // for embed or file or simple message
	}

	deferReply(options?: InteractionDeferReplyOptions) {
		this.interaction.deferReply(options);
	}

	followUp(content: string | MessagePayload | InteractionReplyOptions) {
		return this.interaction.followUp(content);
	}

	editReply(content: string | MessagePayload | WebhookFetchMessageOptions) {
		return this.interaction.editReply(content);
	}

	deleteReply(): Promise<void> {
		return this.interaction.deleteReply();
	}
}*/

export class BaseContext<Interaction extends CommandInteraction = CommandInteraction> {
	interaction: Interaction;
	client: Bot;
	lang: string;

	constructor(client: Bot, interaction: Interaction) {
		this.interaction = interaction;
		this.client = client;
		this.lang = interaction.locale;
	}
	get shards(): ShardClientUtil {
		if (!this.client?.shard) throw new Error("Shard non trouvable");
		return this.client.shard;
	}

	get author(): User {
		return this.interaction.user;
	}
	
	get args(): Interaction["options"] {
		return this.interaction.options;
	}

	reply(content: string | MessagePayload | InteractionReplyOptions) {
		return this.interaction.reply(content); // for embed or file or simple message
	}

	deferReply(options?: InteractionDeferReplyOptions) {
		this.interaction.deferReply(options);
	}

	followUp(content: string | MessagePayload | InteractionReplyOptions) {
		return this.interaction.followUp(content);
	}

	editReply(content: string | MessagePayload | WebhookFetchMessageOptions) {
		return this.interaction.editReply(content);
	}

	deleteReply(): Promise<void> {
		return this.interaction.deleteReply();
	}

	translate(key: string) {
		return key; // To implement
	}
}

// Put your database stuff here like guild settings
export class CachedGuildContext<Interaction extends CommandInteraction<"cached">> extends BaseContext<Interaction> {
	guildSettings: Guild;
	constructor(client: Bot, interaction: Interaction, guildSettings: Guild) {
		super(client, interaction);
		this.guildSettings = guildSettings;
	}

	get guild() {
		return this.interaction.guild;
	}

	get me() {
		return this.guild.members.me;
	}

	get member() {
		return this.interaction.member;
	}

	get channel() {
		return this.interaction.channel;
	}

	async updateGuildSettings(data: Prisma.GuildUpdateInput) {
		this.guildSettings = await prisma.guild.update({
			where: { id: this.guild.id },
			data
		});
	}
}
