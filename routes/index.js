const express = require('express');
const router = express.Router();

const game_controller = require("../controllers/gameController");
const category_controller = require("../controllers/categoryController");

/* GET home page. */
router.get("/", game_controller.index);

/// GAME ROUTES ///

router.get("/game/create", game_controller.game_create_get);

router.post("/game/create", game_controller.game_create_post);

router.get("/game/:id/delete", game_controller.game_delete_get);

router.post("/game/:id/delete", game_controller.game_delete_post);

router.get("/game/:id/update", game_controller.game_update_get);

router.post("/game/:id/update", game_controller.game_update_post);

router.get("/games/", game_controller.game_list);

router.get("/game/:id", game_controller.game_detail);


/// CATEGORY ROUTES ///

router.get("/category/create", category_controller.category_create_get);

router.post("/category/create", category_controller.category_create_post);

router.get("/category/:id/delete", category_controller.category_delete_get);

router.post("/category/:id/delete", category_controller.category_delete_post);

router.get("/category/:id/update", category_controller.category_update_get);

router.post("/category/:id/update", category_controller.category_update_post);

router.get("/categories/", category_controller.category_list);

router.get("/category/:id", category_controller.category_detail);

module.exports = router;
