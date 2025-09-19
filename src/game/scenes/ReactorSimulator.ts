import {Scene} from 'phaser';
import {EventBus} from '../EventBus';
import {Neutron, NeutronType} from "../gameObjects/Neutron.ts";
import {MaterialType, Nucleus, NUCLEUS_SIZE} from "../gameObjects/Nucleus.ts";
import {GigerCounter} from "../gameObjects/GigerCounter.ts";
import {ControlRodsController} from "../ControlRodsController.ts";
import {Water, WATER_SIZE} from "../gameObjects/Water.ts";
import {ModeratorController} from "../ModeratorController.ts";

const REACTOR_WIDTH = 56;
const REACTOR_HEIGHT = 24;
const REACTOR_SIZE = REACTOR_WIDTH * REACTOR_HEIGHT;

export class ReactorSimulator extends Scene {
  public neutrons: Phaser.Physics.Arcade.Group;
  private nuclei: Phaser.Physics.Arcade.Group;
  private gigerCounter: GigerCounter;
  public readonly controlRods: ControlRodsController
  public readonly moderator: ModeratorController
  private water: Phaser.Physics.Arcade.Group;
  private core: Nucleus[][];
  
  constructor () {
    super('ReactorSimulator');
    this.controlRods = new ControlRodsController(this, 8, REACTOR_WIDTH)
    this.moderator = new ModeratorController(this, 7, REACTOR_WIDTH)
  }

  preload () {
    GigerCounter.preload(this);
    Water.preload(this);
    Nucleus.preload(this);
    Neutron.preload(this);
    ModeratorController.preload(this)
    ControlRodsController.preload(this)
  }

  create () {
    this.gigerCounter = new GigerCounter(this);

    this.water = this.physics.add.group({
      classType: Water
    })

    this.nuclei = this.physics.add.group({
      classType: Nucleus,
    })

    this.neutrons = this.physics.add.group({
      classType: Neutron,
      createCallback: (_neutron) => {
        this.gigerCounter.detect();
        EventBus.emit('neutron:updated', this.neutronCount)
      },
      removeCallback: (_neutron) => {
        EventBus.emit('neutron:updated', this.neutronCount)
      },
    })
    
    const offsetX = 0//-Math.round(width/2);
    const offsetY = 0//-Math.round(height/2);
    const tileSize = WATER_SIZE;
    const tileOffset = (tileSize / 2) - (NUCLEUS_SIZE / 2);

    this.core = Array(REACTOR_WIDTH).fill().map(() => Array(REACTOR_HEIGHT).fill(null));
    
    for (let x = 0; x < REACTOR_WIDTH; x++) {
      for (let y = 0; y < REACTOR_HEIGHT; y++) {
        const waterTile = new Water(this)
        this.water.add(waterTile);
        waterTile.setPosition((x * tileSize), (y * tileSize));
        
        const nucleus = new Nucleus(this, MaterialType.NonFissile);
        this.nuclei.add(nucleus);
        nucleus.setPosition((x * tileSize), (y * tileSize));
        this.core[x][y] = nucleus;
      }
    }
    
    // 3-5% U-235 in typical commercial reactor fuel.
    // ~2% U-235 in the Chernobyl RBMK reactor.
    let fissileMaterialCount = Math.round(REACTOR_SIZE * 0.08);

    while(fissileMaterialCount > 0) {
      const x = Phaser.Math.Between(0, REACTOR_WIDTH - 1);
      const y = Phaser.Math.Between(5, REACTOR_HEIGHT - 1);
      if (this.core[x][y].isFissile) {
        continue;
      }
      this.core[x][y].materialType = MaterialType.Fissile;
      fissileMaterialCount--;
    }
    //
    // for (let i = 0; i < 300; i++) {
    //   const neutron = new Neutron(this);
    //   this.neutrons.add(neutron);
    //   neutron.setPosition(30, i + 300);
    //   neutron.moveForward(0)
    // }
    
    this.controlRods.setup(this.neutrons)
    this.moderator.setup(this.neutrons)
    this.physics.add.overlap(this.nuclei, this.neutrons, this.onNeutronHitNucleus.bind(this))
    this.physics.add.overlap(this.water, this.neutrons, this.onNeutronHitWater.bind(this))
    
    this.prepareDecay()

    const centerX = (tileSize * REACTOR_WIDTH / 2);
    const centerY = (tileSize * REACTOR_HEIGHT / 2);
    this.cameras.main.centerOn(centerX, centerY)
    this.cameras.main.zoom = 0.8;
    EventBus.emit('scene:ready', this);
  }
  
  private onNeutronHitNucleus(nucleus : Nucleus, neutron : Neutron) {
    if (neutron.neutronType == NeutronType.FastNeutron) {
      // super low chance of fission, needs to hit moderator first
      return
    } else if (nucleus.undergoFission(neutron, this.neutrons)) {
      this.replaceFuel()
    }
  }
  
  private onNeutronHitWater(water: Water, neutron: Neutron) {
    // Fast neutrons (~2 MeV) deposit more energy than thermal (~0.025 eV)
    // Scale values to achieve realistic 270°C to 284°C temperature range
    const energy = neutron.neutronType == NeutronType.FastNeutron ? 0.6 : 0.1;
    water.heat(energy);
    
    if (water.isSteam && neutron.neutronType == NeutronType.ThermalNeutron) {
      neutron.power += Phaser.Math.FloatBetween(0, 1); // steam allows to travel further
      
      if (Phaser.Math.FloatBetween(0.0, 1.0) < 0.01 && !neutron.isCoolDown) {
        const extraNeutron = new Neutron(this, NeutronType.ThermalNeutron);
        this.neutrons.add(extraNeutron);
        extraNeutron.setPosition(water.x, water.y);
        extraNeutron.moveInRandomDirection()
        extraNeutron.needToCoolDown();
        neutron.needToCoolDown();
      }
    } else if (neutron.neutronType == NeutronType.ThermalNeutron) {
      neutron.power -= Phaser.Math.FloatBetween(0, 1);
    } else if (neutron.neutronType == NeutronType.FastNeutron) {
      if (Phaser.Math.FloatBetween(0.0, 1.0) < 0.1 && !neutron.isCoolDown) {
        neutron.neutronType = NeutronType.ThermalNeutron;
      }
    }
  }
  
  private get neutronCount() {
    return this.neutrons.getChildren().length;
  }
  
  private getRandomNucleusOfType(materialType : MaterialType, offsetY = 0) : Nucleus {
    while (true) {
      const x = Phaser.Math.Between(0, REACTOR_WIDTH - 1);
      const y = Phaser.Math.Between(offsetY, REACTOR_HEIGHT - 1 - offsetY);
      const randomNucleus = this.core[x][y]
      // const n = this.nuclei.getChildren()
      // const randomNucleus : Nucleus = n[Phaser.Math.Between(0, n.length - 1)] as Nucleus;
      if (randomNucleus?.materialType == materialType) {
        return randomNucleus;
      }
    }
  }
  
  private replaceFuel() {
    const randomNucleus : Nucleus = this.getRandomNucleusOfType(MaterialType.NonFissile, 2);
    randomNucleus.materialType = MaterialType.Fissile;
  }
  
  private prepareDecay() {
    const halfLife = 300;
    const delay = Phaser.Math.Between(halfLife, halfLife * 2);

    this.time.addEvent({
      delay: delay,
      callback: () => {
        const randomNucleus : Nucleus = this.getRandomNucleusOfType(MaterialType.NonFissile);

        const neutron : Neutron = new Neutron(this, NeutronType.ThermalNeutron);
        this.neutrons.add(neutron);
        neutron.setPosition(randomNucleus.x, randomNucleus.y);
        neutron.moveInRandomDirection()
        
        this.prepareDecay()
      },
      callbackScope: this,
    })
  }
}
