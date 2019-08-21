class PoleRectangle extends Phaser.GameObjects.Rectangle {

  constructor(scene, x, y, w, h, color) {
    super(scene, x, y, w, h, color);
    this._id = randomId();
    this.setOrigin(1, 1);
    this.tween_grow = null;
    this.max_height = 200;
    scene.add.existing(this);
    this.current_state = PoleRectangle.State.Initial;
  }

  // For object pools:
  revive(x, y, w, h, color) {
    this.angle = 0;
    this.current_state = PoleRectangle.State.Initial;
    this.setActive(true);
    this.setVisible(true);
    this.setPosition(x, y);
    if (w) {
      this.width = w;
      this.displayWidth = w;
    }
    if (h !== undefined) {
      this.height = h;
      this.displayHeight = h;
    }
    this.setColor(color);
  }


  setColor(color) {
    if (color) {
      this.setFillStyle(color || 0xFFFFFF, 1);
    }
  }

  setMaxHeight(height) {
    this.max_height = height;
   }

  grow() {
    if (this.current_state !== PoleRectangle.State.Initial) {
      return;
    }
    this.current_state = PoleRectangle.State.Growing;

    this.tween_grow = this.scene.tweens.add({
      targets: [this],
      displayHeight: this.max_height,
      duration: 500
    });
  }

  stopGrow() {
    if (this.current_state === PoleRectangle.State.Laying) {
      return;
    }

    if (this.tween_grow) {
      this.tween_grow.stop();
    }

    this.current_state = PoleRectangle.State.Laying;

    this.scene.tweens.add({
      targets: [this],
      angle: 90,
      duration: 300,
      ease: "Bounce.easeOut",
      callbackScope: this,
      onComplete: function() {
        this.emit("ON_POLE_LAYING");
      }
    });
  }

  // For object pools:
  release() {
    this.setActive(false);
    this.setVisible(false);
  }

}

PoleRectangle.State = {
  Initial: 0,
  Growing: 1,
  Laying: 2
}
