import { gameOptions } from "../commonSettings.js";
import highestScores from "../highestScore.js";
var musicStatus = true;
var score = 0;
var PlayGame = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function playGame() {
        Phaser.Scene.call(this, { key: "PlayGame" });
    },
    create: function () {
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
        this.restartSmall.on(
            "pointerdown",
            function () {
                highestScores(score);
                score = 0;
                this.scene.start("PlayGame");
            },
            this
        );
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
        this.leaderboard.on(
            "pointerdown",
            function () {
                this.closeButton.visible = true;
                this.leaderboard.visible = false;
                this.scoreboard = this.add.image(450, 450, "scoreboard");
                this.leaderLabel = this.add.text(200, 150, "HIGHEST SCORE", {
                    color: "#ef4966",
                    fontSize: "40px",
                    fontFamily: "font1",
                });
                this.leaderResults = this.add.text(200, 250, "", {
                    color: "#ef4966",
                    fontSize: "20px",
                    fontFamily: "font1",
                });
                this.leaderResults.setText(`1st. ${this.storage.getItem(
                    "1st"
                )}\n
2nd. ${this.storage.getItem("2nd")}\n
3rd. ${this.storage.getItem("3rd")}\n
4th. ${this.storage.getItem("4th")}\n
5th. ${this.storage.getItem("5th")}`);
            },
            this
        );

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
        this.fieldArray = [];

        this.plop = this.sound.add("plop");

        this.fieldGroup = this.add.group();
        for (var i = 0; i < 4; i++) {
            this.fieldArray[i] = [];
            for (var j = 0; j < 4; j++) {
                var two = this.add.sprite(
                    this.tileDestination(j),
                    this.tileDestination(i),
                    "tiles"
                );
                two.alpha = 0;
                two.visible = false;
                this.fieldGroup.add(two);
                this.fieldArray[i][j] = {
                    tileValue: 0,
                    tileSprite: two,
                    canUpgrade: true,
                };
            }
        }
        // for keyboard use
        this.input.keyboard.on("keydown", this.handleKey, this);
        // for touch use
        this.input.on("pointerup", this.endSwipe, this);

        this.canMove = false;
        this.addTwo();
        this.addTwo();
    },

    endSwipe: function (e) {
        var swipeTime = e.upTime - e.downTime;
        var swipe = new Phaser.Geom.Point(e.upX - e.downX, e.upY - e.downY);
        var swipeMagnitude = Phaser.Geom.Point.GetMagnitude(swipe);
        var swipeNormal = new Phaser.Geom.Point(
            swipe.x / swipeMagnitude,
            swipe.y / swipeMagnitude
        );
        if (
            swipeMagnitude > 20 &&
            swipeTime < 1000 &&
            (Math.abs(swipeNormal.y) > 0.8 || Math.abs(swipeNormal.x) > 0.8)
        ) {
            if (swipeNormal.x > 0.8) {
                this.handleMove(0, 1);
            }
            if (swipeNormal.x < -0.8) {
                this.handleMove(0, -1);
            }
            if (swipeNormal.y > 0.8) {
                this.handleMove(1, 0);
            }
            if (swipeNormal.y < -0.8) {
                this.handleMove(-1, 0);
            }
        }
    },

    addTwo: function () {
        var emptyTiles = this.emptyCells();
        var chosenTile = Phaser.Utils.Array.GetRandomElement(emptyTiles);
        this.fieldArray[chosenTile.row][chosenTile.col].tileValue = 1;
        this.fieldArray[chosenTile.row][
            chosenTile.col
        ].tileSprite.visible = true;
        this.fieldArray[chosenTile.row][chosenTile.col].tileSprite.setFrame(0);
        this.tweens.add({
            targets: [
                this.fieldArray[chosenTile.row][chosenTile.col].tileSprite,
            ],
            alpha: 1,
            duration: gameOptions.tweenSpeed,
            onComplete: function (tween) {
                tween.parent.scene.canMove = true;
            },
        });
    },

    handleKey: function (e) {
        if (this.canMove) {
            switch (e.code) {
                case "KeyA":
                case "ArrowLeft":
                    this.handleMove(0, -1);
                    break;
                case "KeyD":
                case "ArrowRight":
                    this.handleMove(0, 1);
                    break;
                case "KeyW":
                case "ArrowUp":
                    this.handleMove(-1, 0);
                    break;
                case "KeyS":
                case "ArrowDown":
                    this.handleMove(1, 0);
                    break;
                case "KeyR":
                    this.scene.start("EndGame");
            }
        }
    },

    handleMove: function (deltaRow, deltaCol) {
        this.canMove = false;
        var somethingMoved = false;
        this.movingTiles = 0;
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                var colToWatch = deltaCol == 1 ? 4 - 1 - j : j;
                var rowToWatch = deltaRow == 1 ? 4 - 1 - i : i;
                var tileValue =
                    this.fieldArray[rowToWatch][colToWatch].tileValue;
                if (tileValue != 0) {
                    var colSteps = deltaCol;
                    var rowSteps = deltaRow;
                    while (
                        this.isInsideBoard(
                            rowToWatch + rowSteps,
                            colToWatch + colSteps
                        ) &&
                        this.fieldArray[rowToWatch + rowSteps][
                            colToWatch + colSteps
                        ].tileValue == 0
                    ) {
                        colSteps += deltaCol;
                        rowSteps += deltaRow;
                    }
                    // if change number
                    if (
                        this.isInsideBoard(
                            rowToWatch + rowSteps,
                            colToWatch + colSteps
                        ) &&
                        this.fieldArray[rowToWatch + rowSteps][
                            colToWatch + colSteps
                        ].tileValue == tileValue &&
                        this.fieldArray[rowToWatch + rowSteps][
                            colToWatch + colSteps
                        ].canUpgrade &&
                        this.fieldArray[rowToWatch][colToWatch].canUpgrade
                    ) {
                        this.fieldArray[rowToWatch + rowSteps][
                            colToWatch + colSteps
                        ].tileValue++;
                        this.fieldArray[rowToWatch + rowSteps][
                            colToWatch + colSteps
                        ].canUpgrade = false;
                        this.fieldArray[rowToWatch][colToWatch].tileValue = 0;
                        this.moveTile(
                            this.fieldArray[rowToWatch][colToWatch],
                            rowToWatch + rowSteps,
                            colToWatch + colSteps,
                            Math.abs(rowSteps + colSteps),
                            true
                        );
                        somethingMoved = true;
                    }
                    // if not change number
                    else {
                        colSteps = colSteps - deltaCol;
                        rowSteps = rowSteps - deltaRow;
                        if (colSteps != 0 || rowSteps != 0) {
                            this.fieldArray[rowToWatch + rowSteps][
                                colToWatch + colSteps
                            ].tileValue = tileValue;
                            this.fieldArray[rowToWatch][
                                colToWatch
                            ].tileValue = 0;
                            this.moveTile(
                                this.fieldArray[rowToWatch][colToWatch],
                                rowToWatch + rowSteps,
                                colToWatch + colSteps,
                                Math.abs(rowSteps + colSteps),
                                false
                            );
                            somethingMoved = true;
                        }
                    }
                }
            }
        }
        if (!somethingMoved) {
            this.canMove = true;
        }
    },

    moveTile: function (tile, row, col, distance, changeNumber) {
        this.movingTiles++;
        this.tweens.add({
            targets: [tile.tileSprite],
            x: this.tileDestination(col),
            y: this.tileDestination(row),
            duration: gameOptions.tweenSpeed * distance,
            onComplete: function (tween) {
                tween.parent.scene.movingTiles--;
                if (changeNumber) {
                    tween.parent.scene.transformTile(tile, row, col);
                }
                if (tween.parent.scene.movingTiles == 0) {
                    tween.parent.scene.resetTiles();
                    tween.parent.scene.addTwo();
                }
            },
        });
    },
    transformTile: function (tile, row, col) {
        this.movingTiles++;
        score++;
        this.plop.play();
        tile.tileSprite.setFrame(this.fieldArray[row][col].tileValue - 1);
        this.tweens.add({
            targets: [tile.tileSprite],
            scaleX: 1.1,
            scaleY: 1.1,
            duration: gameOptions.tweenSpeed,
            yoyo: true,
            repeat: 1,
            onComplete: function (tween) {
                tween.parent.scene.movingTiles--;
                if (tween.parent.scene.movingTiles == 0) {
                    tween.parent.scene.resetTiles();
                    tween.parent.scene.addTwo();
                }
            },
        });
    },
    resetTiles: function () {
        var tile;
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                tile = this.fieldArray[i][j];
                tile.canUpgrade = true;
                tile.tileSprite.x = this.tileDestination(j);
                tile.tileSprite.y = this.tileDestination(i);
                if (tile.tileValue > 0) {
                    tile.tileSprite.alpha = 1;
                    tile.tileSprite.visible = true;
                    tile.tileSprite.setFrame(
                        this.fieldArray[i][j].tileValue - 1
                    );
                } else {
                    tile.tileSprite.alpha = 0;
                    tile.tileSprite.visible = false;
                }
            }
        }
    },
    isInsideBoard: function (row, col) {
        return row >= 0 && col >= 0 && row < 4 && col < 4;
    },
    tileDestination: function (pos) {
        return (
            pos * (gameOptions.tileSize + gameOptions.tileSpacing) +
            gameOptions.tileSize / 2 +
            gameOptions.tileSpacing
        );
    },
    emptyCells: function () {
        var emptyTiles = [];
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                if (this.fieldArray[i][j].tileValue == 0) {
                    emptyTiles.push({
                        row: i,
                        col: j,
                    });
                }
            }
        }
        return emptyTiles;
    },
    cellAvailable: function () {
        return !!this.emptyCells().length;
    },
    tileMatchesAvailable: function () {
        // var tile;
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                for (let direction = 0; direction < 4; direction++) {
                    var vector = this.getVector(direction);
                    if (
                        i + vector.x < 4 &&
                        i + vector.x >= 0 &&
                        j + vector.y < 4 &&
                        j + vector.y >= 0
                    ) {
                        var neighbor =
                            this.fieldArray[i + vector.x][j + vector.y];
                    }
                    if (
                        neighbor &&
                        neighbor.tileValue === this.fieldArray[i][j].tileValue
                    ) {
                        return true;
                    }
                }
            }
        }
        return false;
    },
    getVector: function (direction) {
        var map = {
            0: { x: 0, y: -1 }, //Up
            1: { x: 1, y: 0 }, //Right
            2: { x: 0, y: 1 }, //Down
            3: { x: -1, y: 0 }, //Left
        };
        return map[direction];
    },
    movesAvailable: function () {
        // return this.cellAvailable();

        return this.cellAvailable() || this.tileMatchesAvailable();
    },
    update() {
        this.scoreText.setText(`${score}`);
        if (score >= 10) {
            this.scoreText.x = 120;
        }
        if (score >= 100) {
            this.scoreText.x = 100;
        }
        if (score >= 1000) {
            this.scoreText.x = 70;
        }
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                if (this.fieldArray[i][j].tileValue == 11) {
                    // this.result.setText("You win!")
                    this.scene.start("EndGame");
                }
            }
        }
        //Game over
        if (!this.movesAvailable()) {
            this.scene.start("EndGame");
            // this.music.stop()
        }
    },
});
export { score, PlayGame };
