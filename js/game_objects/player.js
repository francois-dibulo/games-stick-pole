class PlayerRectangle extends Phaser.GameObjects. Sprite {

  constructor(scene, x, y, texture) {
    super(scene, x, y, "player");
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
    this.setTexture("player_fall");

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

  // For object pools:
  revive(x, y, w, h, color) {
    this.setTexture("player");
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
  }

  // For object pools:
  release() {
    this.setActive(false);
    this.setVisible(false);
  }

}
