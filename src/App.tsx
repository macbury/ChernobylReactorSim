import {GameCanvas} from "./SimulationContext.tsx";
import WaitForScene from "./components/WaitForScene.tsx";
import ControlPanel from "./components/ControlPanel.tsx";
import {Stats} from "./components/Stats.tsx";

function App() {
  return (
    <div id="app">
      <GameCanvas />
      <WaitForScene>
        <ControlPanel />
        <Stats />
      </WaitForScene>
    </div>
  )
}

export default App
