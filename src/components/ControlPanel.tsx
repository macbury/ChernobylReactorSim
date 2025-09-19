import {useCurrentScene} from "../SimulationContext.tsx";
import {useState} from "react";
import RodSlider from "./RodSlider.tsx";
import {Stats} from "./Stats.tsx";

export default function ControlPanel() {
  const currentScene = useCurrentScene();
  const controlRods = currentScene.controlRods
  const [isExpanded, setIsExpanded] = useState(false);
  
  const rodsControls = controlRods.all.map((rod, index) => (
    <RodSlider key={index} rod={rod} />
  ))

  return (
    <div
      className={`fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[70%] backdrop-blur-md bg-white/80 rounded-b-2xl shadow-2xl transition-transform duration-300 ease-in-out ${
        isExpanded ? 'translate-y-0' : '-translate-y-[calc(100%-2rem)]'
      }`}
    >
      
      <div className="grid grid-cols-2 gap-4">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Reactor Control Panel</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-2">
                {rodsControls}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Handle bar for dragging */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full py-3 flex justify-center items-center hover:bg-gray-100/50 rounded-b-2xl transition-colors cursor-pointer"
      >
        <div className="w-12 h-1 bg-gray-400 rounded-full" />
      </button>
    </div>
  )
}