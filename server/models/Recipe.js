const { Schema, model } = require("mongoose");
const dateFormat = require("../utils/dateFormat");

const recipeSchema = new Schema({
  recipeName: {
    type: String,
    required: true,
    trim: true,
  },
  ingredients: [
    {
      type: String,
      required: true,
      trim: true,
    },
  ],
  instructions: [
    {
      type: String,
      trim: true,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
    get: (timestamp) => dateFormat(timestamp),
  },
});

const Recipe = model("Recipe", recipeSchema);

module.exports = Recipe;
