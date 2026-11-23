# AGENTS.md

## Project overview

This repository is a minimal Express.js website template.
how

## File structure

### `website/` - The website source code:

- `config/` Server configuration files
- `config/index.mjs` Entry point
- `test/` Unit and integration tests
- `routes.mjs` and `controllers/` Serves dynamic content

### `website/views` - Front end

Has front end resources including .ejs files which are rendered before being shown.

- `/public-src` and `/private-src` contain static files which rendered and put in `/public` and `/private`
- `/public` has static files that are allways served. For example the URL "/about" will serve "/about.ejs"
- `/private` has static files that can be sent by using controllers
- `/dynamic` has dynamic .mjs files that are used by controllers

## Code Style

- Only use ESM, not commonJS
- Don't use anomonous functions. Only use them for `describe/it` sections in tests
- Use `async/await`, not `.then/.catch`
- Comment complex functions with JSDOC
- Linting is automaticlly applied before each commit. You dont need to worry about this.

## Testing

- Node test runner is used with the `describe/it` syntax
- Integration tests should use Supertest
- Check that changes dont create new issues with `npm test`
- Target test coverage is 100%
- After making or editing code, once it is accepted by the user create tests for it
