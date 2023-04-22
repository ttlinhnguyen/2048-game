import { gameOptions } from "./commonSettings.js";
import highestScores from "./highestScore.js";
import { score } from "./PlayGame.js";
var EndGame = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize:
        function endGame() {
            Phaser.Scene.call(this, { key: "EndGame" });
        },
    create: function () {
        this.result = this.add.text(gameOptions.tileSize * 2 - 90, gameOptions.tileSize * 2 - 100, "", { color: "#000", fontSize: "30px", fontFamily: 'font1', align: 'center' })
        this.result.setText(`GAME OVER!\n\nScore: ${score}`)


        highestScores(score);

        this.restartButton = this.add.image(gameOptions.tileSize * 2 + 50, gameOptions.tileSize * 2 + 200, "restart").setInteractive();
        this.restartButton.on("pointerdown", function (pointer) {
            this.tweens.add({
                targets: [this.restartButton],
                scaleX: 1.05,
                scaleY: 1.05,
                duration: gameOptions.tweenSpeed,
                yoyo: true,
                repeat: 1,
                onComplete: function (tween) {
                    tween.parent.scene.scene.start("PlayGame")
                    }
            });
        }, this);
    }
});

export default EndGame;