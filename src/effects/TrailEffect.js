// Based on https://labs.phaser.io/view.html?src=src\game%20objects\particle%20emitter\random%20tint.js

export class TrailEffect {
    constructor(scene, plane) {
        this.scene = scene;
        this.plane = plane;

        const hsv = Phaser.Display.Color.HSVColorWheel();

        const tint = hsv.map(entry => entry.color);

        const emitter = scene.add.particles(0, 0, 'plane', {
            speedX: 0,
            lifespan: 20000,
            angle: 90,
            tint,
            scale: { start: 0.05, end: 0 },
        });

        emitter.startFollow(plane);
    }
}
