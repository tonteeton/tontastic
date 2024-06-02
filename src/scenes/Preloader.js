import { Scene } from 'phaser';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(512, 384, 'background');


        let bgColor;
        if (typeof Telegram.WebApp.themeParams.bg_color !== 'undefined') {
            bgColor = Telegram.WebApp.themeParams.secondary_bg_color;
        } else {
            bgColor = '0xffffff';
        }

        

        //  A simple progress bar. This is the outline of the bar.
        let barY = 600;
        this.add.rectangle(512, barY, 468, 32).setStrokeStyle(1, bgColor);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(512-230, barY, 4, 28, bgColor);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);

        });
    }

    preload ()
    {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath("assets");
        this.load.image("plane", "plane.webp");
        this.load.image("space", "space.webp");
        this.load.image("space02", "space02.webp");
        this.load.image("balloon", "balloon.webp");
        this.load.image("boom", "tontastic_nobg.webp");
    }

    create ()
    {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('MainScene');
    }
}
