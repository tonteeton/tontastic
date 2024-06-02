# TONtastic!

*TONtastic!* is a project built for the [ETH Belgrade Hackathon](https://ethbelgrade.rs/hackathon),
showcasing the integration with the [TonTeeTon](https://github.com/tonteeton/tonteeton) oracle.

![tma](docs/tma.png)
![bot](docs/bot.png)
![contract](docs/contract.png)

*TONtastic!* is an attempt to create a gamified quiz,
with a Telegram app that allows users to predict if TON's price will increase or decrease daily,
awarding correct predictions with Jettons.
It's designed to drive engagement, rewarding users without requiring them to stake anything.

The Telegram bot is available at https://t.me/TONtasticBot .

## Content

### Quiz contract

The [Contract](contracts/contract.tact) allows the owner to start a new quiz,
and users to make a vote and claim a reward.
On completion, the TonTeeTon `get-simple-price` contract is called to request the 24h price change.

### Telegram bot

The [Bot](bot/) utilizes [TON Connect](https://docs.ton.org/develop/dapps/ton-connect/overview) to
allow users to make votes via an existing Telegram wallet.

### Telegram Mini App
The [TMA](src/) was created to allow users to monitor the current TON price change.


## Templates used

- [Phaser Webpack Template](https://github.com/phaserjs/template-webpack/)
- [Telegram Mini Apps Basic Example](https://github.com/telegram-mini-apps-dev/vanilla-js-boilerplate/tree/master)
- [aiogram TON Connect UI example](https://github.com/nessshon/aiogram-tonconnect/tree/main/aiogram_tonconnect)

## Development Setup

1. Clone the repository
```bash
git clone https://github.com/tonteeton/tontastic.git
```

2. Start the dev server
```bash
docker-compose up
```
