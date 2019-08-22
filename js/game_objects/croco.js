class CrocoSprite extends Phaser.GameObjects. Sprite {

  constructor(scene, x, y, texture) {
    super(scene, x, y, "croco");
    this.setOrigin(0.5, 0.5);
    scene.add.existing(this);
    this.angle = 45;
    this.move_tween = null;
  }

  // cb_event - String or function
  moveTo(x, is_absolute, cb_event, delay) {
    delay = delay || 0;
    var data = {
      targets: [this],
      duration: 600,
      delay: delay,
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

  attack(x) {
    this.setTexture("croco_attack");
    if (x > this.x) {
      this.setScale(-1, 1);
      this.angle = 0;
    } else {
      this.setScale(1, 1);
      this.angle = 45;
    }
    this.moveTo(x, true, null, 700);
  }

  revive(x, y, w, h, color) {
    this.setTexture("croco");
    this.setScale(1, 1);
    this.angle = 45;
    //this.setPosition(x, y);
  }

}
