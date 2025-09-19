# Chernobyl Reactor Simulator

## Abstract

This is an interactive, simplified simulation of nuclear reactor physics designed to demonstrate the fundamental principles behind the Chernobyl disaster. Built using Phaser 3 game engine with React and TypeScript, this educational tool visualizes neutron interactions, nuclear fission chain reactions, and control rod mechanics in a 2D reactor core environment.

The simulation models key nuclear physics concepts including:
- **Neutron emission and decay**: Free neutrons with limited lifetimes that can trigger fission events
- **Nuclear fission chain reactions**: Fissile uranium-235 nuclei that release multiple neutrons when struck
- **Control rod absorption**: Cadmium/boron control rods that absorb neutrons to regulate reactivity
- **Fuel enrichment cycles**: Automatic replenishment of fissile material representing fuel rod behavior
- **Spontaneous neutron generation**: Background neutron flux from non-fissile materials

The reactor core consists of a 42×24 grid of nuclear fuel assemblies with approximately 7% U-235 enrichment (higher than typical commercial reactors to demonstrate criticality). Visual and audio feedback includes Geiger counter clicks for neutron detection and impact sounds for control rod interactions. The simplified physics model demonstrates how removal of control rods can lead to exponential neutron multiplication - the fundamental mechanism behind reactor power excursions like the one that caused the Chernobyl disaster.

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