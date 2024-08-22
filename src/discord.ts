import { DISCORD_GUILD_ID, DISCORD_TOKEN } from "./environment";

export type DiscordEmoji = {
    animated: boolean
    id: number
    name: string
}

export type DiscordEmojiMap = {
    [name: string]: DiscordEmoji
}

interface DiscordData {
    emojis: [
        {
            animated: boolean,
            available: boolean,
            id: number,
            name: string,
        }
    ]
}

export async function fetchDiscordEmojis(): Promise<DiscordEmojiMap> {
    const emojis: DiscordEmojiMap = {};

    const url = `https://discordapp.com/api/v6/guilds/${DISCORD_GUILD_ID}`

    const response = await fetch(url, {
        headers: {
            Authorization: DISCORD_TOKEN
        }
    });

    const data: DiscordData = await response.json();

    data.emojis.forEach(emoji => {
        if (emoji.available) {
            const name = emoji.name;
            emojis[name.toLowerCase()] = {
                animated: emoji.animated,
                id: emoji.id,
                name,
            };
        }
    });

    return emojis;
}
