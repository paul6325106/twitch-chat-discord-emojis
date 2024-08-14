import { Extra, MessageType } from "./chat";
import { DiscordEmojiMap } from "./discord";

export type TextFragment = {
    type: 'text'
    value: string
}

export type TwitchEmoteFragment = {
    id: string
    name: string
    type: 'twitch-emote'
}

export type DiscordEmoteFragment = {
    animated: boolean
    id: number
    name: string
    type: 'discord-emote'
}

export type Fragment = TextFragment | TwitchEmoteFragment | DiscordEmoteFragment;

export function parseMessage(type: MessageType, message: string, extra: Extra, discordEmojis: DiscordEmojiMap): Fragment[] {
    return parseDiscordEmotes(parseTwitchEmotes(type, message, extra), discordEmojis);
}

function parseTwitchEmotes(_type: MessageType, message: string, extra: Extra): Fragment[] {
    // TODO if type === 'cheer', sub out /(  |^)Cheer([0-9]+)(  |$)/

    // split the message into pieces
    const messageArray: (string | null | Fragment)[] = message.split('');

    // go through emote data
    Object.entries(extra.messageEmotes || {}).forEach(([emoteId, emoteInstances]) => {
        emoteInstances.forEach(emoteInstance => {
            const [startIndex, endIndex] = parseEmoteInstance(emoteInstance);

            // parse the emote name
            const emoteName = message.substring(startIndex, endIndex + 1);
            if (!emoteName) {
                return;
            }

            // add a twitch emote into the message array, where the emote name started
            messageArray[startIndex] = { type: "twitch-emote", id: emoteId, name: emoteName };

            // fill the rest of the space with placeholders, as to not change any indices
            for (let index = startIndex + 1; index <= endIndex; ++index) {
                messageArray[index] = null;
            }
        })
    });

    return combineArray(messageArray);
}

function parseEmoteInstance(emoteInstance: string): number[] {
    const [startIndex, endIndex] = emoteInstance.split('-');
    return [parseInt(startIndex), parseInt(endIndex)];
}

const regexDiscordEmoji = /:([0-9a-zA-Z-_]+):/g;

function parseDiscordEmotes(fragments: Fragment[], discordEmojis: DiscordEmojiMap): Fragment[] {
    const newFragments: Fragment[] = []

    fragments.forEach(fragment => {

        // only need to check text fragments
        if (fragment.type !== "text") {
            newFragments.push(fragment);
            return;
        }

        // split the fragment, like we did before
        const fragmentArray: (string | null | Fragment)[] = fragment.value.split('');

        // check for emote pattern, rather than iterate through a potentially huge set of emotes
        for (const match of fragment.value.matchAll(regexDiscordEmoji)) {
            const emojiName = match[1];

            // if successful match, insert with placeholders as before
            if (emojiName in discordEmojis) {
                fragmentArray[match.index] = { type: "discord-emote", ...discordEmojis[emojiName] };

                for (let index = match.index + 1; index <= match.index + match[0].length - 1; ++index) {
                    fragmentArray[index] = null;
                }
            }
        }

        newFragments.push(...combineArray(fragmentArray));
    })

    return newFragments;
}

function combineArray(array: any[]): Fragment[] {
    const fragments: Fragment[] = [];

    let buffer = '';

    array.forEach(part => {
        if (part === null) {
            return;

        } else if (typeof part === 'string') {
            buffer += part;

        } else {
            if (buffer) {
                fragments.push({ type: 'text', value: buffer });
                buffer = '';
            }

            fragments.push(part);
        }
    });

    if (buffer) {
        fragments.push({ type: 'text', value: buffer });
    }

    return fragments;
}
