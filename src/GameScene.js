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
}