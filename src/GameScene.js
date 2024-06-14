import { Scene } from "phaser";

export default class GameScene extends Scene {
    get score() {
        return this.registry.get("score");
    }
    set score(value) {
        this.registry.set("score", value);
    }

    get startTime() {
        return this.registry.get("startTime");
    }
    set startTime(value) {
        this.registry.set("startTime", value.getTime());
    }

    get endTime() {
        return this.registry.get("endTime");
    }
    set endTime(value) {
        this.registry.set("endTime", value.getTime());
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
        leaderboard.sort((x, y) => x - y);
        if (leaderboard.length > 5) leaderboard = leaderboard.slice(0, 5);
        localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
    }
}
