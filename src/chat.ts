import ComfyJS, { Badges, EmoteSet } from "comfy.js";

export interface Extra {
    channel: string;
    roomId: string;
    messageEmotes?: EmoteSet;
    userId: string;
    username: string;
    displayName: string;
    userColor: string;
    userBadges: Badges;
}

export type MessageType =
    | 'normal'
    | 'highlighted'
    | 'cheer'
    | 'sub'
    | 'resub';

type MessageCallback = (
    type: MessageType,
    user: string,
    message: string,
    self: boolean,
    bits: number,
    extra: Extra,
) => void;

export default function Chat(channelName: string) {
    let messageCallback: MessageCallback | null = null;
    const onMessage = (callback: MessageCallback) => {
        messageCallback = callback;
    }

    const connect = () => {
        ComfyJS.Init(channelName);

        ComfyJS.onChat = (user, message, flags, self, extra) => {
            const type = flags.highlighted ? 'highlighted' : 'normal';
            messageCallback && messageCallback(type, user, message, self, 0, extra);
        }

        ComfyJS.onCheer = (user, message, bits, _flags, extra) => {
            messageCallback && messageCallback('cheer', user, message, false, bits, extra);
        }

        ComfyJS.onSub = (user, message, _subTierInfo, extra) => {
            if (message) {
                messageCallback && messageCallback('sub', user, message, false, 0, extra);
            }
        }

        ComfyJS.onResub = (user, message, _streamMonths, _cumulativeMonths, _subTierInfo, extra) => {
            if (message) {
                messageCallback && messageCallback('resub', user, message, false, 0, extra);
            }
        }
    }

    const disconnect = () => {
        ComfyJS.Disconnect();
    }

    return {
        onMessage,
        connect,
        disconnect,
    }
}
