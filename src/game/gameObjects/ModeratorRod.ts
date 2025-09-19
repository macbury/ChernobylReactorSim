import Phaser from 'phaser';
import {BaseRod, CONTROL_ROD_HEIGHT, CONTROL_ROD_SIZE} from "./BaseRod.ts";

const ROD_SPEED = 20;
const MODERATOR_ROD_TEXTURE = "moderator_rod";

export class ModeratorRod extends BaseRod {
  private sound: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound;
  
  public static preload(scene : Phaser.Scene) {
    scene.add.graphics()
      .fillStyle(0xffffff, 1)
      .fillRect(0, 0, CONTROL_ROD_SIZE, CONTROL_ROD_HEIGHT)
      .lineStyle(2, 0x21130d, 1)
      .strokeRect(0, 0, CONTROL_ROD_SIZE, CONTROL_ROD_HEIGHT)
      .generateTexture(MODERATOR_ROD_TEXTURE, CONTROL_ROD_SIZE, CONTROL_ROD_HEIGHT)
      .destroy()
    
    scene.load.audio('moderatorHit', 'assets/impactGlass_heavy_000.ogg')
  }
  
  constructor(scene : Phaser.Scene) {
    super(scene, MODERATOR_ROD_TEXTURE, ROD_SPEED);

    this.sound = scene.sound.add('moderatorHit')
    this.sound.setVolume(0.1)
  }
 
  public hit(): void {
    this.sound.play()
  }
}