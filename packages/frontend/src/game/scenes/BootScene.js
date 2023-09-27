import { Scene } from 'phaser'
import ball from '@/game/assets/sprites/ball.png'
import goal from '@/game/assets/sprites/goal.png'
import wall from '@/game/assets/sprites/wall.png'
import playButton from '@/game/assets/sprites/Boton-Phaser.png'
import coinWav from '@/game/assets/sounds/coin.wav'
import startWav from '@/game/assets/sounds/start.wav'
import winWav from '@/game/assets/sounds/win.wav'
import tutorialCoords from '@/game/assets/json/tutorial_coords.json'
import playCoords from '@/game/assets/json/play_coords.json'

export default class BootScene extends Scene {
  constructor() {
    super({ key: 'BootScene' })
  }

  preload() {
    this.load.image('ball', ball)
    this.load.image('goal', goal)
    this.load.image('wall', wall)
    this.load.image('playButton', playButton)
    this.load.audio('goalSound', coinWav)
    this.load.audio('startSound', startWav)
    this.load.audio('winSound', winWav)
    this.load.json('tutorialCoords', tutorialCoords)
    this.load.json('playCoords', playCoords)
  }

  create() {
    this.text = this.add.text(
      this.game.config.width / 2,
      this.game.config.height / 2,
      'Por favor, ponga su teléfono en orizontal',
      { font: '2rem Courier', fill: '#1C1C1C' }
    );
    this.checkOrientation(this.scale.orientation);
  }

  update() {
    if (this.scale.orientation === Phaser.Scale.LANDSCAPE) {
      this.text.setVisible(false);
      this.scene.start('TutorialScene');
    }
  }

  checkOrientation(orientation) {
    if (orientation === Phaser.Scale.PORTRAIT) {
      this.text.setVisible(true);
    } else if (orientation === Phaser.Scale.LANDSCAPE) {
      this.text.setVisible(false);
      this.scene.start('TutorialScene');
    }
  }
}
