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

     boom(price) {
        let explosion = this.scene.add.sprite(this.x, this.y, "boom");
        explosion.setScale(0);
        explosion.setAlpha(1);
        this.scene.tweens.add({
            targets: explosion,
            scale: { from: 0, to: 2 },
            alpha: { from: 1, to: 0 },
            duration: 1000,
            onComplete: () => {
                explosion.destroy();
            }
        });

         let priceText = this.scene.add.text(this.x, this.y, price, { fontSize: '42px', fill: '#ffffff' });
         
         priceText.setOrigin(0.5);
         this.scene.tweens.add({
             targets: priceText,
             y: this.y + 150, // Adjust the vertical position as needed
             alpha: 0,
             duration: 1000,  // Duration of the text animation
             onComplete: () => {
                 priceText.destroy();  // Destroy the text object after the tween
             }
         });

         
        this.destroy();
    }

}
