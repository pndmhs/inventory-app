const Game = require("../models/game");
const Category = require("../models/category")
const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async (req, res, next) => {
  const [numGames, numCategories] = await Promise.all([
    Game.countDocuments({}).exec(),
    Category.countDocuments({}).exec()
  ]);

  res.render("index", {
    title: "Game Inventory Home",
    game_count: numGames,
    category_count: numCategories
  })
});

exports.game_list = asyncHandler(async (req, res, next) => {
  res.send("Not Implemented: Game List")
});

exports.game_detail = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Game detail: ${req.params.id}`);
});

exports.game_create_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Game create GET");
});

exports.game_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Game create POST");
});

exports.game_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Game delete GET");
});

exports.game_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Game delete POST");
});

exports.game_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Game update GET");
});

exports.game_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: game update POST");
});
