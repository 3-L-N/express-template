# AGENTS.md

## Project overview

This repository is a minimal Express.js website template.

## Project structure

- `website/` All code is in here
- `website/config/index.mjs` Entry point
- `website/config/` Server configuration files
- `website/test/` Unit and integration tests

## Code Style

- Only use ESM, not commonJS
- Comment complex functions with JSDOC
- Prettier code formatting is automatically applied. You do not need to do this.

## Testing

- Node test runner is used with the `describe/it` syntax
- Integration tests should use Supertest
- Validate changes with `npm test`
- After writing code make tests for it to achieve 100% test coverage
