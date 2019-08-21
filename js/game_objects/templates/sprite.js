class TemplateSprite extends Phaser.Physics.Matter.Sprite {

  constructor(scene, x, y) {
    super(scene, x, y);
    this.setOrigin(0.5, 0.5);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // this.body.setCollideWorldBounds(true);
  }

  createAViewRadius() {
    var view_distance = 120;
    this.view_radius = this.scene.add.circle(0, 0, view_distance);
    this.view_radius.setStrokeStyle(1, 0x222222, 0.4);
    scene.physics.add.existing(this.view_radius);
    this.view_radius.body.setCircle(view_distance);
    this.view_radius.body.updateCenter();
  }

  isInViewRadius(point) {
    return Phaser.Geom.Circle.ContainsPoint(this.view_radius.geom, point);
  }

  // Move boilerplate:
  onInput(cursors) {
    if (!this.active) return;
    if (cursors.left.isDown) {
      this.rotation -= 0.05;
    } else if (cursors.right.isDown) {
      this.rotation += 0.05;
    }
    this.scene.physics.velocityFromRotation(this.rotation, this.current_speed, this.body.velocity);
  }

  // For object pools:
  revive(x, y) {
    this.setActive(true);
    this.setVisible(true);
    this.body.setEnable(true);
    this.setPosition(x, y);
    this.body.reset(x, y);
  }

  // For object pools:
  release() {
    this.setActive(false);
    this.setVisible(false);
    this.body.setEnable(false);
    this.body.stop();
  }

}
