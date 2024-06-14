import { gameOptions } from "../commonSettings";
import { Geom, Utils } from "phaser";
import GameManager from "./GameManager";

export default class PlayGame extends GameManager {
    constructor() {
        super("PlayGame");
    }

    create() {
        super.create();
        this.fieldArray = [];
        this.plop = this.sound.add("plop");
        this.fieldGroup = this.add.group();

        for (let i = 0; i < 4; i++) {
            this.fieldArray[i] = [];
            for (let j = 0; j < 4; j++) {
                let two = this.createEmptyTile(i, j);
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

        this.startTime = new Date();
    }

    createEmptyTile(x, y) {
        return this.add
            .sprite(this.tileDestination(y), this.tileDestination(x), "tiles")
            .setAlpha(0)
            .setVisible(false);
    }

    restart() {
        this.score = 0;
        this.scene.start("PlayGame");
    }

    endSwipe(e) {
        let swipeTime = e.upTime - e.downTime;
        let swipe = new Geom.Point(e.upX - e.downX, e.upY - e.downY);
        let swipeMagnitude = Geom.Point.GetMagnitude(swipe);
        let swipeNormal = new Geom.Point(
            swipe.x / swipeMagnitude,
            swipe.y / swipeMagnitude
        );

        if (swipeMagnitude > 20 && swipeTime < 1000) {
            if (swipeNormal.x > 0.8) {
                this.handleMove(0, 1);
            } else if (swipeNormal.x < -0.8) {
                this.handleMove(0, -1);
            }
            if (swipeNormal.y > 0.8) {
                this.handleMove(1, 0);
            } else if (swipeNormal.y < -0.8) {
                this.handleMove(-1, 0);
            }
        }
    }

    addTwo() {
        let emptyTiles = this.emptyCells();
        let tile = Utils.Array.GetRandom(emptyTiles);
        this.fieldArray[tile.row][tile.col].tileValue = 1;
        this.fieldArray[tile.row][tile.col].tileSprite.visible = true;
        this.fieldArray[tile.row][tile.col].tileSprite.setFrame(0);
        this.tweens.add({
            targets: [this.fieldArray[tile.row][tile.col].tileSprite],
            alpha: 1,
            duration: gameOptions.tweenSpeed,
            onComplete: function (tween) {
                tween.parent.scene.canMove = true;
            },
        });
    }

    handleKey(e) {
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
                    break;
            }
        }
    }

    handleMove(rowOffset, colOffset) {
        this.canMove = false;
        let somethingMoved = false;
        this.movingTiles = 0;
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                let col = colOffset == 1 ? 4 - 1 - j : j;
                let row = rowOffset == 1 ? 4 - 1 - i : i;
                let tileValue = this.fieldArray[row][col].tileValue;
                if (tileValue == 0) continue;

                let colSteps = colOffset;
                let rowSteps = rowOffset;
                while (
                    this.isInsideBoard(row + rowSteps, col + colSteps) &&
                    this.fieldArray[row + rowSteps][col + colSteps].tileValue ==
                        0
                ) {
                    colSteps += colOffset;
                    rowSteps += rowOffset;
                }

                // if change number
                let newRows = row + rowSteps;
                let newCols = col + colSteps;
                if (
                    this.isInsideBoard(newRows, newCols) &&
                    this.fieldArray[newRows][newCols].tileValue == tileValue &&
                    this.fieldArray[newRows][newCols].canUpgrade &&
                    this.fieldArray[row][col].canUpgrade
                ) {
                    this.fieldArray[newRows][newCols].tileValue++;
                    this.fieldArray[newRows][newCols].canUpgrade = false;
                    this.fieldArray[row][col].tileValue = 0;
                    this.moveTile(
                        this.fieldArray[row][col],
                        newRows,
                        newCols,
                        Math.abs(rowSteps + colSteps),
                        true
                    );
                    somethingMoved = true;
                }
                // if not change number
                else {
                    colSteps -= colOffset;
                    rowSteps -= rowOffset;
                    if (colSteps == 0 && rowSteps == 0) continue;

                    this.fieldArray[row + rowSteps][col + colSteps].tileValue =
                        tileValue;
                    this.fieldArray[row][col].tileValue = 0;
                    this.moveTile(
                        this.fieldArray[row][col],
                        row + rowSteps,
                        col + colSteps,
                        Math.abs(rowSteps + colSteps),
                        false
                    );
                    somethingMoved = true;
                }
            }
        }
        if (!somethingMoved) {
            this.canMove = true;
        }
    }

    moveTile(tile, row, col, distance, changeNumber) {
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
    }

    transformTile(tile, row, col) {
        this.movingTiles++;
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
    }

    resetTiles() {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                let tile = this.fieldArray[i][j];
                tile.canUpgrade = true;
                tile.tileSprite.x = this.tileDestination(j);
                tile.tileSprite.y = this.tileDestination(i);
                if (tile.tileValue > 0) {
                    tile.tileSprite.alpha = 1;
                    tile.tileSprite.visible = true;
                    tile.tileSprite = tile.tileSprite.setFrame(
                        this.fieldArray[i][j].tileValue - 1
                    );
                } else {
                    tile.tileSprite.alpha = 0;
                    tile.tileSprite.visible = false;
                }
            }
        }
    }

    isInsideBoard(row, col) {
        return row >= 0 && col >= 0 && row < 4 && col < 4;
    }

    tileDestination(pos) {
        return (
            pos * (gameOptions.tileSize + gameOptions.tileSpacing) +
            gameOptions.tileSize / 2 +
            gameOptions.tileSpacing
        );
    }

    emptyCells() {
        let emptyTiles = [];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.fieldArray[i][j].tileValue == 0) {
                    emptyTiles.push({ row: i, col: j });
                }
            }
        }
        return emptyTiles;
    }

    cellAvailable() {
        return !!this.emptyCells().length;
    }

    tileMatchesAvailable() {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                for (let direction = 0; direction < 4; direction++) {
                    let vector = this.getVector(direction);
                    let x = i + vector.x;
                    let y = i + vector.y;
                    if (!(x < 4 && x >= 0 && y < 4 && y >= 0)) continue;

                    let neighbor = this.fieldArray[i + vector.x][j + vector.y];
                    let curValue = this.fieldArray[i][j].tileValue;
                    if (neighbor.tileValue === curValue) return true;
                }
            }
        }
        return false;
    }

    getVector(direction) {
        let map = {
            0: { x: 0, y: -1 }, //Up
            1: { x: 1, y: 0 }, //Right
            2: { x: 0, y: 1 }, //Down
            3: { x: -1, y: 0 }, //Left
        };
        return map[direction];
    }

    movesAvailable() {
        return this.cellAvailable() || this.tileMatchesAvailable();
    }

    update() {
        let millis = new Date().getTime() - this.startTime;
        let minutes = Math.floor(millis / 60000);
        let seconds = ((millis % 60000) / 1000).toFixed(0);
        this.scoreText.setText(`${minutes}m${seconds}s`);

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                // Win
                if (this.fieldArray[i][j].tileValue === 11) {
                    this.score = 11;
                    this.scene.start("EndGame");
                }
            }
        }

        this.score = 0;
        //Game over
        if (!this.movesAvailable()) {
            this.scene.start("EndGame");
        }
    }
}
