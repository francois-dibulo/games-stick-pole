class PlayerRectangle extends Phaser.GameObjects.Rectangle {

  constructor(scene, x, y, w, h, color) {
    super(scene, x, y, w, h, color);
    this._id = randomId();
    this.setOrigin(0, 0);
    scene.add.existing(this);
    this.move_tween = null;
    this.fall_tween = null;
  }

  // cb_event - String or function
  moveTo(x, is_absolute, cb_event) {
    var data = {
      targets: [this],
      duration: 600,
      ease: 'Sine.easeInOut',
      callbackScope: this,
      onComplete: function() {
        if (cb_event) {
          if (typeof cb_event === "function") {
            cb_event();
          } else {
            this.emit(cb_event);
          }
        }
      }
    };

    if (is_absolute) {
      data.x = x
    } else {
      data.props = {
        x: {
          value: "+= " +  x
        }
      };
    }

    this.move_tween = this.scene.tweens.add(data);
  }

  fallDown(y) {
    this.fall_tween = this.scene.tweens.add({
      targets: [this],
      y: y,
      duration: 600,
      delay: 500,
      ease: "Cubic.easeIn",
      callbackScope: this,
      onComplete: function() {
        this.emit("ON_PLAYER_FALLED");
      }
    });
  }

  setColor(color) {
    if (color) {
      this.setFillStyle(color || 0xFFFFFF, 1);
    }
  }

  // For object pools:
  revive(x, y, w, h, color) {
    if (this.move_tween) {
      this.move_tween.stop();
      this.move_tween = null;
    }
    if (this.fall_tween) {
      this.fall_tween.stop();
      this.fall_tween = null;
    }
    this.setActive(true);
    this.setVisible(true);
    this.setPosition(x, y);
    if (w) {
      this.width = w;
      this.displayWidth = w;
    }
    if (h) {
      this.height = h;
      this.displayHeight = h;
    }
    this.setColor(color);
  }

  // For object pools:
  release() {
    this.setActive(false);
    this.setVisible(false);
  }

}
