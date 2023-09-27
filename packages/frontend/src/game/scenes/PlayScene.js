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
        this.enteredBalls = 0;
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
                const lastIndex = this.pathTraveled.slice(-1)
                const currentIndex = ball.getData('sectionIndex');
                // Solo se agregan las pelotas cuando se cambia de seccion
                if (lastIndex !== currentIndex) {
                    this.pathTraveled.push(ball.getData('sectionIndex'));
                }
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

    timeOver() {
        // Agregar Gracias, el tiempo ha terminado
        console.log("El juego ha terminado");
        this.gameStore.isTimeOver = true;
        this.gameOver();
        
    }

    gameOver() {
        // Agregar Gracias, la tarea ha terminado
        const elapsedTime = Date.now() - this.startTime;
        const data = this.cache.json.get(this.phase + 'Coords');
        const a = this.distanceTraveled;
        const b = data.totalDistance;
        const finalScore = (this.enteredBalls / 200) * Math.min(a/b, b/a);
        this.gameStore.uploadScore({
            time: elapsedTime / 1000,
            distance: this.distanceTraveled,
            distancePerSection: this.distanceTraveledPerSection,
            transitions: this.pathTraveled,
            patterns: this.sectionPattern,
            score: finalScore,
        });
        this.scene.stop();
        this.gameStore.gameOver();
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
