import GameScene from "../GameScene";
import { gameOptions } from "../commonSettings";

export default class Preloader extends GameScene {
    constructor() {
        super("Preloader");
    }

    preload() {
        loadingBar(this);
        this.load.spritesheet("tiles", "assets/sprites/tiles-2.png", {
            frameWidth: gameOptions.tileSize,
            frameHeight: gameOptions.tileSize,
        });
        this.load.audio("main_audio", "assets/audio.mp3");
        this.load.image("startbg", "assets/startscene.png");
        this.load.image("startbtn", "assets/icons/tiles_start.png");
        this.load.audio("plop", "assets/plop.mp3");
        this.load.image("nav", "assets/icons/tiles_nav.png");
        this.load.image("musicon", "assets/icons/tiles_musicon.png");
        this.load.image("musicoff", "assets/icons/tiles_musicoff.png");
        this.load.image("restart-small", "assets/icons/tiles_restart-18.png");
        this.load.image("score", "assets/icons/tiles_score.png");
        this.load.image("leaderboard", "assets/icons/tiles_leaderboard.png");
        this.load.image("scoreboard", "assets/icons/tiles_highest score.png");
        this.load.image("close", "assets/icons/tiles_close.png");
        this.load.image("restart", "assets/restart_restart.png");
    }
    create() {
        this.scene.start("StartGame");
        if (!localStorage.getItem("leaderboard")) {
            localStorage.setItem("leaderboard", JSON.stringify([0, 0, 0, 0, 0]));
        }
    }
}

var loadingBar = function (game) {
    var width = game.cameras.main.width;
    var height = game.cameras.main.height;
    var progressBar = game.add.graphics();
    var progressBox = game.add.graphics();
    progressBox.fillStyle(0xef4996, 0.8);
    progressBox.fillRect(width / 2 - 165, (height / 3) * 2, 320, 50);

    var loadingText = game.make.text({
        x: width / 2,
        y: height / 2 - 50,
        text: "Loading...",
        style: { color: "#ef4966", fontSize: "20px", fontFamily: "font1" },
    });
    loadingText.setOrigin(0.5, 0.5);

    var percentText = game.make.text({
        x: width / 2,
        y: height / 2 - 5,
        text: "0%",
        style: { color: "#ef4966", fontSize: "20px", fontFamily: "font1" },
    });
    percentText.setOrigin(0.5, 0.5);

    var assetText = game.make.text({
        x: width / 2,
        y: height / 2 + 50,
        text: "",
        style: { color: "#ef4966", fontSize: "20px", fontFamily: "font1" },
    });

    assetText.setOrigin(0.5, 0.5);

    game.load.on("progress", function (value) {
        percentText.setText(parseInt(value * 100) + "%");
        progressBar.clear();
        progressBar.fillStyle(0x000000, 1);
        progressBar.fillRect(
            width / 2 - 165 + 10,
            (height / 3) * 2 + 10,
            300 * value,
            30
        );
    });

    game.load.on("fileprogress", function (file) {
        assetText.setText("Loading asset: " + file.key);
    });

    game.load.on("complete", function () {
        progressBar.destroy();
        progressBox.destroy();
        loadingText.destroy();
        percentText.destroy();
        assetText.destroy();
    });
};
// export default Preloader;
