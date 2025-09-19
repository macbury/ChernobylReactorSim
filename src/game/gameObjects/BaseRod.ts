import Phaser from 'phaser';

export const CONTROL_ROD_SIZE = 6;
export const CONTROL_ROD_HEIGHT = 900;

export abstract class BaseRod extends Phaser.Physics.Arcade.Sprite {
  protected _targetPosition: number; // value between 0.0 and 1.0 where 1 is fully inserted
  private speed: number;
  
  constructor(scene : Phaser.Scene, texture : string, speed : number) {
    super(scene, 0, 0, texture);

    scene.add.existing(this);
    scene.physics.add.existing(this, false);
    this.setOrigin(0.5, 0.05);
    // this.setSize(CONTROL_ROD_SIZE, 900)
    // this.setDisplaySize(CONTROL_ROD_SIZE, CONTROL_ROD_HEIGHT)
    this._targetPosition = 1.0
    this.speed = speed;
  }
  
  public set position(nextPosition : number) {
    if (this._targetPosition === nextPosition) {
      return;
    }
    
    const delta = nextPosition - this._targetPosition;
    this.setVelocityY(delta < 0 ? -this.speed : this.speed)
    this._targetPosition = nextPosition;
  }
  
  public get position() {
    return this._targetPosition;
  }
  
  public get currentPosition() {
    return 1.0 - (Math.abs(this.y) / CONTROL_ROD_HEIGHT)
  }
  
  public preUpdate(time : number, delta : number) {
    const diff = Math.abs(this.currentPosition - this._targetPosition);
    if (diff < 0.01) {
      this.setVelocityY(0)
    }
  }
  
  public abstract hit() {
  }
}