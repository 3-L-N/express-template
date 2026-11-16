export function currentTimeController(req, res) {
  const currentTime = new Date().toLocaleString();
  res.render("current-time", {
    title: "Current Time",
    currentTime,
  });
}
