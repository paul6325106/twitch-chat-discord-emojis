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
            messageCallback && messageCallback(type, user, message, self, extra);
        }

        ComfyJS.onCheer = (user, message, _bits, _flags, extra) => {
            messageCallback && messageCallback('cheer', user, message, false, extra);
        }

        ComfyJS.onSub = (user, message, _subTierInfo, extra) => {
            messageCallback && messageCallback('sub', user, message, false, extra);
        }

        ComfyJS.onResub = (user, message, _streamMonths, _cumulativeMonths, _subTierInfo, extra) => {
            messageCallback && messageCallback('resub', user, message, false, extra);
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
