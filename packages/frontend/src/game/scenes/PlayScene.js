import BaseScene from '@/game/scenes/BaseScene';
import { useGame } from '@/stores/game';

export default class PlayScene extends BaseScene {
    constructor() {
        super('PlayScene', 'play');
        this.transitions = [];
        this.currentSection = null;
        this.prevSection = null;
        this.fullPattern = [];
        this.transitionsPattern = [];
        this.sectionPattern = [
            [], // Section 1
            [], // Section 2
            [], // Section 3
            [], // Section 4
            [], // Section 5
        ];
        this.distancePerSection = [0.0, 0.0, 0.0, 0.0, 0.0];
        this.enteredBalls = 0;
        this.distance = 0.0;
        this.gameStore = useGame();
    }

    create() {
        // Se llama a la clase padre
        super.create();

        this.maxTime = this.gameStore.gameTime * 60; // El tiempo esta en minutos, se pasa a segundos
        this.startTime = Date.now();
        // Evento para el límite de tiempo
        this.timedEvent = this.time.delayedCall(this.maxTime * 1000, this.timeOver, [], this);

        // Se agregan propiedades de distancia a cada pelota, además del
        // evento de tracking
        this.ballsGroup.children.iterate((ball) => {
            // Trackedo de las coordendas iniciales para el patron seguido
            ball.startX = ball.x;
            ball.startY = ball.y;
            // Variables para el tracking de distancia recorrida por pelota
            ball.prevX = ball.x;
            ball.prevY = ball.y;

            // Agregado el evento para trackear cambio de sección
            ball.on('pointerdown', () => {
                const currentIndex = ball.getData('sectionIndex');
                if (this.currentSection === null) {
                    this.currentSection = currentIndex;
                    this.prevSection = currentIndex;
                } else if (currentIndex !== this.currentSection) {
                    this.prevSection = this.currentSection;
                    this.currentSection = currentIndex;
                    this.transitions.push({
                        from: this.prevSection,
                        to: this.currentSection,
                    });
                }
            });
        });

        // // Se agrega el calculo de distancia al arrastrar la pelota
        // this.input.on('drag', (pointer, ball, dragX, dragY) => {
        //     const distance = Phaser.Math.Distance.Between(
        //         ball.prevX, ball.prevY,
        //         ball.x, ball.y
        //     );
        //     this.distanceTraveled += distance;
        //     this.distanceTraveledPerSection[ball.getData('sectionIndex')] += distance;
        //     ball.prevX = ball.x;
        //     ball.prevY = ball.y;
        // });
    }

    resetScene() {
        this.transitions = [];
        this.currentSection = null;
        this.prevSection = null;
        this.fullPattern = [];
        this.transitionsPattern = [];
        this.sectionPattern = [
            [], // Section 1
            [], // Section 2
            [], // Section 3
            [], // Section 4
            [], // Section 5
        ];
        this.distancePerSection = [0.0, 0.0, 0.0, 0.0, 0.0];
        this.enteredBalls = 0;
        this.distance = 0.0;
    }

    timeOver() {
        this.gameStore.isTimeOver = true;
        this.gameOver();
    }

    gameOver() {
        // Sumatoria de las distancias recorridas por sección
        for (let i = 0; i < this.sectionPattern.length; ++i) {
            const section = this.sectionPattern[i];
            let distance = 0;
            for (let j = 0; j < section.length - 1; ++j) {
                distance += Phaser.Math.Distance.Between(
                    section[j].x, section[j].y,
                    section[j + 1].x, section[j + 1].y
                );
            }
            this.distancePerSection[i] = distance;
            this.distance += distance;
        }
        const elapsedTime = Date.now() - this.startTime;
        const time = elapsedTime / 1000;
        const finalScore = this.distance / time;
        this.gameStore.uploadScore({
            time: time,
            distance: this.distance,
            distancePerSection: this.distancePerSection,
            transitions: this.transitions,
            patterns: this.sectionPattern,
            fullPattern: this.fullPattern,
            enteredBalls: this.enteredBalls,
            score: finalScore,
        });
        if (this.gameStore.currentSession === 1) {
            this.gameStore.currentSession = 2;
            this.gameStore.maxTime = (time / 120); // !20 para que sea la mitad del tiempo en minutos
            this.resetScene();
            this.scene.start('GameStartDialogScene', { welcome: `Bien hecho, tu tiempo fue ${(time / 60).toFixed(2)} minutos`, message: `Ahora vamos a hacer la prueba de nuevo, pero esta vez tienes la mitad del tiempo, es decir ${this.gameStore.maxTime.toFixed(2)} minutos para completarla` });
        } else {
            this.scene.stop();
            this.gameStore.gameOver();
        }
    }

    addZeros(num) {
        if (num < 10) {
            num = '0' + num;
        }
        return num;
    }

    ballGoalCollision(ball, goal) {
        super.ballGoalCollision(ball, goal);
        this.sectionPattern[ball.getData('sectionIndex')].push(
            {
                x: ball.startX,
                y: ball.startY,
            }
        );
        this.fullPattern.push(
            {
                x: ball.startX,
                y: ball.startY,
            }
        );
        ++this.enteredBalls;
        const allGoalsReached = this.goalsGroup.getChildren().every((goal) => {
            return goal.getData('numBalls') === 0;
        });

        if (allGoalsReached) {
            // Prueba completada
            this.gameOver();
        }

    }
}
