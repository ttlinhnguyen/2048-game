import { gameOptions } from "./commonSettings.js";
import Preloader from "./Preloader.js";
import StartGame from "./StartGame.js";
import { PlayGame } from "./PlayGame.js";
import EndGame from "./EndGame.js";
var game;

if (!localStorage["1st"]) {
    localStorage.setItem("1st", 0)
    localStorage.setItem("2nd", 0)
    localStorage.setItem("3rd", 0)
    localStorage.setItem("4th", 0)
    localStorage.setItem("5th", 0)
}

window.onload = function () {
    var gameConfig = {
        type: Phaser.CANVAS,
        width: gameOptions.tileSize * 4 + gameOptions.tileSpacing * 5,
        height: gameOptions.tileSize * 5 + gameOptions.tileSpacing * 5,
        backgroundColor: 0xffffff,
        scene: [Preloader, StartGame, PlayGame, EndGame]
    };
    game = new Phaser.Game(gameConfig);
    window.focus()
    resize();
    window.addEventListener("resize", resize, false);
}

// for visual use
function resize() {
    var canvas = document.querySelector("canvas");
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var windowRatio = windowWidth / windowHeight;
    var gameRatio = game.config.width / game.config.height;
    if (windowRatio < gameRatio) {
        canvas.style.width = windowWidth + "px";
        canvas.style.height = (windowWidth / gameRatio) + "px";
    }
    else {
        canvas.style.width = (windowHeight * gameRatio) + "px";
        canvas.style.height = windowHeight + "px";
    }
}