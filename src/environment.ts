export const CHANNEL_NAME = import.meta.env.VITE_CHANNEL_NAME;
if (!CHANNEL_NAME) {
    throw `Unvalid channel name: ${CHANNEL_NAME}`;
}

export const DISCORD_TOKEN = import.meta.env.VITE_DISCORD_TOKEN;
if (!DISCORD_TOKEN) {
    throw `Unvalid Discord token: ${DISCORD_TOKEN}`;
}

export const DISCORD_GUILD_ID = import.meta.env.VITE_DISCORD_GUILD_ID;
if (!DISCORD_GUILD_ID) {
    throw `Unvalid Discord token: ${DISCORD_GUILD_ID}`;
}
