import Phaser from "phaser";
import BaseScene from "./BaseScene";

const PIPES_TO_RENDER = 4;

class PlayScene extends BaseScene {
    constructor(config) {
        super('PlayScene', config);
        this.bird = null;
        this.pipes = null;
        this.pipeVerticalDistanceRage = [150, 250];
        this.pipeHorizontalDistanceRange = [500, 550];
        this.flapVelocity = 300;
        this.score = null;
        this.scoreText = '';
    }

    create() {
        super.create();
        this.createBird();
        this.createPipes();
        this.createPause();
        this.createColliders();
        this.handleInputs();
        this.createScore();
        this.listenToEvents();
    }

    update() {
        this.checkGameStatus();
        this.recyclePipes();
    }

    listenToEvents() {
        if (this.pauseEvent) {
            return;
        }

        this.pauseEvent =this.events.on('resume', () => {
            this.initialTime = 3;
            this.countDownText = this.add.text(...this.screenCenter, 'Fly in: ' + this.initialTime, this.fontOptions).setOrigin(0.5);
            this.timedEvent = this.time.addEvent({
                delay: 1000,
                callback: this.countDown,
                callbackScope: this,
                loop: true
            })
        })
    }

    countDown() {
        this.initialTime--;
        this.countDownText.setText('Fly in: ' + this.initialTime);
        if (this.initialTime <= 0) {
            this.countDownText.setText('');
            this.physics.resume();
            this.timedEvent.remove();
        }
    }

    createBird() {
        this.bird = this.physics.add.sprite(this.config.startPosition.x, this.config.startPosition.y, 'bird').setOrigin(0);
        this.bird.body.gravity.y = 600;
        this.bird.setCollideWorldBounds(true);
    }

    createPipes() {
        this.pipes = this.physics.add.group();

        for (let i = 0; i < PIPES_TO_RENDER; i++) {
            {
                const upperPipe = this.pipes.create(0, 0, 'pipe').setImmovable(true).setOrigin(0, 1);
                const lowerPipe = this.pipes.create(0, 0, 'pipe').setImmovable(true).setOrigin(0, 0);

                this.placePipe(upperPipe, lowerPipe);
            }

            this.pipes.setVelocityX(-200);
        }
    }

    createPause() {
        const pauseButton = this.add.image(this.config.width - 10, this.config.height - 10, 'pause')
            .setInteractive()
            .setScale(3)
            .setOrigin(1);
        pauseButton.on('pointerdown', () => {
            this.physics.pause();
            this.scene.pause();
            this.scene.launch('PauseScene');
        })
    }

    handleInputs() {
        this.input.on('pointerdown', this.flap, this);
        this.input.keyboard.on('keydown_SPACE', this.flap, this);
    }

    createColliders() {
        this.physics.add.collider(this.bird, this.pipes, this.gameOver, null, this);
    }

    checkGameStatus() {
        if (this.bird.getBounds().bottom >= this.config.height || this.bird.y <= 0) {
            this.gameOver();
        }
    }

    placePipe(uPipe, lPipe) {
        const rightMostX = this.getRightMostPipe();
        const pipeVerticalDistance = Phaser.Math.Between(...this.pipeVerticalDistanceRage);
        const pipeVerticalPosition = Phaser.Math.Between(20, this.config.height - 20 - pipeVerticalDistance);
        const pipeHorizontalDistance = Phaser.Math.Between(...this.pipeHorizontalDistanceRange);

        uPipe.x = rightMostX + pipeHorizontalDistance;
        uPipe.y = pipeVerticalPosition;

        lPipe.x = uPipe.x;
        lPipe.y = uPipe.y + pipeVerticalDistance

        lPipe.body.velocity.x = -200;
        uPipe.body.velocity.x = -200;

    }

    getRightMostPipe() {
        let rightMostX = 0;

        this.pipes.getChildren().forEach(function (pipe) {
            rightMostX = Math.max(pipe.x, rightMostX);
        })

        return rightMostX;
    }

    saveBestScore() {
        const bestScoreText = localStorage.getItem('bestScore');
        const bestScore = bestScoreText && parseInt(bestScoreText, 10);

        if (!bestScore || this.score > bestScore) {
            localStorage.setItem('bestScore', this.score);
        }
    }

    gameOver() {

        this.physics.pause();
        this.bird.setTint(0xDC3C19);
        this.saveBestScore();
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.scene.restart();
            }
        })

    }

// doan code tái chế lại ống
    recyclePipes() {
        const tempPipes = [];
        this.pipes.getChildren().forEach(pipe => {
            if (pipe.getBounds().right <= 0) {
                tempPipes.push(pipe);
                if (tempPipes.length === 2) {
                    this.placePipe(...tempPipes);
                    this.increaseScore();
                    this.saveBestScore();
                }
            }
        })
    }

    flap() {
        this.bird.body.velocity.y = -this.flapVelocity;
    }

    createScore() {
        this.score = 0;
        const bestScore = localStorage.getItem('bestScore');
        this.scoreText = this.add.text(16, 16, `Score: ${0}`, {fontSize: '20px', fill: '#000'})
        this.add.text(16, 52, `Best score: ${bestScore || 0}`, {fontSize: '18px', fill: '#000'});
    }

    increaseScore() {
        this.score++;
        this.scoreText.setText(`Score: ${this.score}`)
    }


}

export default PlayScene;