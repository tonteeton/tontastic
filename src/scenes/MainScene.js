import { Scene } from "phaser";
import { PriceFetcher } from "../PriceFetcher";

let debugText;

let prices;
let priceData;
let pointsCounter = 0;

export class MainScene extends Scene
{
    constructor ()
    {
        super("MainScene");
    }

    preload ()
    {

    }

    create() {
        debugText = this.add.text(10, 10, '', { fontSize: '16px', fill: '#ffffff' });
        debugText.setScrollFactor(0);
        this.setupEvents()

        prices = new PriceFetcher({emitter: this.emitter});
        prices.connect();
    }

    update() {
        debugText.setText([
            `Price: ${priceData?.price}`,
            `Points counter: ${pointsCounter}` 
        ]);
    }

    setupEvents() {
        let emitter = this.emitter = new Phaser.Events.EventEmitter();
        emitter.on("PRICE", this.priceHandler.bind(this));
    }

    priceHandler(data) {
        if (priceData != undefined && priceData.ts > data.ts) {
            return;
        }
        // if (pointsCounter > 5) {
        //     return;
        // }
        priceData = data;
        pointsCounter += 1;
    }

}
