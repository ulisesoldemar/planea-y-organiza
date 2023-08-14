import BaseScene from '@/game/scenes/BaseScene';
import { useGame } from '@/stores/game';

export default class PlayScene extends BaseScene {
    constructor() {
        super('PlayScene', 'play');
        this.maxTime = 1000; // Tiempo de la prueba en segundos
        this.pathTraveled = [];
        this.distanceTraveled = 0.0;
    }

    create() {
        // Se llama a la clase padre
        super.create();

        // Evento para el límite de tiempo
        this.timedEvent = this.time.delayedCall(this.maxTime * 1000, this.timeOver, [], this);

        // Se agregan propiedades de distancia a cada pelota, además del
        // evento de tracking
        this.ballsGroup.children.iterate((ball) => {
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
            ball.prevX = ball.x;
            ball.prevY = ball.y;
        });
    }

    timeOver() {
        console.log("El juego ha terminado");
        console.log(`Distancia total recorrida: ${this.distanceTraveled}`);
        this.scene.stop();
    }

    addZeros(num) {
        if (num < 10) {
            num = '0' + num;
        }
        return num;
    }
}
