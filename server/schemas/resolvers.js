const { AuthenticationError } = require("apollo-server-express");
const { User, Recipe } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    users: async () => {
      return User.find().populate("recipes");
    },
    user: async (parent, { username }) => {
      return User.findOne({ username }).populate("recipes");
    },
    recipes: async (parent, { username }) => {
      const params = username ? { username } : {};
      return Recipe.find(params).sort({ createdAt: -1 });
    },
    recipe: async (parent, { recipeId }) => {
      return Recipe.findOne({ _id: recipeId });
    },
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate("recipes");
      }
      throw new AuthenticationError("You need to be logged in!");
    },
  },

  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("No user found with this email address");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const token = signToken(user);

      return { token, user };
    },
    addRecipe: async (parent, { ingredients, instructions }, context) => {
      if (context.user) {
        const recipe = await Recipe.create({
          ingredients: ingredients.map((ingredient) => ({
            ingredientsText: ingredient,
          })),
          instructions: instructions.map((instruction) => ({
            instructionsText: instruction,
          })),
        });

        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { recipes: recipe._id } },
          { new: true }
        );

        return recipe;
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    removeRecipe: async (parent, { recipeId }, context) => {
      if (context.user) {
        const removeRecipe = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { recipes: recipeId } },
          { new: true }
        );

        return removeRecipe;
      }
      throw new AuthenticationError("You need to be logged in!");
    },
  },
};

module.exports = resolvers;
