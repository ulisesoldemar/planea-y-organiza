import BaseScene from '@/game/scenes/BaseScene';

export default class TutorialScene extends BaseScene {
    constructor() {
        super('TutorialScene', 'tutorial');
        this.countDown = 10; // Tiempo de espera para iniciar la prueba
    }

    create() {
        super.create();

        this.startSound = this.sound.add('startSound');

        // Tiempo de espera antes de iniciar la prueba
        this.startTestEvent = this.time.delayedCall(this.countDown * 1000, this.startTest, [], this);

        // Deshabilitar las pelotas antes de que inicie la tarea
        this.ballsGroup.children.iterate((ball) => {
            this.input.setDraggable(ball, false);
        });
    }

    showGreenCircle() {
        // Crear un círculo verde en la esquina superior derecha
        const greenCircle = this.add.circle(
            this.game.config.width - 50,
            50,
            30,
            0x00ff00
        );

        // Configurar la propiedad alpha a 0 para que el círculo sea transparente al principio
        greenCircle.alpha = 1;

        // Configurar una animación de desvanecimiento
        this.tweens.add({
            targets: greenCircle,
            alpha: 0, // Valor final de la propiedad alpha (opacidad completa)
            duration: 1500, // Duración de la animación en milisegundos (1 segundo en este caso)
            yoyo: false, // Hace que la animación vuelva a la posición inicial después de completarse
            repeat: 0 // Repetir la animación una vez
        });
    }

    startTest() {
        // Se habilitan el drag de las pelotas
        this.ballsGroup.children.iterate((ball) => {
            this.input.setDraggable(ball, true);
        });
        this.showGreenCircle();
        this.startSound.play();
    }

    ballGoalCollision(ball, goal) {
        super.ballGoalCollision(ball, goal);
        // Verificar si todas las metas han sido alcanzadas en todas las secciones
        const allGoalsReached = this.goalsGroup.getChildren().every((goal) => {
            return goal.getData('numBalls') === 0;
        });

        if (allGoalsReached) {
            // Prueba completada
            this.scene.start('PlayScene');
        }
    }
}
