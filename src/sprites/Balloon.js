const initialVelocityY = 2000;
const initialDestinationY = 700;

export class Balloon extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, config) {
        super(scene, x, y, "balloon");
        this.scene = scene;
        this.emitter = scene.emitter;
        this.isPlaced = false;
        const centerY = config.centerY;
        this.displayHeight = config.height;
        this.displayWidth = config.width;

        scene.add.existing(this);
        scene.physics.add.existing(this);
        //scene.physics.world.enableBody(this);

        this.setVelocity(0, -(initialVelocityY));

        this.stopHeight = centerY - initialDestinationY;
        //this.setInteractive();
        this.setCollideWorldBounds(true);
    }

    update() {
        if (!this.isPlaced && this.y <= this.stopHeight) {
            this.isPlaced = true;
            this.setVelocity(0, 0);
            this.setPosition(this.x, this.stopHeight);
            //this.setCollideWorldBounds(true);
            this.emitter.emit("BALLOON", this);
        } else if (!this.isPlaced) {
            this.setVelocity(0, -(initialVelocityY));
        }
    }

}
