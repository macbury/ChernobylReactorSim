import {ModeratorRod} from "./gameObjects/ModeratorRod.ts";
import {Neutron, NeutronType} from "./gameObjects/Neutron.ts";
import {WATER_SIZE} from "./gameObjects/Water.ts";

export class ModeratorController {
  private group: Phaser.Physics.Arcade.Group;
  private scene: Phaser.Scene;
  public readonly count: number;
  private rods: ModeratorRod[];
  private width: number;
  private sectorSize: number;
  
  public static preload(scene : Phaser.Scene) {
    ModeratorRod.preload(scene)
  }
  
  constructor(scene : Phaser.Scene, count : number, width : number) {
    this.scene = scene;
    this.count = count
    this.rods = Array(count).fill(null);
    this.width = width;
    this.sectorSize = Math.ceil(width / count);
  }
  
  public get all() {
    return this.rods;
  }
  
  public setup(neutronsGroup : Phaser.Physics.Arcade.Group) {
    this.group = this.scene.physics.add.group({
      classType: ModeratorRod
    })
    
    const sectorWidth = this.sectorSize * WATER_SIZE;
    const sX = WATER_SIZE * 4 - WATER_SIZE/2;

    for (let x = 0; x < this.count; x++) {
      const controlRod = new ModeratorRod(this.scene);
      this.rods[x] = controlRod;
      this.group.add(controlRod);
      controlRod.setPosition((x * sectorWidth) + sX, 0)
      // controlRod.position = 0.5
    }
    
    this.scene.physics.add.overlap(neutronsGroup, this.group, this.onNeutronHitControlRod.bind(this))
  }
  
  private onNeutronHitControlRod(neutron : Neutron, controlRod : ModeratorRod) {
    if (neutron.neutronType != NeutronType.FastNeutron) {
      return;
    }
    
    neutron.moderateAndBounce()
    controlRod.hit();
    
    // neutron.destroy();
  }
}