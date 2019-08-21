class TemplateArc extends Phaser.GameObjects.Arc {
  constructor(scene, x, y, radius, color) {
    super(scene, x, y, radius, 0, 360, false, color || 0xEAB543);
    this.setOrigin(0.5, 0.5);
    this.radius = radius;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.setCircle(radius);
  }
}
