import { gameOptions } from "../commonSettings.js";
import { Scene, Class } from "phaser";

var StartGame = new Class({
    Extends: Scene,
    initialize: function startGame() {
        Scene.call(this, { key: "StartGame" });
    },
    create: function () {
        this.music = this.sound.add("main_audio", { loop: true });
        this.music.play();
        this.add.image(450, 530, "startbg");
        this.startButton = this.add
            .image(450, 760, "startbtn")
            .setScale(0.7)
            .setInteractive();
        this.startButton.on(
            "pointerdown",
            function () {
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
            },
            this
        );
    },
});
export default StartGame;
