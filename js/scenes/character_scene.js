class CharacterSelectionScene extends BaseScene {

  constructor() {
    super("CharacterSelection");
    this.Config = {
      Building: {
        Width: 60,
        Height: Math.round(window.innerHeight / 3)
      },
      Player: {
        Height: 44,
        Width: 20
      }
    };
    this.selected_texture = null;
    this.croco = null;
  }

  preload() {
    this.load.image('player', 'assets/images/player.png');
    this.load.image('croco', 'assets/images/croco.png');
    this.load.image('croco_attack', 'assets/images/croco_attack.png');
    this.load.image('princess', 'assets/images/princess.png');

    // OhOh https://audiojungle.net/item/funny-creature-oh-oh/21153123
    //this.load.audio('oh_oh', ['assets/sounds/oh_oh.mp3']);
  }

  // =====================================================================================
  // CREATE
  // =====================================================================================

  create() {
    // this.input.on("pointerdown", this.onPointerDown, this);
    // this.input.on("pointerup", this.onPointerUp, this);
    this.createEntities();
  }

  createEntities() {
    var self = this;
    var bbox = this.getBBox();
    var config = this.Config;

    this.instruction_text_0 = this.add.text(bbox.center_x, 40, 'SELECT YOUR CHARACTER', { color: '#00ff00' });
    this.instruction_text_0.setOrigin(0.5, 0);

    this.instruction_text_0 = this.add.text(bbox.center_x, 60, 'ARE YOU A?', { color: '#00ff00', fontSize: "30px" });
    this.instruction_text_0.setOrigin(0.5, 0);

    var players = ["player", "princess"];

    var total_width = bbox.right;
    var building_w = config.Building.Width;
    var building_h = config.Building.Height;
    var building_y = bbox.bottom - building_h;
    var side = total_width / players.length;

    for (var i = 0; i < players.length; i++) {
      var texture = players[i];
      var x = (side * (i + 1)) - side / 2;

      var building = this.createBuilding(x, building_y, building_w, building_h);
      building.setOrigin(0.5, 0);

      var player = this.createPlayer(x - this.Config.Player.Width / 2, building_y, texture);
      (function(player) {
        player.setInteractive();
        player.on('pointerdown', function() {
          self.onCharacterSelect(player);
        }, this);
      })(player);

    }

    // Croco
    this.spawnCroco(total_width / 2);
  }

  onCharacterSelect(player) {
    this.selected_texture = player.inital_texture;

    var croco_x = this.croco.x;
    var x = 0;
    if (player.x > croco_x) {
      this.croco.setScale(-1, 1);
      this.croco.angle = 270 + 45;
    } else {
      this.croco.setScale(1, 1);
      this.croco.angle = 45;
    }

    this.time.delayedCall(800, function() {
      this.startGame();
    }, [], this);
  }

  startGame() {
    this.changeScene("Game", {
      player_texture: this.selected_texture
    });
  }

  createBuilding(x, y, w, h) {
    var building = new BuildingRectangle(this, x, y, w, h, 0xFFFFFF);
    building.revive(x, y, w, h);
    return building;
  }

  createPlayer(x, y, texture) {
    var config = this.Config.Player;
    var h = config.Height;
    var w = config.Width;
    y = y - h;
    var player = new PlayerRectangle(this, x, y, texture);
    player.revive(x, y, w, h, 0x00FF00);
    return player;
  }

  spawnCroco(x) {
    var bbox = this.getBBox();
    this.croco = new CrocoSprite(this, x, bbox.bottom - 10);
  }

}
