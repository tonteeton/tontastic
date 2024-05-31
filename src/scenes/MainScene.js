import { Scene } from "phaser";

let debugText;

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
    }

    update() {
        debugText.setText([
            `Main scene Loaded`,
        ]);
    }

}
