import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import {
  lstat,
  mkdir,
  mkdtemp,
  readFile,
  rm,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { build, engine } from "../../config/build.mjs";

describe("Build engine", () => {
  it("renders and minifies an EJS template", async () => {
    const directory = await mkdtemp(join(tmpdir(), "express-template-engine-"));
    const templatePath = join(directory, "page.ejs");

    await writeFile(templatePath, '<main class="  wide  "><%= name %></main>');

    try {
      await new Promise((resolve, reject) => {
        engine(templatePath, { name: "Test" }, (error, html) => {
          if (error) {
            reject(error);
            return;
          }
          assert.equal(html, '<main class="wide">Test</main>');
          resolve();
        });
      });
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });

  it("passes template rendering errors to the callback", async () => {
    await new Promise((resolve) => {
      engine(join(tmpdir(), "missing-template.ejs"), {}, (error) => {
        assert.ok(error);
        resolve();
      });
    });
  });
});

describe("Static file build", () => {
  const originalDirectory = process.cwd();
  let temporaryDirectory;

  afterEach(async () => {
    process.chdir(originalDirectory);
    if (temporaryDirectory) {
      await rm(temporaryDirectory, { recursive: true, force: true });
      temporaryDirectory = undefined;
    }
  });

  it("cleans old output and builds supported and linked files", async (t) => {
    temporaryDirectory = await mkdtemp(
      join(tmpdir(), "express-template-build-"),
    );
    await mkdir(join(temporaryDirectory, "views/public-src/nested"), {
      recursive: true,
    });
    await mkdir(join(temporaryDirectory, "views/private-src"), {
      recursive: true,
    });
    await mkdir(join(temporaryDirectory, "views/public"), { recursive: true });
    await mkdir(join(temporaryDirectory, "views/private"), { recursive: true });

    await writeFile(
      join(temporaryDirectory, "views/public-src/index.html"),
      "<h1>  Hello  </h1>",
    );
    await writeFile(
      join(temporaryDirectory, "views/public-src/nested/script.js"),
      "const answer=42; console.log(answer);",
    );
    await writeFile(
      join(temporaryDirectory, "views/public-src/nested/page.ejs"),
      '<main class="  wide  ">Hello</main>',
    );
    await writeFile(
      join(temporaryDirectory, "views/public-src/favicon.ico"),
      "icon",
    );
    await writeFile(
      join(temporaryDirectory, "views/private-src/secret.txt"),
      "secret",
    );

    await writeFile(
      join(temporaryDirectory, "views/public/stale.txt"),
      "stale",
    );
    await writeFile(
      join(temporaryDirectory, "views/private/stale.txt"),
      "stale",
    );

    process.chdir(temporaryDirectory);
    t.mock.method(console, "log", function discardLog() {});

    await build();

    assert.equal(
      await readFile("views/public/nested/script.js", "utf8"),
      "const answer=42;console.log(42);",
    );
    assert.equal(
      await readFile("views/public/nested/page.html", "utf8"),
      '<main class="wide">Hello</main>',
    );

    const htmlLink = await lstat("views/public/index.html");
    const faviconLink = await lstat("views/public/favicon.ico");
    const privateLink = await lstat("views/private/secret.txt");
    assert.ok(htmlLink.isSymbolicLink());
    assert.ok(faviconLink.isSymbolicLink());
    assert.ok(privateLink.isSymbolicLink());

    await assert.rejects(readFile("views/public/stale.txt", "utf8"), {
      code: "ENOENT",
    });
    await assert.rejects(readFile("views/private/stale.txt", "utf8"), {
      code: "ENOENT",
    });
  });

  it("reports the source and destination when rendering fails", async () => {
    temporaryDirectory = await mkdtemp(
      join(tmpdir(), "express-template-render-error-"),
    );
    await mkdir(join(temporaryDirectory, "views/public-src"), {
      recursive: true,
    });
    await mkdir(join(temporaryDirectory, "views/private-src"), {
      recursive: true,
    });
    await writeFile(
      join(temporaryDirectory, "views/public-src/broken.ejs"),
      "<%= ",
    );

    process.chdir(temporaryDirectory);

    await assert.rejects(build(), (error) => {
      assert.match(
        error.message,
        /Could not build .*broken\.ejs.*into .*broken\.html/,
      );
      assert.ok(error.cause);
      assert.match(error.cause.message, /Failed to render .*broken\.ejs/);
      assert.ok(error.cause.cause);
      return true;
    });
  });
});
