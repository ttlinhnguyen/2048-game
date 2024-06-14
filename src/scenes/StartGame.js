import GameScene from "../GameScene.js";
import { gameOptions } from "../commonSettings.js";

export default class StartGame extends GameScene {
    constructor() {
        super("StartGame");
    }

    create() {
        this.music = this.sound.add("main_audio", { loop: true });
        this.music.play();
        this.add.image(450, 530, "startbg");
        this.startButton = this.add
            .image(450, 760, "startbtn")
            .setScale(0.7)
            .setInteractive();
        this.startButton.on("pointerdown", this.onStartButtonClick, this);
    }

    onStartButtonClick() {
        this.tweens.add({
            targets: [this.startButton],
            scaleX: 1.005,
            scaleY: 1.005,
            duration: gameOptions.tweenSpeed,
            yoyo: true,
            repeat: 1,
            onComplete: function (tween) {
                tween.parent.scene.scene.start("PlayGame");
            },
        });
    }
}
