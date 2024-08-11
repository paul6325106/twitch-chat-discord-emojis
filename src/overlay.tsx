import { Extra } from "./chat";
import { DiscordEmoteFragment, Fragment, TextFragment, TwitchEmoteFragment } from "./parser";

interface OverlayProps {
    messages: MessageProps[]
}

export interface MessageProps {
    extra: Extra
    fragments: Fragment[];
    uuid: string;
}

export function Overlay({ messages }: OverlayProps) {
    return (
        <div id='messages-container'>
            {messages.map(message => <Message key={message.uuid} {...message} />)}
        </div>
    )
}

function Message(props: MessageProps) {
    return (
        <div className='message'>
            <DisplayName {...props} />
            <Content {...props} />
        </div>
    )
}

function DisplayName({ extra }: MessageProps) {
    const { displayName, userColor } = extra;
    return <span className='displayName' style={{ color: userColor }}>{displayName}</span>;
}

function Content({ fragments }: MessageProps) {
    return (
        <span className='content'>
            {fragments.map(fragment => {
                switch (fragment.type) {
                    case 'discord-emote':
                        return <DiscordEmote {...fragment} />;
                    case 'text':
                        return <Text {...fragment} />;
                    case 'twitch-emote':
                        return <TwitchEmote {...fragment} />;
                }
            })}
        </span>
    )
}

function DiscordEmote({ animated, id, name }: DiscordEmoteFragment) {
    const format = animated ? 'gif': 'webp';
    const url = `https://cdn.discordapp.com/emojis/${id}.${format}?size=56&quality=lossless`
    return <img className='discord-emote' src={url} alt={name} />;
}

function Text({ value }: TextFragment) {
    return <span className='text'>{value}</span>;
}

function TwitchEmote({ id, name }: TwitchEmoteFragment) {
    const url = `https://static-cdn.jtvnw.net/emoticons/v2/${id}/default/light/2.0`;
    return <img className='twitch-emote' src={url} alt={name} />;
}
