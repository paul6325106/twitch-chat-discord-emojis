# twitch-chat-discord-emojis

Simple Twitch chat overlay that pulls emojis from Discord and allows viewers to use them in chat.
Also, it displays messages coming through cheers, subs, and regular chat.

## How does this work?

On launch, a single request is made to `https://discordapp.com/api/v6/guilds/${DISCORD_GUILD_ID}`.
This retrieves any emotes for that Discord Guild that the associated user has access to.
The Discord token is not used for anything else.

## Building

* Install [Node.js](https://nodejs.org/en). I used v20.12.2, but LTS is probably fine.
* Get a Discord token, google how to do it.
* Get the Discord Guild ID, open the Discord in your browser and look for a url like `https://discord.com/channels/1234567890123456789`. That first number in the url is your Guild ID.
* Get your channel name, you should be able to figure it out on your own.
* Set values in `.env`.
* Install dependencies with `npm install`.
* Compile with `npm run build`.

This produces a single HTML file: `dist/index.html`.
Don't give this file out to other people, it contains your Discord token in plaintext. Can't be helped.

## Using the overlay

Set `dist/index.html` as a local file in a Browser Source in OBS.

## Customising

You can inject custom CSS into your Browser Source in OBS.

This is how the markup looks:

```html
<div id="message-container">
    <div class="message normal voodoocowboy">
        <span class="badges">
            <img class="badge" src="..." alt="">
        </span>
        <span class="displayName" style="color: SomeColour">VoodooCowboy</span>
        <span class="text">words words words</span>
        <img class="twitch-emote" src="..." alt="sometwitchemote" />
        <img class="discord-emote" src="..." alt="somediscordemote" />
    </div>
</div>
```

### Message classes

Messages can have the following classes, allow you to add extra styling conditionally.

* The account name: e.g. `voodoocowboy`
* The message type: `normal`, `highlighted`, `cheer`, `sub`, `resub`

### Examples

#### Overriding colours

```css
.displayName {
    color: blue !important;
}

.text {
    color: red;
}
```

#### Changing fonts

```css
.message {
    font-family: "Comic Sans MS", "Comic Sans", cursive !important;
}
```

#### Adding an animation to hide messages after a delay

```css
@keyframes hide {
    from {
        opacity: 1;
    }
    to {
        opacity: 0;
    }
}

.message {
    animation-name: hide;
    animation-delay: 10s;
    animation-duration: 1s;
    animation-fill-mode: forwards;
}
```

#### Hiding badges

```css
.badges {
    display: none;
}
```

#### User specific formatting

```css
.voodoocowboy {
    background-color: rgba(177, 231, 111, 0.5);
    border-radius: 25px;
}
```
