const router = require('express').Router();

router.get("/test", (req, res) => {
  res.send("Hi there ..");
});

module.exports = router;
