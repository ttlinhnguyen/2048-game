import { gameOptions } from "../commonSettings";
import GameScene from "../GameScene";

export default class GameManager extends GameScene {
    constructor(key) {
        super(key);
        this.musicStatus = true;
    }

    create() {
        this.initializeVariables();
        this.initializeImages();
        this.initializeEventListeners();
        this.initializeTexts();
    }

    initializeVariables() {
        this.score = 0;
        this.storage = localStorage;
        this.gameOver = false;
    }

    initializeImages() {
        let y = 990;

        this.add.image(450, y, "nav");
        this.add.image(170, y, "score");
        this.musicOn = this.add
            .image(500, y, "musicon")
            .setInteractive()
            .setVisible(this.musicStatus);
        this.musicOff = this.add
            .image(500, y, "musicoff")
            .setInteractive()
            .setVisible(!this.musicStatus);
        this.restartSmall = this.add
            .image(800, y, "restart-small")
            .setInteractive();
        this.leaderboard = this.add
            .image(650, y, "leaderboard")
            .setInteractive();
        this.closeButton = this.add
            .image(650, y, "close")
            .setInteractive()
            .setVisible(false);
    }

    initializeEventListeners() {
        this.restartSmall.on("pointerdown", this.restart, this);
        this.musicOn.on("pointerdown", this.turnMusicOn, this);
        this.musicOff.on("pointerdown", () => this.turnMusicOn(false), this);
        this.leaderboard.on("pointerdown", this.showLeaderboard, this);
        this.closeButton.on("pointerdown", this.closeLeaderboard, this);
    }

    initializeTexts() {
        this.add.text(120, gameOptions.tileSize * 4 + 20 * 7, "SCORE", {
            color: "#ef4966",
            fontSize: "20px",
            fontFamily: "font1",
        });
        this.scoreText = this.add.text(
            100,
            gameOptions.tileSize * 4 + 20 * 9,
            `${this.score}`,
            {
                color: "#ef4966",
                fontSize: "30px",
                fontFamily: "font1",
                align: "justify",
            }
        );
    }

    showLeaderboard() {
        let textStyle = {
            color: "#ef4966",
            fontSize: "40px",
            fontFamily: "font1",
        };

        this.closeButton.visible = true;
        this.leaderboard.visible = false;
        this.scoreboard = this.add.image(450, 450, "scoreboard");
        this.leaderLabel = this.add.text(200, 150, "HIGHEST SCORE", textStyle);
        this.leaderResults = this.add.text(200, 250, "", textStyle);

        let scores = this.storage.getItem("leaderboard");
        scores = scores ? JSON.parse(scores) : [];
        for (let i = 0; i < 5; i++) {
            if (scores[i]) {
                let minutes = Math.floor(scores[i] / 60000);
                let seconds = ((scores[i] % 60000) / 1000).toFixed(0);
                this.leaderResults.appendText(
                    `${i + 1}. ${minutes}m${seconds}s`
                );
            } else {
                this.leaderResults.appendText(`${i + 1}. ${null}`);
            }
        }
    }

    closeLeaderboard() {
        this.leaderboard.visible = true;
        this.closeButton.visible = false;

        this.scoreboard.destroy();
        this.leaderResults.destroy();
        this.leaderLabel.destroy();
    }

    restart() {
        throw new Error("Unimplemented");
    }

    turnMusicOn(on = true) {
        this.sound.mute = on;
        this.musicOff.visible = on;
        this.musicOn.visible = !on;
        this.musicStatus = !on;
    }
}
