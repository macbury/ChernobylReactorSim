import Phaser from 'phaser';
import {BaseRod, CONTROL_ROD_HEIGHT, CONTROL_ROD_SIZE} from "./BaseRod.ts";

const ROD_SPEED = 80;
const CONTROL_ROD_TEXTURE = "control_rod";

export class ControlRod extends BaseRod {
  private sound: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound;
  
  public static preload(scene : Phaser.Scene) {
    scene.add.graphics()
      .fillStyle(0x414547, 1)
      .fillRect(0, 0, CONTROL_ROD_SIZE, CONTROL_ROD_HEIGHT)
      .generateTexture(CONTROL_ROD_TEXTURE, CONTROL_ROD_SIZE, CONTROL_ROD_HEIGHT)
      .destroy()
    
    scene.load.audio('rodImpact', 'assets/impactMetal_light_002.ogg')
  }
  
  constructor(scene : Phaser.Scene) {
    super(scene, CONTROL_ROD_TEXTURE, ROD_SPEED);

    this.sound = scene.sound.add('rodImpact')
    this.sound.setVolume(0.1)
  }
 
  public hit() {
    this.sound.play()
  }
}