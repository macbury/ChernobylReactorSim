import {useCurrentScene} from "../SimulationContext.tsx";

export default function WaitForScene({ children }) {
  const scene = useCurrentScene();
  
  if (!scene) {
    return null
  }
  
  return <>{children}</>
}