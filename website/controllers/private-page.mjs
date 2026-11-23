export function privatePageController(req, res, next) {
  if (req.query.access !== "granted") {
    return next();
  }

  res.sendPrivateFile("example.html");
}
