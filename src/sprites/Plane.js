export class Plane extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, config) {
        super(scene, x, y, "plane");
        scene.physics.add.sprite(x, y, 'plane');

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.displayWidth = config.width;        
        this.displayHeight = config.height;
        this.setDepth(config.depth);
    }

    rotateToVelocity() {
        const velocityAngle = Math.atan2(this.body.velocity.y, this.body.velocity.x);
        // Convert velocity angle from radians to degrees
        const velocityAngleDegrees = Phaser.Math.RadToDeg(velocityAngle);
        // Set the rotation of the this to match the velocity angle
        this.rotation = Phaser.Math.DegToRad(velocityAngleDegrees + 90);
    }

}
