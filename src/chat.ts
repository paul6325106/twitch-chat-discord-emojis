import ComfyJS, { OnCheerExtra, OnCheerFlags, OnMessageExtra, OnMessageFlags, OnSubExtra, SubMethods } from "comfy.js";

type ChatCallback = (
    user: string,
    message: string,
    flags: OnMessageFlags,
    self: boolean,
    extra: OnMessageExtra
) => void;

type CheerCallback = (
    user: string,
    message: string,
    bits: number,
    flags: OnCheerFlags,
    extra: OnCheerExtra,
) => void;

type SubCallback = (
    user: string,
    message: string,
    subTierInfo: SubMethods,
    extra: OnSubExtra,
) => void;

export default function Chat(channelName: string) {
    let chatCallback: ChatCallback | null = null;
    const onChat = (callback: ChatCallback) => {
        chatCallback = callback;
    }

    let cheerCallback: CheerCallback | null = null;
    const onCheer = (callback: CheerCallback) => {
        cheerCallback = callback;
    }

    let subCallback: SubCallback | null = null;
    const onSub = (callback: SubCallback) => {
        subCallback = callback;
    }

    ComfyJS.Init(channelName);

    ComfyJS.onChat = (user, message, flags, self, extra) => {
        chatCallback && chatCallback(user, message, flags, self, extra);
    }

    ComfyJS.onCheer = (user, message, bits, flags, extra) => {
        cheerCallback && cheerCallback(user, message, bits, flags, extra);
    }

    ComfyJS.onSub = (user, message, subTierInfo, extra) => {
        subCallback && subCallback(user, message, subTierInfo, extra);
    }

    return {
        onChat,
        onCheer,
        onSub,
    }
}
