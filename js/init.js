function initGame() {

  var config = {
    type: Phaser.AUTO,
    width: window.innerWidth, //320,
    height: window.innerHeight, //480,
    parent: 'phaser-container',
    backgroundColor: '#111111',
    scene: [
      CharacterSelectionScene,
      GameScene
    ]
  };

  var game = new Phaser.Game(config);
};

initGame();
