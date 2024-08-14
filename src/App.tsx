import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid';

import './App.scss'

import { Overlay, MessageProps } from './overlay';
import { CHANNEL_NAME } from './environment';
import Chat from './chat';
import { parseMessage as parseFragments } from './parser';
import { fetchDiscordEmojis } from './discord';

const MAX_MESSAGES = 20;

function App() {
    const [messages, setMessages] = useState<MessageProps[]>([]);

    useEffect(() => {
        const chat = Chat(CHANNEL_NAME);

        fetchDiscordEmojis().then(discordEmojis => {
            chat.onMessage((type, user, message, self, bits, extra) => {
                const fragments = parseFragments(type, message, bits, extra, discordEmojis);
                const uuid = uuidv4();
                const newMessage = { type, user, message, self, bits, extra, fragments, uuid };
                setMessages(oldMessages => [...oldMessages.slice(1 - MAX_MESSAGES), newMessage]);
            });
        });

        chat.connect();

        return () => {
            chat.disconnect();
        }
    }, []);

    return <Overlay messages={messages} />;
}

export default App
