import Phaser from 'phaser'
import BootScene from '@/game/scenes/BootScene'
import PlayScene from '@/game/scenes/PlayScene'
import TutorialScene from '@/game/scenes/TutorialScene'

function launch(containerId) {
  const gameConfig = {
    type: Phaser.AUTO,
    scale: {
      // mode: Phaser.Scale.RESIZE,
      // parent: containerId,
      // autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 1280,
      height: 720,
    },
    backgroundColor: 0xffffff,
    parent: containerId,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0 },
        debug: false
      }
    },
    scene: [BootScene, PlayScene, TutorialScene]
  }
  const game = new Phaser.Game(gameConfig);

  function resize() {
    const canvas = game.canvas;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const windowRatio = windowWidth / windowHeight;
    const gameRatio = 1280 / 720;

    if (windowRatio < gameRatio) {
      canvas.style.width = windowWidth + 'px';
      canvas.style.height = (windowWidth / gameRatio) + 'px';
    } else {
      canvas.style.width = (windowHeight * gameRatio) + 'px';
      canvas.style.height = windowHeight + 'px';
    }
  }

  resize(); // Llamar a resize() al iniciar el juego para ajustar el canvas correctamente

  // Configurar la función para que se ejecute cada vez que la ventana cambie de tamaño
  window.addEventListener('resize', resize);

  return game;
}

export default launch
export { launch }
