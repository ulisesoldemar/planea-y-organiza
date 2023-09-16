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
            this.cameras.main.centerY - 60,
            'Bienvenido',
            { fontFamily: 'Roboto', fontSize: '36px', fill: '#000', fontWeight: '700'} // Cambia la fuente y el tamaño
        );
        titleText.setOrigin(0.5);

        const messageText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            '¿Estás listo para comenzar la tarea?',
            { fontFamily: 'Roboto', fontSize: '24px', fill: '#000', align: 'center', wordWrap: { width: 450 } } // Cambia la fuente y el tamaño
        );
        messageText.setOrigin(0.5);

        // Botón de Play (círculo)
        const alignButtonY = this.cameras.main.centerY + 80;
        const playButton = this.add.graphics();
        playButton.fillStyle(0x6634C3, 1); // Color verde
        playButton.fillCircle(this.cameras.main.centerX, alignButtonY, 30);

        // Triángulo dentro del círculo
        const triangle = new Phaser.Geom.Triangle(
            this.cameras.main.centerX - 10,
            alignButtonY + 5, // Ajusta la coordenada Y para moverlo más hacia abajo
            this.cameras.main.centerX + 10,
            alignButtonY + 5, // Ajusta la coordenada Y para moverlo más hacia abajo
            this.cameras.main.centerX,
            alignButtonY + 25 // Ajusta la coordenada Y para moverlo más hacia abajo
        );
        const playtriangle = this.add.graphics();    
        playtriangle.depth=100;
        playtriangle.fillStyle(0x000000, 1); // Color blanco
        playtriangle.fillTriangle(triangle);


        // Agregar una imagen como botón
        const playButtonImage = this.add.image(
            this.cameras.main.centerX,
            this.cameras.main.centerY + 80,
            'Boton-Phaser' // Reemplaza con el nombre de tu imagen
        );

        // Hacer que la imagen sea interactiva como un botón
        playButtonImage.setInteractive();

        // Agregar un evento al hacer clic en la imagen
        playButtonImage.on('pointerdown', () => {
            this.scene.start('PlayScene'); // Cambiar a la escena principal del juego
        });

        // Agregar un evento al botón de Play
        playButton.setInteractive(new Phaser.Geom.Circle(this.cameras.main.centerX, alignButtonY, 30), Phaser.Geom.Circle.Contains);
        playButton.on('pointerdown', () => {
            this.scene.start('PlayScene'); // Cambiar a la escena principal del juego
        });
    }
}
