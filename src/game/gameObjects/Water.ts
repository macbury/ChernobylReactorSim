import Phaser from 'phaser'

const WATER_TEXTURE = 'WATER_TEXTURE';
export const WATER_SIZE = 36;

const COLD_WATER = Phaser.Display.Color.IntegerToColor(0x2596be);
const HOT_WATER = Phaser.Display.Color.IntegerToColor(0xff0000);
const STEAM = Phaser.Display.Color.IntegerToColor(0xffffff);

// Temperature ranges in Celsius
const HOT_TEMP = 270;   // Water enters RBMK at ~270°C
const MIN_TEMP = HOT_TEMP; 
const STEAM_TEMP = 284; // Steam exits at ~284°C

export class Water extends Phaser.GameObjects.Sprite {
  private cooldown: number;
  private _temperature: number;

  public static preload(scene : Phaser.Scene) {
    scene.add.graphics()
      .clear()
      // .fillRect(0, 0, WATER_SIZE, WATER_SIZE)
      .fillStyle(0xffffff, 1)
      .fillRect(2, 2, WATER_SIZE - 4, WATER_SIZE - 4)
      .generateTexture(WATER_TEXTURE, WATER_SIZE, WATER_SIZE)
      .destroy()
  }
  
  constructor(scene : Phaser.Scene) {
    super(scene, 0, 0, WATER_TEXTURE);
    
    scene.add.existing(this);
    scene.physics.add.existing(this, false);
    
    this.setAlpha(0.2)
    this.setTint(COLD_WATER.color)
    this.temperature = MIN_TEMP;
    this.cooldown = 0
  }
  
  public get isSteam() {
    return this.temperature >= STEAM_TEMP;
  }
  
  private set temperature(newTemperature : number) {
    this._temperature = Phaser.Math.Clamp(newTemperature, MIN_TEMP, STEAM_TEMP + 100);

    if (this.isSteam) {
      this.setTint(STEAM.color);
    } else {
      // Cold to hot water: interpolate between blue and red
      const t = (this._temperature - MIN_TEMP) / (STEAM_TEMP - MIN_TEMP);
      const tint = Phaser.Display.Color.Interpolate.ColorWithColor(COLD_WATER, HOT_WATER, 100, t * 100);
      this.setTint(tint.color);
    }
    
    //~280-290°C (536-554°F) in the Chernobyl RBMK reactor.
    // The RBMK design allows the water coolant to boil in the pressure tubes that contain the fuel assemblies. The water enters at around 270°C and exits as steam at about 284°C at the operating pressure of ~70 atmospheres.

    // For comparison:

    // PWR (most common): 300-320°C, kept liquid under high pressure
    // BWR: ~285°C, designed to boil
    // RBMK (Chernobyl type): ~280-290°C, boiling allowed

    // The RBMK's positive void coefficient meant that when more water turned to steam (voids), reactivity increased - one of the design flaws that contributed to the accident.
  }
  
  public get temperature() {
    return this._temperature;
  }
  
  public preUpdate(time : number, delta : number) {
    const speed = this.isSteam ? 300 : 750;
    this.temperature -= delta / speed;
  }
  
  public heat(energy : number) {
    this.temperature += energy;
  }
}