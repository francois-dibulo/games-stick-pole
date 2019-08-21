class BaseScene extends Phaser.Scene {

  constructor (key) {
    super(key);
  }

  getBBox() {
    var camera = this.cameras.main;
    return {
      top: 0,
      bottom: camera.height,
      left: 0,
      right: camera.width,
      center_x: camera.centerX,
      center_y: camera.centerY
    };
  }

  changeScene(target_scene, params) {
    this.scene.stop(this.scene.key);
    this.scene.start(target_scene, params);
  }

}
