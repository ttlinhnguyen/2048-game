import { Scene } from "phaser";
import { gameOptions } from "../commonSettings";
import score from "../score";

var musicStatus = true;
export default class GameManager extends Scene {
    constructor() {
        super();
    }

    create() {
        this.add.image(450, 990, "nav");
        this.add.image(170, 990, "score");
        this.musicOn = this.add.image(500, 990, "musicon").setInteractive();
        this.musicOff = this.add.image(500, 990, "musicoff").setInteractive();
        this.restartSmall = this.add
            .image(800, 990, "restart-small")
            .setInteractive();
        this.leaderboard = this.add
            .image(650, 990, "leaderboard")
            .setInteractive();
        this.closeButton = this.add.image(650, 990, "close").setInteractive();
        this.closeButton.visible = false;
        this.restartSmall.on("pointerdown", this.restart, this);
        if (musicStatus) {
            this.musicOff.visible = false;
        } else {
            this.musicOn.visible = false;
        }
        this.musicOn.on(
            "pointerdown",
            function () {
                this.sound.mute = true;
                this.musicOff.visible = true;
                this.musicOn.visible = false;
                musicStatus = false;
            },
            this
        );
        this.musicOff.on(
            "pointerdown",
            function () {
                this.sound.mute = false;
                this.musicOn.visible = true;
                this.musicOff.visible = false;
                musicStatus = true;
            },
            this
        );

        this.storage = localStorage;
        this.leaderboard.on("pointerdown", this.showLeaderboard, this);

        this.closeButton.on(
            "pointerdown",
            function () {
                this.leaderboard.visible = true;
                this.closeButton.visible = false;

                this.scoreboard.destroy();
                this.leaderResults.destroy();
                this.leaderLabel.destroy();
            },
            this
        );

        this.gameOver = false;
        this.add.text(120, gameOptions.tileSize * 4 + 20 * 7, "SCORE", {
            color: "#ef4966",
            fontSize: "20px",
            fontFamily: "font1",
        });
        this.scoreText = this.add.text(
            150,
            gameOptions.tileSize * 4 + 20 * 9,
            `${score}`,
            {
                color: "#ef4966",
                fontSize: "50px",
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
        this.leaderResults.appendText(`1st. ${this.storage.getItem("1st")}\n`);
        this.leaderResults.appendText(`2nd. ${this.storage.getItem("2nd")}\n`);
        this.leaderResults.appendText(`3rd. ${this.storage.getItem("3rd")}\n`);
        this.leaderResults.appendText(`4th. ${this.storage.getItem("4th")}\n`);
        this.leaderResults.appendText(`5th. ${this.storage.getItem("5th")}\n`);
    }

    restart() {
        throw new Error("Unimplemented");
    }
}
