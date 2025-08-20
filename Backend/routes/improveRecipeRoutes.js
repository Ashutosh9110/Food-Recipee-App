const express = require("express");
const { improveRecipeController } = require("../controller/improveRecipeController");
const router = express.Router();

router.post("/improve", improveRecipeController);

module.exports = router;
