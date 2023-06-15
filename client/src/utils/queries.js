import { gql } from "@apollo/client";

export const QUERY_USER = gql`
  query user($username: String!) {
    user(username: $username) {
      _id
      username
      email
      recipes {
        _id
        ingredients {
          ingredientsText
        }
        instructions {
          instructionsText
        }
        createdAt
      }
    }
  }
`;

export const QUERY_RECIPES = gql`
  query recipes {
    recipes {
      _id
      ingredients
      instructions
      createdAt
    }
  }
`;

export const QUERY_SINGLE_RECIPE = gql`
  query recipe($recipeId: ID!) {
    recipe(recipeId: $recipeId) {
      _id
      ingredients {
        ingredientsText
      }
      instructions {
        instructionsText
      }
      createdAt
    }
  }
`;

export const QUERY_ME = gql`
  query me {
    me {
      _id
      username
      email
      recipes {
        _id
        recipeName
        ingredients
        instructions
        createdAt
      }
    }
  }
`;
