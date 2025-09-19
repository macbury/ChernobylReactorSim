# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Chernobyl Reactor Simulator - an educational tool that visualizes nuclear reactor physics to demonstrate the principles behind the Chernobyl disaster. It's built using Phaser 3 game engine with React and TypeScript.

## Development Commands

```bash
# Install dependencies
yarn install

# Run development server (on http://localhost:8080)
yarn dev

# Build for production
yarn build
```

## Architecture

### Core Technologies
- **Phaser 3.90.0**: 2D physics and rendering engine for the simulation
- **React 19.0.0**: UI framework (currently minimal, prepared for future control panels)
- **TypeScript 5.7.2**: Type-safe development
- **Vite 6.3.1**: Build tooling with hot module replacement

## Important Notes

- Development server runs on port 8080 (configured in `vite/config.dev.mjs`)
- Assets (sounds) are stored in `public/assets/`
- The simulation demonstrates exponential neutron multiplication when control rods are removed
- Audio feedback includes Geiger counter clicks and control rod impact sounds