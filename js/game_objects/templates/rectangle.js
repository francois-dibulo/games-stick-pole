/**
 * Template class for a Rectangle Sprite
 */
class TemplateRectangle extends Phaser.GameObjects.Rectangle {

  constructor(scene, x, y, w, h, color) {
    super(scene, x, y, w, h, color);
    this._id = randomId();
    this.setOrigin(0.5, 0.5);
    scene.add.existing(this);
    scene.physics.add.existing(this);
  }

}
