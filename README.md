# DespachoBot-Discord

Discord bot that upon command, takes a picture through a webcam and sends it through that same channel and lets you set up a timetable for shared spaces. It also includes miscelaneous response commands.

## SETUP

Run `sudo ./init.sh` on your terminal.

Edit the `config.json` file and fill in all camps with the required id's.
 - `owner1` and `owner2` are the id's of the users that will be able to shut down the bot via the `shut off` command.
 - `token` is your bot's token. You can obtain it in the [Discord developer portal](https://discord.com/developers/).
 - `channelid` is the id of the channel where you'll be runing the bot. To avoid cluttering chats, the bot will only work in one channel.
Once you've filled everything, copy the `config.json` and `lista.json` files inside the `data` directory (if it doesn't exist, create one).

You can now run the bot by entering `launch.sh` in your terminal.

`https://github.com/Enrip99/NochepeliBot`
