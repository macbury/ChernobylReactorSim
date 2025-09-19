import React, {useEffect, useState} from "react"
import {EventBus} from "../game/EventBus.ts";

export function Stats() {
  const [neutrons, setNeutrons] = useState(0)
  
  useEffect(() => {
    const emittedHandler = EventBus.on("neutron:updated", (count) => {
      setNeutrons(count)
    });
    
    return () => {
      setNeutrons(0)
      emittedHandler.destroy()
    }
  }, [setNeutrons])
  
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 backdrop-blur-md bg-gray-900/80 text-white px-6 py-3 rounded-xl shadow-2xl border border-gray-700">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-gray-300">Neutrons:</span>
          <span className="text-xl font-bold text-yellow-400">{neutrons}</span>
        </div>
      </div>
    </div>
  )
}