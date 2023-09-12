import Phaser from "phaser";
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    },
    scene: {
        preload,
        create,
        update
    }
}

//load assets, audio
function preload() {
    this.load.image('sky', 'assets/sky.png');
    this.load.image('bird', 'assets/bird.png');
    this.load.image('pipe', 'assets/pipe.png');

}

const VELOCITY = 200;
const PIPES_TO_RENDER = 4;

let bird = null;
let pipes = null;
let pipeHorizontalDistance = 0;
let flapVelocity = 150;
const initalBirdPosition  = {x: config.width * 0.1, y: config.height /2}

let pipeVerticalDistanceRage = [150, 250];
const pipeHorizontalDistanceRange = [500, 550];

function create() {
    this.add.image(0, 0, 'sky').setOrigin(0);
    bird = this.physics.add.sprite(initalBirdPosition.x, initalBirdPosition.y, 'bird').setOrigin(0);
    bird.body.gravity.y = 400;

    pipes = this.physics.add.group();

    for (let i = 0; i < PIPES_TO_RENDER; i++) {
        const upperPipe = pipes.create(0, 0, 'pipe').setOrigin(0, 1);
        const lowerPipe = pipes.create(0, 0, 'pipe').setOrigin(0, 0);
        placePipe(upperPipe, lowerPipe);

    }
    pipes.setVelocityX(-200);

    this.input.on('pointerdown', flap)
    this.input.keyboard.on('keydown_SPACE', flap)
}

function update(time, delta) {
    if(bird.y > config.height || bird.y < -bird.height)
    {
        restartPlayerPosition();
    }
}

function placePipe(uPipe, lPipe) {
    const rightMostX = getRightMostPipe();
    const pipeVerticalDistance = Phaser.Math.Between(...pipeVerticalDistanceRage);
    const pipeVerticalPosition = Phaser.Math.Between(20, config.height - 20 - pipeVerticalDistance);
    const pipeHorizontalDistance = Phaser.Math.Between(...pipeHorizontalDistanceRange);

    uPipe.x = rightMostX + pipeHorizontalDistance;
    uPipe.y = pipeVerticalPosition;

    lPipe.x = uPipe.x;
    lPipe.y = uPipe.y + pipeVerticalDistance

    lPipe.body.velocity.x = -200;
    uPipe.body.velocity.x = -200;

}

function getRightMostPipe()
{
    let rightMostX = 0;

    pipes.getChildren().forEach(function(pipe) {
        rightMostX = Math.max(pipe.x, rightMostX);
    })

    return rightMostX;
}

function restartPlayerPosition()
{
    bird.x = initalBirdPosition.x;
    bird.y = initalBirdPosition.y;
    bird.body.velocity.y = 0

}
function flap()
{
    bird.body.velocity.y = -VELOCITY;
}

new Phaser.Game(config);