# AGENTS.md

## Project overview

This repository is a minimal Express.js website template.

## `website/` structure

This folder contains the website:

- `config/` Server configuration files
- `config/index.mjs` Entry point
- `test/` Unit and integration tests
- `routes.mjs` and `controllers/` Serves dynamic content
- `public/` serves static content

## Code Style

- Only use ESM, not commonJS
- Dont use anomonous functions. Only use them for `describe/it` sections in tests
- Comment complex functions with JSDOC
- Linting is automaticlly applied before each commit. You dont need to worry about this.

## Testing

- Node test runner is used with the `describe/it` syntax
- Integration tests should use Supertest
- Check that changes dont create new issues with `npm test`
- Target test coverage is 100%
- After making or editing code, once it is accepted by the user create tests for it
