import BaseScene from '@/game/scenes/BaseScene';
import { useGame } from '@/stores/game';

export default class PlayScene extends BaseScene {
    constructor() {
        super('PlayScene', 'play');
        this.pathTraveled = [];
        this.sectionPattern = [
            [], // Section 1
            [], // Section 2
            [], // Section 3
            [], // Section 4
            [], // Section 5
        ];
        this.distanceTraveledPerSection = [0.0, 0.0, 0.0, 0.0, 0.0];
        this.distanceTraveled = 0.0;
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
                this.pathTraveled.push(ball.getData('sectionIndex'));
            });
        });

        // Se agrega el calculo de distancia al arrastrar la pelota
        this.input.on('drag', (pointer, ball, dragX, dragY) => {
            const distance = Phaser.Math.Distance.Between(
                ball.prevX, ball.prevY,
                ball.x, ball.y
            );
            this.distanceTraveled += distance;
            this.distanceTraveledPerSection[ball.getData('sectionIndex')] += distance;
            ball.prevX = ball.x;
            ball.prevY = ball.y;
        });
    }

    update() {
        super.update();
    }

    timeOver() {
        // Agregar Gracias, el tiempo ha terminado
        console.log("El juego ha terminado");
        console.log(`Distancia total recorrida: ${this.distanceTraveled}`);
        this.gameStore.isTimeOver = true;
        this.scene.stop();
    }

    gameOver() {
        // Agregar Gracias, la tarea ha terminado
        const elapsedTime = Date.now() - this.startTime;
        this.gameStore.uploadScore({
            time: elapsedTime / 1000,
            distance: this.distanceTraveled,
            distancePerSection: this.distanceTraveledPerSection,
            transitions: this.pathTraveled,
            patterns: this.sectionPattern,
            score: this.cache.json.get(this.phase + 'Coords').totalDistance / this.distanceTraveled,
        });
        this.scene.stop();
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
        const allGoalsReached = this.goalsGroup.getChildren().every((goal) => {
            return goal.getData('numBalls') === 0;
        });

        if (allGoalsReached) {
            // Prueba completada
            this.gameOver();
        }

    }
}
