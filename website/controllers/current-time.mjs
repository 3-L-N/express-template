export function currentTimeController(req, res) {
  const currentTime = new Date().toLocaleString();
  res.sendDynamicFile("current-time", {
    currentTime,
  });
}
