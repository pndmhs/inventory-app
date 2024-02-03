#! /usr/bin/env node

console.log(
  'This script populates some data to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Game = require("./models/game");
const Category = require("./models/category");

const games = [];
const categories = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createCategories();
  await createGames();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

async function categoryCreate(index, name, desc) {
  const category = new Category({
    name: name,
    desc: desc,
  });
  await category.save();
  categories[index] = category;
  console.log(`Added category: ${name}`);
}

async function gameCreate(index, title, desc, price, stockNumber, category) {
  const gamedetail = {
    title: title,
    desc: desc,
    price: price,
    stockNumber: stockNumber,
    category: category,
  };

  const game = new Game(gamedetail);

  await game.save();
  games[index] = game;
  console.log(`Added game: ${title}`);
}

async function createCategories() {
  console.log("Adding categories");
  await Promise.all([
    categoryCreate(
      0,
      "Action",
      "An action game is a video game genre that emphasizes physical challenges, including hand–eye coordination and reaction time"
    ),
    categoryCreate(
      1,
      "Sports",
      "A sports video game is a video game that simulates the practice of sports"
    ),
    categoryCreate(
      2,
      "Strategy",
      "Strategy is a major video game genre that emphasizes thinking and planning over direct instant action in order to achieve victory"
    ),
  ]);
}

async function createGames() {
  console.log("Adding games");
  await Promise.all([
    gameCreate(
      0,
      "UNCHARTED™: Legacy of Thieves Collection",
      "Play as Nathan Drake and Chloe Frazer in their own standalone adventures as they confront their pasts and forge their own legacies. This game includes the critically acclaimed single-player stories from both UNCHARTED 4: A Thief's End and UNCHARTED: The Lost Legacy.",
      49.99,
      100,
      [categories[0]]
    ),
    gameCreate(
      1,
      "God Of War",
      "His vengeance against the Gods of Olympus years behind him, Kratos now lives as a man in the realm of Norse Gods and monsters. It is in this harsh, unforgiving world that he must fight to survive… and teach his son to do the same.",
      49.99,
      100,
      [categories[0]]
    ),
    gameCreate(
      2,
      "EA SPORTS FC™ 24",
      "EA SPORTS FC™ 24 welcomes you to The World's Game: the most true-to-football experience ever with HyperMotionV, PlayStyles optimised by Opta, and an enhanced Frostbite™ Engine.",
      20.99,
      100,
      [categories[1]]
    ),
    gameCreate(
      3,
      "Stardew Valley",
      "You've inherited your grandfather's old farm plot in Stardew Valley. Armed with hand-me-down tools and a few coins, you set out to begin your new life. Can you learn to live off the land and turn these overgrown fields into a thriving home?",
      14.99,
      30,
      [categories[2]]
    ),
    gameCreate(
      4,
      "Football Manager 2024",
      "Build a world-class team ready to dominate your rivals in football's most prestigious competitions. Progress never stops when you're pursuing footballing greatness.",
      59.99,
      200,
      [categories[1]]
    ),
  ]);
}
