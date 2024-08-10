import ComfyJS, { Badges, EmoteSet } from "comfy.js";

interface Extra {
    channel: string;
    roomId: string;
    messageEmotes?: EmoteSet;
    userId: string;
    username: string;
    displayName: string;
    userColor: string;
    userBadges: Badges;
}

type MessageCallback = (
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

    ComfyJS.Init(channelName);

    ComfyJS.onChat = (user, message, _flags, self, extra) => {
        messageCallback && messageCallback(user, message, self, extra);
    }

    ComfyJS.onCheer = (user, message, _bits, _flags, extra) => {
        messageCallback && messageCallback(user, message, false, extra);
    }

    ComfyJS.onSub = (user, message, _subTierInfo, extra) => {
        messageCallback && messageCallback(user, message, false, extra);
    }

    const disconnect = () => {
        ComfyJS.Disconnect();
    }

    return {
        onMessage,
        disconnect,
    }
}
