import { gameOptions } from "../commonSettings";
import highestScores from "../highestScore";
import { Scene } from "phaser";

export default class EndGame extends Scene {
    constructor() {
        super();
        Scene.call(this, { key: "EndGame" });
    }

    create() {
        let score = this.registry.get("score");
        this.result = this.add.text(
            gameOptions.tileSize * 2 - 90,
            gameOptions.tileSize * 2 - 100,
            "",
            {
                color: "#000",
                fontSize: "30px",
                fontFamily: "font1",
                align: "center",
            }
        );
        this.result.setText(`GAME OVER!\n\nScore: ${score}`);

        highestScores(score);

        this.restartButton = this.add
            .image(
                gameOptions.tileSize * 2 + 50,
                gameOptions.tileSize * 2 + 200,
                "restart"
            )
            .setInteractive();
        this.restartButton.on("pointerdown", this.restart, this);
    }

    restart() {
        this.tweens.add({
            targets: [this.restartButton],
            scaleX: 1.05,
            scaleY: 1.05,
            duration: gameOptions.tweenSpeed,
            yoyo: true,
            repeat: 1,
            onComplete: function (tween) {
                tween.parent.scene.scene.start("PlayGame");
            },
        });
    }
}
