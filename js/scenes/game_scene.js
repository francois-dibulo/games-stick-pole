// https://audiojungle.net/item/for-synth-pop-pack/24336877
class GameScene extends BaseScene {

  constructor() {
    super("Game");
    this.group_buildings = null;
    this.player = null;
    this.pole = null;
    this.start_building = null;
    this.target_building = null;
    this.score_text = null;
    this.score = {
      current: 0,
      max: 0
    };

    this.Config = {
      Building: {
        Width: [25, 60],
        Height: Math.round(window.innerHeight / 3),
        Max_Gap: window.innerWidth - 70
      },
      Pole: {
        Height: 5,
        Width: 3
      }
    }
  }

  preload() {
    // this.load.image('unit', 'assets/images/agent_0.png');
  }

  // =====================================================================================
  // CREATE
  // =====================================================================================

  create() {
    this.input.on("pointerdown", this.onPointerDown, this);
    this.input.on("pointerup", this.onPointerUp, this);

    this.group_buildings = this.add.group({
      classType: BuildingRectangle,
      maxSize: 10
    });

    this.createEntities();
  }

  createEntities() {
    var bbox = this.getBBox();
    var config = this.Config;

    this.score_text = this.add.text(bbox.center_x, 20, 'Score: 0', { color: '#00ff00' });
    this.score_text.setOrigin(0.5, 0);

    this.instruction_text = this.add.text(bbox.center_x, bbox.center_y, 'TAP AND HOLD', { color: '#CCC', fontSize: "20px" });
    this.instruction_text.setOrigin(0.5, 0);

    // START BUILDING
    var building_h = config.Building.Height;
    var w = 60;
    this.start_building = this.createBuilding(bbox.left, bbox.bottom - building_h, w, building_h);

    // TARGET BUILDING
    w = Phaser.Math.Between(config.Building.Width[0], config.Building.Width[1]);
    var gap_distance = Phaser.Math.Between(w * 3, config.Building.Max_Gap);
    this.target_building = this.createBuilding(bbox.left + gap_distance, bbox.bottom - building_h, w, building_h);

    // PLAYER
    var building_y = this.start_building.y;
    var building_center_x = this.start_building.getCenter().x;

    this.player = this.createPlayer(building_center_x, building_y);
    this.player.on("ON_PLAYER_MOVED", this.onPlayerMoved.bind(this))
    this.player.on("ON_PLAYER_FALLED", this.resetGame.bind(this))

    // POLE
    this.pole = this.createPole(this.player.x + this.player.width + this.Config.Pole.Width, building_y);
    this.pole.setMaxHeight(config.Building.Max_Gap + config.Building.Width[1] + this.Config.Pole.Width);
    this.pole.on("ON_POLE_LAYING", this.onPoleLaying.bind(this));
  }

  resetGame() {
    var bbox = this.getBBox();
    var config = this.Config;

    // START BUILDING
    var building_h = config.Building.Height;
    var building_w = 60;
    this.start_building.revive(bbox.left, bbox.bottom - building_h, building_w, building_h);

    // TARGET BUILDING
    var w = Phaser.Math.Between(config.Building.Width[0], config.Building.Width[1]);
    var gap_distance = bbox.left + Phaser.Math.Between(w * 3, config.Building.Max_Gap);
    this.target_building.revive(gap_distance, bbox.bottom - building_h, w, building_h);

    // PLAYER
    var building_y = this.start_building.y;
    var building_center_x = this.start_building.getCenter().x;
    this.player.revive(building_center_x, building_y - this.player.height);

    // POLE
    this.revivePole();

    this.score.current = 0;
    this.updateScore();
  }

  revivePole() {
    this.pole.revive(this.player.x + this.player.width + this.Config.Pole.Width, this.player.y + this.player.height, this.pole.width, this.Config.Pole.Height);
  }

  createBuilding(x, y, w, h) {
    var building = this.group_buildings.get();
    building.revive(x, y, w, h);
    return building;
  }

  createPlayer(x, y) {
    var h = 20;
    var w = 10;
    y = y - h;
    var player = new PlayerRectangle(this, x, y, w, h);
    player.revive(x, y, w, h, 0x00FF00);
    return player;
  }

  createPole(x, y) {
    var w = this.Config.Pole.Width;
    var h = this.Config.Pole.Height;
    var pole = new PoleRectangle(this, x, y, w, h);
    pole.revive(x, y, w, h, 0xFF0000);
    return pole;
  }

  // =====================================================================================
  // UPDATE & COLLISION
  // =====================================================================================

  onPointerDown() {
    this.pole.grow();
    if (this.instruction_text) {
      this.instruction_text.destroy();
      this.instruction_text = null;
    }
  }

  onPointerUp() {
    this.pole.stopGrow();
  }

  // Triggered after the pole transform is done and its laying on the ground
  onPoleLaying() {
    var target_x = this.player.width + 5 + this.pole.displayHeight;
    this.player.moveTo(target_x, false, "ON_PLAYER_MOVED");
  }

  getTargetBuilding() {
    var bbox = this.getBBox();
    var config = this.Config;

    var building_h = config.Building.Height;
    var w = Phaser.Math.Between(config.Building.Width[0], config.Building.Width[1]);
    var gap_distance = Phaser.Math.Between(this.start_building.width * 3, config.Building.Max_Gap);
    return this.createBuilding(this.start_building.x + gap_distance, bbox.bottom - building_h, w, building_h);
  }

  onPlayerMoved() {
    var self = this;
    var player_center_x = this.player.getCenter().x;

    // Player is not on a platform
    if (player_center_x + 2 < this.target_building.x ||
        player_center_x - 2 > this.target_building.x + this.target_building.displayWidth) {

      this.score.max = Math.max(this.score.current, this.score.max);
      this.player.fallDown(this.getBBox().bottom + this.player.displayHeight);

    // Player is on a platform
    } else {
      this.score.current += 1;

      this.pole.release();
      this.start_building.moveTo(-this.start_building.displayWidth);
      this.target_building.moveTo(0);

      var player_target_x = Math.round(this.target_building.width / 2 - this.player.width / 2);
      this.player.moveTo(player_target_x, true, function() {
        var start_building_before = self.start_building;
        self.start_building = self.target_building;

        start_building_before.release();

        self.target_building = self.getTargetBuilding();
        self.revivePole();
      });
    }

    this.updateScore();
  }

  updateScore() {
    this.score_text.setText("SCORE: " + this.score.current + "\n MAX: " + this.score.max + "");
  }

}
