class TemplateContainer extends Phaser.GameObjects.Container {

  constructor (scene, x, y, children) {
    super(scene, x, y, children || []);
    scene.add.existing(this);
  }

  // Example to add a child
  createBaseShape() {
    var base_graphics = new Phaser.GameObjects.Arc(this.scene, 0, 0, this.base_radius, 0, 360, false, 0xf6f6f6)
    this.scene.physics.world.enable([ base_graphics ]);
    this.add(base_graphics);
    base_graphics.body.setCircle(this.base_radius);
    base_graphics.body.setImmovable(true);
    base_graphics.body.updateBounds();
    base_graphics.body.updateCenter();
    base_graphics.body.syncBounds = true;
    this.base_graphics = base_graphics;

    var base_graphics_top = this.scene.add.graphics(0, 0);
    base_graphics_top.fillStyle(0xCCCCCC, 1);
    base_graphics_top.fillCircle(0, 0, this.base_radius - 10);
    this.add(base_graphics_top);
  }

}
