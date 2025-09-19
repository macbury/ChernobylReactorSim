import Phaser from 'phaser';

export class GigerCounter extends Phaser.GameObjects.GameObject {
  private blips: (Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound)[];
  private blipIndex: number;
  
  public static preload(scene : Phaser.Scene) {
    scene.load.audio('giger1', 'assets/giger/1.mp3')
    scene.load.audio('giger2', 'assets/giger/2.mp3')
    scene.load.audio('giger3', 'assets/giger/3.mp3')
  }
  
  constructor(scene : Phaser.Scene) {
    super(scene, 'giger-counter');
    
    this.blips = [
      this.scene.sound.add('giger2'),
      this.scene.sound.add('giger3'),
      this.scene.sound.add('giger1'),
    ]
    this.blipIndex = 0;
  }
  
  public detect() {
    this.blips[this.blipIndex % this.blips.length].play();
  }
}