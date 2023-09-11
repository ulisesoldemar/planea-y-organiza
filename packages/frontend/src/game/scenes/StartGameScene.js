export default class GameStartDialogScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameStartDialogScene' });
    }

    create() {
        // Fondo del diálogo
        const dialogBackground = this.add.rectangle(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            300,
            200,
            0xffffff
        );
        dialogBackground.setAlpha(0.9);

        // Texto con una fuente adecuada
        const titleText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY - 40,
            'Bienvenido',
            { fontFamily: 'Arial', fontSize: '36px', fill: '#000' } // Cambia la fuente y el tamaño
        );
        titleText.setOrigin(0.5);

        const messageText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            '¿Estás listo para comenzar la tarea?',
            { fontFamily: 'Arial', fontSize: '24px', fill: '#000', align: 'center', wordWrap: { width: 250 } } // Cambia la fuente y el tamaño
        );
        messageText.setOrigin(0.5);

        // Botón de Play (círculo)
        const playButton = this.add.graphics();
        playButton.fillStyle(0x00ff00, 1); // Color verde
        playButton.fillCircle(this.cameras.main.centerX, this.cameras.main.centerY + 40, 30);

        // Triángulo dentro del círculo
        const triangle = new Phaser.Geom.Triangle(
            this.cameras.main.centerX - 10,
            this.cameras.main.centerY + 40 - 15,
            this.cameras.main.centerX + 10,
            this.cameras.main.centerY + 40 - 15,
            this.cameras.main.centerX,
            this.cameras.main.centerY + 40 + 15
        );

        playButton.fillStyle(0xffffff, 1); // Color blanco
        playButton.fillTriangle(triangle);

        // Agregar un evento al botón de Play
        playButton.setInteractive(new Phaser.Geom.Circle(this.cameras.main.centerX, this.cameras.main.centerY + 40, 30), Phaser.Geom.Circle.Contains);
        playButton.on('pointerdown', () => {
            this.scene.start('PlayScene'); // Cambiar a la escena principal del juego
        });
    }
}
