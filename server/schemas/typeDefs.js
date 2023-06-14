const { gql } = require("apollo-server-express");

// type Ingredient {
//   ingredientsText: String
// }
// type Instructions {
//   instructionsText: String
// }

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    password: String
    recipes: [Recipe]
  }

  type Recipe {
    _id: ID
    recipeName: String!
    ingredients: [String]!
    instructions: [String]!
    createdAt: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    users: [User]
    user(username: String!): User
    recipes(username: String): [Recipe]
    recipe(recipeId: ID!): Recipe
    me: User
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    addRecipe(
      recipeName: String!
      ingredients: [String]!
      instructions: [String]!
    ): Recipe
    removeRecipe(recipeId: ID!): Recipe
  }
`;

module.exports = typeDefs;
