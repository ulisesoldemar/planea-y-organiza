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

        // Texto
        const titleText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY - 40,
            'Bienvenido al juego',
            { fontSize: '24px', fill: '#000' }
        );
        titleText.setOrigin(0.5);

        const messageText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            '¿Estás listo para comenzar?',
            { fontSize: '18px', fill: '#000', align: 'center', wordWrap: { width: 250 } }
        );
        messageText.setOrigin(0.5);

        // Botón
        const startButton = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY + 40,
            '¡Comenzar!',
            { fontSize: '20px', fill: '#000' }
        );
        startButton.setOrigin(0.5);
        startButton.setInteractive();
        startButton.on('pointerdown', () => {
            this.scene.start('PlayScene'); // Cambiar a la escena principal del juego
        });
    }
}
