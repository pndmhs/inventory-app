const Category = require("../models/category");
const Game = require("../models/game");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.category_list = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find().exec();
  res.render("category_list", {
    title: "Category List",
    list_categories: allCategories,
  });
});

exports.category_detail = asyncHandler(async (req, res, next) => {
  const [category, gamesInCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Game.find({ category: req.params.id }, "title desc").exec(),
  ]);

  if (category === null) {
    const err = new Error("Category not found");
    err.status = 404;
    return next(err);
  }

  res.render("category_detail", {
    title: "Category Detail",
    category: category,
    category_games: gamesInCategory,
  });
});

exports.category_create_get = asyncHandler(async (req, res, next) => {
  res.render("category_form", { title: "Add New Category" });
});

exports.category_create_post = [
  body("name", "Name must not be empty").trim().isLength({ min: 1 }).escape(),
  body("description", "Description must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const category = new Category({
      name: req.body.name,
      desc: req.body.description,
    });

    if (!errors.isEmpty()) {
      res.render("category_form", {
        title: "Create Category",
        category: category,
        errors: errors.array(),
      });
      return;
    } else {
      const categoryExist = await Category.findOne({
        name: req.body.name,
      }).exec();
      if (categoryExist) {
        res.redirect(categoryExist.url);
      } else {
        await category.save();
        res.redirect(category.url);
      }
    }
  }),
];

exports.category_delete_get = asyncHandler(async (req, res, next) => {
  const [category, gamesInCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Game.find({ category: req.params.id }, "title desc").exec(),
  ]);

  if (category === null) {
    res.redirect("/categories");
  }

  res.render("category_delete", {
    title: "Delete Category",
    category: category,
    category_games: gamesInCategory,
  });
});

exports.category_delete_post = asyncHandler(async (req, res, next) => {
  const [category, gamesInCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Game.find({ category: req.params.id }, "title desc").exec(),
  ]);

  if (gamesInCategory.length > 0) {
    res.render("category_delete", {
      title: "Delete Category",
      category: category,
      category_games: gamesInCategory,
    });
    return;
  } else {
    await Category.findByIdAndDelete(req.body.id);
    res.redirect("/categories");
  }
});

exports.category_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Category update GET");
});

exports.category_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: category update POST");
});
