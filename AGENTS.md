# AGENTS.md

## Project overview

This repository is a minimal Express.js website template.

## Project structure
- `website/` All code is in here
- `website/index.mjs` Entry point
- `website/config/` Server configuration files
- `website/config/` Unit and integration tests

## Code Style
- Only use ESM, not commonJS
- Comment complex functions with JSDOC


## Testing
- Node test runner is used with the `describe/it` syntax
- Integration tests should use Supertest
- Validate changes with `pnpm test`
- After writing code make tests for it to achieve 100% test coverage
