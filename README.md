# Chernobyl Reactor Simulator

🔴 **[Live Demo: https://macbury.github.io/ChernobylReactorSim/](https://macbury.github.io/ChernobylReactorSim/)**

## What This Simulates

An interactive 2D visualization of nuclear chain reactions demonstrating why the Chernobyl RBMK reactor exploded. Watch neutrons trigger fission events in uranium-235, creating cascading chain reactions that can spiral out of control when safety systems fail.

### Key Physics Modeled

- **Neutron moderation**: Fast neutrons must slow down in water to cause fission
- **Chain reactions**: Each fission releases 2-3 new neutrons, enabling exponential growth
- **Control rods**: Absorb neutrons to regulate or stop the reaction
- **Positive void coefficient**: The fatal RBMK flaw - steam bubbles increase reactivity instead of decreasing it, creating runaway feedback

### Simplifications

This educational model uses a 56×24 grid with 8% enriched uranium (vs 2% in real RBMK) for clearer visualization. It models only two neutron speeds (fast/thermal) rather than the full energy spectrum, and omits complex effects like xenon poisoning and delayed neutron precursors. Water instantly becomes steam when heated, demonstrating the dangerous void formation without modeling actual thermodynamics.

## Running the Simulation

```bash
# Install dependencies
yarn install

# Run development server
yarn dev

# Build for production
yarn build
```

## Technical Stack
- **Phaser 3**: 2D physics and rendering engine
- **React**: UI framework for future control panels
- **TypeScript**: Type-safe development
- **Vite**: Fast build tooling