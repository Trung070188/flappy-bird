import Phaser from "phaser";
import PlayScene from "./scenes/PlayScene";
import MenuScene from "./scenes/MenuScene";
import PreloadScene from "./scenes/PreloadScene";

const WIDTH = 800;
const HEIGHT = 600;
const BIRD_POSITION = {x: WIDTH * 0.1, y: HEIGHT / 2}
const SHARE_CONFIG = {
    width: WIDTH,
    height: HEIGHT,
    startPosition : BIRD_POSITION

}
const Scenes = [PreloadScene, MenuScene, PlayScene];
const initScenes = () =>  Scenes.map((Scene) => new Scene(SHARE_CONFIG));
const config = {
    type: Phaser.AUTO,
    ...SHARE_CONFIG,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    },
    scene: initScenes
}

new Phaser.Game(config);