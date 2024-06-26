export class Background {

    constructor(scene, config) {
        this.scene = scene;

        let bg_name = "space02";
        let transparent_name = "space";
        if (config.isDarkMode) {
            bg_name = "space";
            transparent_name = "space02";
        }
        
        let bg = this.bg = scene.add.tileSprite(0, 0, scene.sys.game.config.width * 2, scene.sys.game.config.height * 2, bg_name);
        bg.setScrollFactor(0);
        bg.setAlpha(1);
;
        let transparent = scene.add.tileSprite(900, 0, scene.sys.game.config.width * 2, scene.sys.game.config.height * 4, transparent_name);
        transparent.setScrollFactor(0);
        transparent.setDepth(10000);
        transparent.setAlpha(0.1);
        this.bg2 = transparent;
    }

    update(deltaX, deltaY) {
        this.bg.tilePositionX += deltaX;
        this.bg.tilePositionY += deltaY;

        this.bg2.tilePositionX += deltaY * 2;
        this.bg2.tilePositionY += deltaY * 2;
    }

}
