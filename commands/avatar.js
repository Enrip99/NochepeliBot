module.exports = {
	name: 'avatar',
	description: 'Get a user\'s avatar',
	execute(message, args, client) {
		if (!args.length) {
			message.channel.send("https://cdn.discordapp.com/avatars/" + message.author.id + "/" + message.author.avatar + ".png?size=1024")
		}
		else {
			var col = message.mentions.users
			col.each(usr => message.channel.send("https://cdn.discordapp.com/avatars/" + usr.id + "/" + usr.avatar + ".png?size=1024"))
			}
		}
};
