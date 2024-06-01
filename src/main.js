// Initialize TWA
window.Telegram.WebApp.ready();
window.Telegram.WebApp.expand();
Telegram.WebApp.setHeaderColor("secondary_bg_color");

import { Boot } from './scenes/Boot';
import { MainScene } from './scenes/MainScene';
import { Preloader } from './scenes/Preloader';

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig

const factor = 2;
var w = 450 * factor;
var h = 800 * factor;


let bgColor;
if (typeof Telegram.WebApp.themeParams.bg_color !== 'undefined') {
     bgColor = Telegram.WebApp.themeParams.bg_color;
} else {
    bgColor = '#00';
}

const config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',
    backgroundColor: bgColor,
    type: Phaser.WEBGL,
    powerPreference:"high-performance",
    // transparent: true,
    physics: {
        default: "arcade",
        arcade: {
            fps: 60,
            debug: false,
        }
    },        
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: w,
        height: h,
    },
    scene: [
        Boot,
        Preloader,
        MainScene,
    ]
};

export default new Phaser.Game(config);
