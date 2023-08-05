import { Scene } from 'phaser';

export default class BaseScene extends Scene {
    constructor(key, phase) {
        super({ key });
        this.wallWidth = 2.5; // Ancho de los muros
        this.totalSections = 5;
        this.phase = phase;
    }

    create() {
        // Textos de pausa y de finalizacion de juego
        this.winText = null;
        this.pauseText = null;
        this.gameOverText = null;

        // Objeto de sonido
        this.goalSound = this.sound.add('goalSound');
        this.winSound = this.sound.add('winSound');

        // Chequeo de orientacion para dispositivos moviles
        const scaleManager = this.scale;
        scaleManager.on('orientationchange', this.checkOrientation, this);

        // Crear grupos de objetos
        this.ballsGroup = this.physics.add.group();
        this.wallsGroup = this.physics.add.staticGroup();
        this.goalsGroup = this.physics.add.staticGroup();

        // Colocar muros
        this.placeWalls();

        // Colocar metas y pelotas
        this.placeItems();

        // Habilitar interacción de arrastrar y soltar para las pelotas
        this.input.on('dragstart', (pointer, ball) => {
            ball.setTint(0xff0000);
        });

        this.input.on('drag', (pointer, ball, dragX, dragY) => {
            // Obtener las coordenadas X mínimas y máximas permitidas para la sección
            const minX = ball.getData('minX')
            const maxX = ball.getData('maxX')

            // Aplicar el método clamp a la posición X de la pelota para mantenerla dentro de la sección
            ball.x = Phaser.Math.Clamp(dragX, minX, maxX);
            ball.y = dragY;
        });

        this.input.on('dragend', (pointer, ball) => {
            ball.clearTint();
        });

        // Detectar colisiones
        this.physics.add.collider(this.ballsGroup, this.goalsGroup, this.ballGoalCollision, null, this);
        // this.physics.add.collider(this.ballsGroup, this.wallsGroup); // Agregar colisión con los muros

    }
    
    update() {
        if (this.scale.orientation === Phaser.Scale.PORTRAIT) {
            this.pauseGame();
        } else if (this.scale.orientation === Phaser.Scale.LANDSCAPE) {
            this.resumeGame();
        }
    }

    checkOrientation() {
        const orientation = this.scale.orientation;

        if (orientation === Phaser.Scale.Orientation.PORTRAIT) {
            // La orientación es vertical, pausar el juego
            this.pauseGame();
        } else {
            // La orientación no es vertical, reanudar el juego si estaba pausado
            this.resumeGame();
        }
    }

    pauseGame() {
        this.scene.pause();
        this.pauseText = this.add.text(
            this.game.config.width / 2,
            this.game.config.height / 2,
            'Por favor, ponga su teléfono en orizontal',
            { font: '32px Courier', fill: '#1C1C1C' }
        );
        this.pauseText.setOrigin(0.5);
    }

    resumeGame() {
        // Reanudar el juego
        if (!this.scene.isPaused()) {
            return;
        }

        this.scene.resume();
        // Eliminar el objeto de texto de pausa
        if (this.pauseText) {
            this.pauseText.destroy();
            this.pauseText = null;
        }
    }

    placeWalls() {
        // Colocar muros en las divisiones entre las secciones
        const sectionWidth = this.game.config.width / this.totalSections; // Ancho de cada sección
        // La posición en Y no cambia
        const y = this.game.config.height / 2;

        for (let i = 1; i < this.totalSections; i++) {
            const x = i * sectionWidth - this.wallWidth / 2;

            const wall = this.wallsGroup.create(x, y, 'wall');
            wall.setData('sectionIndex', i);
            wall.setImmovable(true); // Cuerpo cinemático
            wall.setSize(this.wallWidth, this.game.config.height);
            wall.setDisplaySize(this.wallWidth, this.game.config.height);
        }
    }

    placeItems() {
        // Coloca pelotas y metas
        const sectionWidth = this.game.config.width / this.totalSections; // Ancho de cada sección
        const sections = this.cache.json.get(this.phase + 'Coords').sections;

        // Colocar metas en las posiciones deseadas
        for (let i = 0; i < sections.length; i++) {
            // Coordenadas de las metas por sección
            const goalX = sections[i].target.x + (i * sectionWidth);
            const goalY = sections[i].target.y;
            const goal = this.goalsGroup.create(goalX, goalY, 'goal');

            goal.setData('sectionIndex', i);
            goal.setData('numBalls', sections[i].balls.length);

            // Colocar pelotas
            for (const coord of sections[i].balls) {
                // Coordenadas de las pelotas por sección
                const ballX = coord.x + (i * sectionWidth);
                const ballY = coord.y
                const ball = this.ballsGroup.create(ballX, ballY, 'ball');

                // Obtener las coordenadas X mínimas y máximas permitidas para la sección
                const minX = (i * sectionWidth) + ball.body.width / 2;
                const maxX = ((i + 1) * sectionWidth) - (ball.body.width / 2) - this.wallWidth;

                // Propiedades de la pelota
                ball.setData('sectionIndex', i);
                ball.setData('minX', minX);
                ball.setData('maxX', maxX);

                ball.setSize(20, 20);
                ball.setDisplaySize(20, 20);
                ball.setInteractive();
                this.input.setDraggable(ball);
            }
        }
    }


    ballGoalCollision(ball, goal) {
        // Lógica cuando una pelota colisiona con una meta
        ball.disableBody(true, true); // Eliminar la pelota del juego

        // Reproducir sonido
        this.goalSound.play();

        const numBalls = goal.getData('numBalls');
        goal.setData('numBalls', numBalls - 1);

        if (numBalls - 1 === 0) {
            // Todas las pelotas de la sección han sido alcanzadas, eliminar meta
            goal.disableBody(true, true);
        }

        // Verificar si todas las metas han sido alcanzadas en todas las secciones
        const allGoalsReached = this.goalsGroup.getChildren().every((goal) => {
            return goal.getData('numBalls') === 0;
        });

        if (allGoalsReached) {
            // Todas las metas han sido alcanzadas, juego completado
            console.log('¡Juego completado!');
            this.winSound.play();
        }
    }

}
