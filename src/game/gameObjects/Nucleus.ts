import Phaser from 'phaser'
import {Neutron, NeutronType} from "./Neutron.ts";

const URANIUM_NUCLEUS_TEXTURE = 'URANIUM_NUCLEUS_TEXTURE';
const NUCLEUS_TEXTURE = 'NUCLEUS_TEXTURE';
const XENON_TEXTURE = "XENON_TEXTURE";

export enum MaterialType {
  Fissile = 'Fissile',
  NonFissile = 'NonFissile',
  Xenon = 'Xenon',
}

const NON_FISSLE_ALPHA = 0.3;
export const NUCLEUS_SIZE = 24;

export class Nucleus extends Phaser.GameObjects.Sprite {
  private isFissile: boolean;
  private _materialType: MaterialType;

  public static preload(scene : Phaser.Scene) {
    scene.add.graphics()
      .fillStyle(0x278af4, 1)
      .fillCircle(NUCLEUS_SIZE/2, NUCLEUS_SIZE/2, NUCLEUS_SIZE/2)
      .generateTexture(URANIUM_NUCLEUS_TEXTURE, NUCLEUS_SIZE, NUCLEUS_SIZE)
      .destroy()
    
    scene.add.graphics()
      .fillStyle(0xbbbbbb, 1)
      .fillCircle(NUCLEUS_SIZE/2, NUCLEUS_SIZE/2, NUCLEUS_SIZE/2)
      .generateTexture(NUCLEUS_TEXTURE, NUCLEUS_SIZE, NUCLEUS_SIZE)
      .destroy()
    
    scene.add.graphics()
      .fillStyle(0x000000, 1)
      .fillCircle(NUCLEUS_SIZE/2, NUCLEUS_SIZE/2, NUCLEUS_SIZE/2)
      .generateTexture(XENON_TEXTURE, NUCLEUS_SIZE, NUCLEUS_SIZE)
      .destroy()
  }
  
  constructor(scene : Phaser.Scene, materialType : MaterialType = MaterialType.Fissile) {
    super(scene, 0, 0, URANIUM_NUCLEUS_TEXTURE);
    
    scene.add.existing(this);
    scene.physics.add.existing(this, false);
    
    this.materialType = materialType;
  }
  
  public get materialType() {
    return this._materialType;
  }
  
  public set materialType(newMaterialType : MaterialType) {
    this._materialType = newMaterialType;
    
    if (this._materialType === MaterialType.Xenon) {
      this.setTexture(XENON_TEXTURE)
      this.isFissile = false;
      this.alpha = 1.0;
    } else if (this._materialType === MaterialType.Fissile) {
      this.enrich();
      this.setTexture(URANIUM_NUCLEUS_TEXTURE)
    } else {
      this.setTexture(NUCLEUS_TEXTURE)
      this.alpha = NON_FISSLE_ALPHA;
      this.isFissile = false;
    }
  }
  
  private enrich(animate = true) {
    if (animate) {
      this.isFissile = true;
      this.scene.tweens.add({
        targets: [this],
        alpha: 1.0,
        duration: 250
      })
    } else {
      this.isFissile = true;
      this.alpha = this.isFissile ? 1.0 : NON_FISSLE_ALPHA;
      return;
    }
  }
  
  public undergoFission(incidentNeutron : Neutron, neutronsGroup : Phaser.Physics.Arcade.Group) : boolean {
    if (this._materialType == MaterialType.NonFissile) {
      return false;
    } else if (this._materialType == MaterialType.Xenon) {
      incidentNeutron.destroy();
      this.materialType = MaterialType.NonFissile;
      return false;
    }
    
    this.isFissile = false;
    this.materialType = MaterialType.NonFissile;
    this.scene.tweens.add({
      targets: [this],
      alpha: NON_FISSLE_ALPHA,
      duration: 300,
    })
    
    // const replaceFuelTime = Phaser.Math.Between(2000, 5000)
    // this.scene.time.delayedCall(replaceFuelTime, this.enrich, [], this)

    const incidentAngle = incidentNeutron.currentAngle;
    incidentNeutron.destroy()
    
    // Average 2.4 neutrons per U-235 fission (realistic distribution)
    const rnd = new Phaser.Math.RandomDataGenerator();
    const neutronCount = rnd.weightedPick([2,2,2,3,3,3]);

    for (let i = 0; i < neutronCount; i++) {
      // 0.65% chance of delayed neutron
      const isDelayed = Math.random() < 0.0065;

      if (isDelayed) {
        // Delayed neutron: wait 0.2 to 55 seconds
        const delay = Phaser.Math.Between(200, 55000); // milliseconds

        this.scene.time.delayedCall(delay, () => {
          const delayedNeutron = new Neutron(neutronsGroup.scene, NeutronType.ThermalNeutron); // Lower energy
          neutronsGroup.add(delayedNeutron);
          delayedNeutron.setPosition(this.x, this.y);
          delayedNeutron.moveInRandomDirection(); // Random, not forward
        });
      } else {
        // Prompt neutron: immediate
        const promptNeutron = new Neutron(neutronsGroup.scene, NeutronType.FastNeutron);
        neutronsGroup.add(promptNeutron);
        promptNeutron.setPosition(this.x, this.y);
        promptNeutron.moveForward(incidentAngle);
      }
    }
    
    // 12% chance of fission producing Iodine-135 that decays to Xenon-135
    if (Math.random() < 0.12) {
      const delayRandom = Phaser.Math.Between(2000, 5000);
      this.scene.time.delayedCall(delayRandom, this.decayToXenon, [], this)
    }
    
    return true
  }
  
  private decayToXenon() {
    this.materialType = MaterialType.Xenon;
  }
}