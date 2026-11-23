export function currentTimeController(req, res) {
  const currentTime = new Date().toLocaleString();
  res.render("dynamic/current-time", {
    currentTime,
  });
}
