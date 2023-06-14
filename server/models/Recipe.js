const { Schema, model } = require("mongoose");
const dateFormat = require("../utils/dateFormat");

const recipeSchema = new Schema({
  recipeName: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 280,
    trim: true,
  },
  ingredients: [
    {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 280,
      trim: true,
    },
  ],
  instructions: [
    {
      type: String,
      minlength: 1,
      maxlength: 280,
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
