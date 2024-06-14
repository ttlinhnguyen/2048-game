import { Scene } from "phaser";

export default class GameScene extends Scene {
    get score() {
        return this.registry.get("score");
    }
    set score(value) {
        this.registry.set("score", value);
    }

    constructor(key) {
        super();
        if (key) Scene.call(this, { key: key });
    }

    recordLeaderboard(score) {
        let storage = localStorage.getItem("leaderboard");
        let leaderboard = storage ? JSON.parse(storage) : [];
        leaderboard.push(score);
        leaderboard.map(parseFloat);
        leaderboard.sort((x, y) => y - x);
        leaderboard = leaderboard.slice(0, leaderboard.length - 1);
        localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
    }
}