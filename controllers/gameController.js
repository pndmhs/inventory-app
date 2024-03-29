const Game = require("../models/game");
const Category = require("../models/category");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.index = asyncHandler(async (req, res, next) => {
  const [numGames, numCategories] = await Promise.all([
    Game.countDocuments({}).exec(),
    Category.countDocuments({}).exec(),
  ]);

  res.render("index", {
    title: "Game Inventory Home",
    game_count: numGames,
    category_count: numCategories,
  });
});

exports.game_list = asyncHandler(async (req, res, next) => {
  const allGames = await Game.find().exec();
  res.render("game_list", { title: "Game List", game_list: allGames });
});

exports.game_detail = asyncHandler(async (req, res, next) => {
  const game = await Game.findById(req.params.id).populate("category").exec();
  res.render("game_detail", { title: game.title, game: game });
});

exports.game_create_get = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find().sort({ name: 1 }).exec();
  res.render("game_form", { title: "Add New Game", categories: allCategories });
});

exports.game_create_post = [
  (req, res, next) => {
    if (!Array.isArray(req.body.category)) {
      req.body.category =
        typeof req.body.category === "undefined" ? [] : [req.body.category];
    }
    next();
  },

  body("title", "Title must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("desc", "Description must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("price", "Price must not be empty").trim().isLength({ min: 1 }).escape(),
  body("stock", "Stock number must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("category").escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const game = new Game({
      title: req.body.title,
      desc: req.body.desc,
      price: req.body.price,
      stockNumber: req.body.stock,
      category: req.body.category,
    });

    if (!errors.isEmpty()) {
      const allCategories = await Category.find().sort({ name: 1 }).exec();

      for (const category of allCategories) {
        if (game.category.indexOf(category._id) > -1) {
          category.checked = true;
        }
      }

      res.render("game_form", {
        title: "Add New Game",
        game: game,
        categories: allCategories,
        errors: errors.array(),
      });
    } else {
      await game.save();
      res.redirect(game.url);
    }
  }),
];

exports.game_delete_get = asyncHandler(async (req, res, next) => {
  const game = await Game.findById(req.params.id).populate("category").exec();

  if (game === null) {
    res.redirect("/games");
  }

  res.render("game_delete", {
    title: "Delete Game",
    game: game,
  });
});

exports.game_delete_post = asyncHandler(async (req, res, next) => {
  await Game.findByIdAndDelete(req.body.id);
  res.redirect("/games");
});

exports.game_update_get = asyncHandler(async (req, res, next) => {
  const [game, allCategories] = await Promise.all([
    Game.findById(req.params.id).exec(),
    Category.find().sort({ name: 1 }).exec(),
  ]);

  if (game === null) {
    const err = new Error("Game not found");
    err.status = 404;
    return next(err);
  }

  allCategories.forEach((category) => {
    if (game.category.includes(category._id)) category.checked = "true";
  });

  res.render("game_form", {
    title: "Update Game",
    categories: allCategories,
    game: game,
  });
});

exports.game_update_post = [
  (req, res, next) => {
    if (!Array.isArray(req.body.category)) {
      req.body.category =
        typeof req.body.category === "undefined" ? [] : [req.body.category];
    }
    next();
  },

  body("title", "Title must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("desc", "Description must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("price", "Price must not be empty").trim().isLength({ min: 1 }).escape(),
  body("stock", "Stock number must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("category").escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const game = new Game({
      title: req.body.title,
      desc: req.body.desc,
      price: req.body.price,
      stockNumber: req.body.stock,
      category: req.body.category,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      const allCategories = await Category.find().sort({ name: 1 }).exec();

      for (const category of allCategories) {
        if (game.category.indexOf(category._id) > -1) {
          category.checked = true;
        }
      }

      res.render("game_form", {
        title: "Update Game",
        game: game,
        categories: allCategories,
        errors: errors.array(),
      });
    } else {
      await Game.findByIdAndUpdate(req.params.id, game);
      res.redirect(game.url);
    }
  }),
];
