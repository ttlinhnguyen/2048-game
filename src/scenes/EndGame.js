import GameScene from "../GameScene";
import { gameOptions } from "../commonSettings";

export default class EndGame extends GameScene {
    constructor() {
        super("EndGame");
    }

    create() {
        this.endTime = new Date();
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

        if (this.score === 11) {
            this.result.setText(`YOU WIN!`);
            this.recordLeaderboard(this.endTime - this.startTime);
        } else {
            this.result.setText(`GAME OVER!`);
        }

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
