const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const GameSchema = new Schema({
  title: { type: String, required: true, mminLength: 3, maxLength: 100 },
  desc: { type: String, required: true },
  price: { type: Number, required: true },
  stockNumber: { type: Number, required: true },
  category: {type: Schema.ObjectId, ref: "Category", required: true}
});

GameSchema.virtual("url").get(function () {
  return "/game/" + this._id;
});

module.exports = mongoose.model("Game", GameSchema);