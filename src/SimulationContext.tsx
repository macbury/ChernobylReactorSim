import React, {createContext, useContext, useEffect, useLayoutEffect, useState} from "react";
import { AUTO, Game, Types } from 'phaser';
import {ReactorSimulator} from "./game/scenes/ReactorSimulator.ts";
import {EventBus} from "./game/EventBus.ts";

// Find out more information about the Game Config at:
// https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config: Types.Core.GameConfig = {
  type: AUTO,
  scale: {
    mode: Phaser.Scale.RESIZE,
    width: '100%',
    height: '100%' 
  },
  parent: 'game-container',
  backgroundColor: '#fff',
  scene: [
    ReactorSimulator
  ],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0, x: 0 },
      debug: false
    }
  }
};

export type SimulationContextType = {
  game: Game,
  scene: ReactorSimulator | null,
};

export const SimulationContext = createContext<SimulationContextType>(null);

export interface ISimulationProviderProps {
  children: React.ReactNode,
}

export function SimulationProvider({ children }: ISimulationProviderProps) {
  const [ctx, setCtx] = useState<SimulationContextType>(null);
  
  useLayoutEffect(() => {
    const game = new Game(config);
    setCtx({ game, scene: null })
    
    const handler = EventBus.on("scene:ready", (scene : T) => {
      setCtx({ game, scene })
    })
    
    return () => {
      handler.destroy()
      game.destroy(true);
    }
  }, [setCtx])
  
  return (
    <SimulationContext.Provider value={ctx}>
      {children}
    </SimulationContext.Provider>
  )
}

export function useCurrentGame() {
  return useContext(SimulationContext)?.game;
}

export function useCurrentScene<T extends ReactorSimulator>() : T {
  return useContext(SimulationContext)?.scene as unknown as T;
}

export function GameCanvas() {
  return <div id="game-container"></div>
}