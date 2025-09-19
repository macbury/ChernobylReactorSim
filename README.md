# Chernobyl Reactor Simulator

## Abstract

This educational simulator provides an interactive visualization of the nuclear physics principles that led to the Chernobyl disaster, making complex reactor dynamics accessible through visual storytelling. By observing particle movements and chain reactions in real-time, users can develop an intuitive understanding of how nuclear reactors operate and what makes them potentially dangerous.

The simulation demonstrates the delicate balance required to maintain a controlled nuclear reaction. Users witness how neutrons released from splitting uranium atoms can trigger a cascade of further fissions, creating the chain reaction that powers nuclear reactors. Through interactive control rods that can be raised or lowered, the simulator shows how operators regulate this process by absorbing excess neutrons to prevent runaway reactions.

Most critically, the simulation models the unique and fatal flaw of the RBMK reactor design used at Chernobyl: the positive void coefficient. As water in the reactor heats and turns to steam, instead of slowing the reaction as in most reactor designs, the RBMK actually accelerates it. This creates a dangerous feedback loop where increasing heat leads to more steam, which increases reactivity, generating even more heat. This counterintuitive behavior, combined with operator errors and design flaws, transformed what should have been a routine safety test into history's worst nuclear accident.

The visual representation shows neutrons as moving particles, fissile uranium as reactive elements that split when struck, and water as both a neutron moderator and heat sink. Control rods appear as barriers that can capture neutrons, while moderator rods influence neutron behavior. The transformation of water to steam is depicted through color changes, allowing users to see the dangerous steam voids form and understand their destabilizing effect on the reactor.

Through this interactive experience, users gain insight into:
- Why nuclear reactors require constant, precise control to remain stable
- How the absence of control mechanisms leads to exponential power increases
- Why certain reactor designs are inherently safer than others
- The cascading nature of nuclear accidents and how small changes can have catastrophic consequences
- The fundamental tension between power generation and safety in nuclear engineering

The simulator serves as both an educational tool and a memorial, helping people understand not just what happened at Chernobyl, but why it happened, through direct interaction with the underlying physics rather than abstract explanations.

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