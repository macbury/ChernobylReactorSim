import {ControlRod} from "../game/gameObjects/ControlRod.ts";
import {useCallback, useState} from "react";

export interface IRodSliderProps {
  rod: ControlRod
}

export default function RodSlider({ rod } : IRodSliderProps) {
  const [progress, setProgress] = useState(rod.position)
  
  const onChange = useCallback((e : any) => {
    const position = e.target.value / 100.0
    rod.position = position
    setProgress(position)
  }, [setProgress, rod])
  
  return (
    <div className="flex items-center space-x-3">
      <span className="text-sm font-medium text-gray-700 w-24 text-right">Control Rod:</span>
      <input
        type="range"
        min="0"
        max="100"
        value={progress * 100}
        onChange={onChange}
        className="
          flex-1
          h-2
          bg-gray-200
          rounded-lg
          appearance-none
          cursor-pointer
        "
      />
      <span className="text-sm font-medium text-gray-700 w-12 text-left">
        {Math.round(progress * 100)}%
      </span>
    </div>
  )
}