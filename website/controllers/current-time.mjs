export function currentTimeController(req, res) {
  const currentTime = new Date().toLocaleString();
  res.render("current-time", {
    currentTime,
  });
}
