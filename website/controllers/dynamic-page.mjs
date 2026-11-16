export function testController(req, res) {
  // show the current time
  const currentTime = new Date().toLocaleString();
  res.send(
    `This is a dynamic page and the current server time is: ${currentTime}`,
  );
}
