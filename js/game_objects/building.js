class BuildingRectangle extends Phaser.GameObjects.Rectangle {

  constructor(scene, x, y, w, h, color) {
    super(scene, x, y, w, h, color);
    this._id = randomId();
    this.setOrigin(0, 0);
    scene.add.existing(this);
  }

  // For object pools:
  revive(x, y, w, h, color) {
    this.setActive(true);
    this.setVisible(true);
    this.setPosition(x, y);
    this.width = w;
    this.height = h;
    this.displayWidth = w;
    this.displayHeight = h;
    this.setFillStyle(color || 0xFFFFFF, 1);
  }

  // For object pools:
  release() {
    this.setActive(false);
    this.setVisible(false);
  }

  moveTo(x) {
    this.move_tween = this.scene.tweens.add({
      targets: [this],
      x: x,
      duration: 500,
      ease: 'Sine.easeInOut',
      callbackScope: this,
      onComplete: function() {
        //this.emit("ON_PLAYER_MOVED");
      }
    });
  }

}
