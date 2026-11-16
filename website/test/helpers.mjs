/**
 * @file Helper functions used in tests.
 */

/**
 * Silence output to the terminal during this test
 * @param {object} t - The test context object provided by the test runner.
 */
export function silenceOutput(t) {
  t.mock.method(console, "log", function discardLog() {});
}
