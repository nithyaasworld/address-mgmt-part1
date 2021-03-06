const express = require("express");
const router = express.Router();
const pizzaController = require("../controllers/pizzaController");

router.get("/", async (req, res) => {
  let result;
  await pizzaController
    .getAllPizzas()
    .then((data) => (result = { status: true, response: data }))
    .catch((err) => (result = { status: false, response: err }));

  res.send(result);
});
router.post("/", async (req, res) => {
  console.log(req.body);
  let result;
  await pizzaController.addAPizza(req.body).then((data) => (result = data));
  res.send(result);
});
module.exports = router;
