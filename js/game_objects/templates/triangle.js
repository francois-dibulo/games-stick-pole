class TemplateTriangle extends Phaser.GameObjects.Triangle {

  constructor (scene, x, y, x1, y1, x2, y2, x3, y3, fillColor) {
    super(scene, x, y, x1, y1, x2, y2, x3, y3, fillColor);

    this.uuid = Phaser.Utils.String.UUID();

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setOrigin(0.5);

    var h = 4;
    var w = 12;
    this.displayWidth = w;
    this.displayHeight = h * 2;

    this.setFillStyle(0xffffff, 1);
    this.setStrokeStyle(2, 0x487eb0);
    this.setTo(0, 0, this.width, this.height / 2, 0, this.height);
    //this.body.setCircle(this.radius);
  }
