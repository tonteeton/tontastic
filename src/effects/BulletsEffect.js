export class BulletsEffect {
    constructor(scene, plane) {
        this.scene = scene;
        this.plane = plane;

        const emitter = scene.add.particles(0, 0, 'plane', {
            speed: 1000,
            lifespan: {
                onEmit: (particle, key, t, value) =>
                {
                    return Phaser.Math.Percent(plane.body.speed, 0, 300) * 2000;
                }
            },
            alpha: {
                onEmit: (particle, key, t, value) =>
                {
                    return Phaser.Math.Percent(plane.body.speed, 0, 300);
                }
            },
            angle: {
                onEmit: (particle, key, t, value) =>
                {
                    return (plane.angle - 90); // + Phaser.Math.Between(-10, 10);
                }
            },
            scale: { start: 0.01, end: 0 },
            blendMode: 'ADD'
        });

        emitter.startFollow(plane);
    }
}
