import Phaser from 'phaser';
import Vector2 = Phaser.Math.Vector2;

const THERMAL_NEUTRON_SPEED = 150;
const FAST_NEUTRON_SPEED = 400;
const THERMAL_NEUTRON_TEXTURE_NAME = "thermal_neutron";
const FAST_NEUTRON_TEXTURE_NAME = "fast_neutron";
const DECAY_SECONDS = 8;

export enum NeutronType {
  ThermalNeutron = "ThermalNeutron",
  FastNeutron = "FastNeutron",
}

export class Neutron extends Phaser.Physics.Arcade.Sprite {
  private _power: number;
  private _neutronType: NeutronType
  private coolDown: number;
  
  public static preload(scene : Phaser.Scene) {
    scene.add.graphics()
      .fillStyle(0x21130d, 1)
      .fillCircle(5, 5, 5)
      .generateTexture(THERMAL_NEUTRON_TEXTURE_NAME, 10, 10)
      .destroy()
    
    scene.add.graphics()
      .fillStyle(0xffffff, 1)
      .fillCircle(5, 5, 5)
      .lineStyle(2, 0x21130d, 1)
      .strokeCircle(5, 5, 5)
      .generateTexture(FAST_NEUTRON_TEXTURE_NAME, 10, 10)
      .destroy()
  }
  
  constructor(scene : Phaser.Scene, neutronType : NeutronType) {
    super(scene, 0, 0, THERMAL_NEUTRON_TEXTURE_NAME);

    this.alpha = 0.0;
    this.neutronType = neutronType
    scene.add.existing(this);
    scene.physics.add.existing(this, false);
    
    scene.time.delayedCall(DECAY_SECONDS * 1000, this.destroy, [], this)
    scene.tweens.add({
      targets: [this],
      duration: 150,
      alpha: { from: 0.0, to: 1.0 },
      scale: { from: 0.0, to: 1.0 },
    })
  }
  
  public set power(newPower : number) {
    this._power = Phaser.Math.Clamp(newPower, 0, 200);
    // console.log(this._power)
    if (this._power == 0) {
      this.destroy()
    }
  }
  
  public set neutronType(neutropType : NeutronType) {
    this._neutronType = neutropType;
    if (this._neutronType == NeutronType.FastNeutron) {
      this.power = 200
      this.setTexture(FAST_NEUTRON_TEXTURE_NAME)
    } else {
      this.power = 130
      this.setTexture(THERMAL_NEUTRON_TEXTURE_NAME)
    }
    this.needToCoolDown() 
  }
  
  public needToCoolDown() {
    this.coolDown = 2000.0; // for two seconds should not spawn thermal
  }
  
  public preUpdate(time : number, delta : number) {
    if (this.coolDown > 0.0) {
      this.coolDown -= delta;
      if (this.coolDown < 0.0) {
        this.coolDown = 0.0
      }
    }
  }
  
  public get isCoolDown() {
    return this.coolDown > 0.0;
  }
  
  public get neutronType() {
    return this._neutronType;
  }
  
  private get speed() {
    if (this._neutronType == NeutronType.FastNeutron) {
      return FAST_NEUTRON_SPEED
    } else {
      return THERMAL_NEUTRON_SPEED
    }
  }
  
  public get power() {
    return this._power;
  }
  
  public get currentAngle() {
    return Math.atan2(this.body!.velocity.x, this.body!.velocity.y);
  }
  
  public moderateAndBounce() {
    this.neutronType = NeutronType.ThermalNeutron;
    // Scatter at random angle (elastic scattering in moderator)
    this.moveInRandomDirection()
  }
  
  public moveInRandomDirection() {
    const angle = Phaser.Math.FloatBetween(-Math.PI, Math.PI);
    this.body!.setVelocity(Math.cos(angle) * this.speed, Math.sin(angle) * this.speed);
  }
  
  public moveForward(incidentAngle : number) {
    const angle = incidentAngle + Phaser.Math.FloatBetween(-Math.PI/3, Math.PI/3); // move in 60 degree cone forward
    this.body!.setVelocity(Math.cos(angle) * this.speed, Math.sin(angle) * this.speed);
  }
}