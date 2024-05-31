// Bybit prices fetcher.
//
// See Bybit API docs:
//  - https://github.com/tiagosiebler/bybit-api/blob/master/examples/ws-public-v5.ts
//  - https://bybit-exchange.github.io/docs/v5/ws/connect
const { WebsocketClient } = require('bybit-api');
const Random = Phaser.Math.Between;

export class PriceFetcher {
  
    constructor(config) {
        this.emitter = config.emitter;
        this.socket = new WebsocketClient({
            market: 'v5',
            testnet: false,
        });
        this.subscriptionConfig = [
            'tickers.TONUSDT', 'spot'
        ];

        this.socket.on('update', this.onUpdate.bind(this));       
    }

    connect() {
        if (this.socket !== undefined) {
            console.log("connect price ...");
            this.socket.subscribeV5(...this.subscriptionConfig);
        }
    }

    disconnect() {
        this.socket.unsubscribeV5(...this.subscriptionConfig);
    }

    onUpdate(data) {
        this.emitter.emit("PRICE", {
            ts: data["ts"],
            date: new Date(data["ts"]),
            price: parseFloat(data["data"]["lastPrice"]),
        });
    }

}

export class PriceFetcherMock {

    constructor(config) {
        this.scene = config.scene;
        this.emitter = config.emitter;
    }

    connect() {
        this.onUpdate()
    }

    onUpdate() {
        const dt = new Date();
        const p0 = 5;
        const p1 = 7;
        this.emitter.emit("PRICE", {
            ts: dt.getTime(),
            date: dt,
            price: parseFloat(
                (Math.random() * (p0 - p1) + p1).toFixed(4)
            ),
        });        
        
        this.scene.time.delayedCall(
            1000,
            this.onUpdate.bind(this)
        );
    }
}
