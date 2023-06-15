import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import "../../styles/recipesform.css";

import { ADD_RECIPE } from "../../utils/mutations";
import { QUERY_RECIPES, QUERY_ME } from "../../utils/queries";

import Auth from "../../utils/auth";

const RecipeForm = ({ recipeId }) => {
  const [recipeName, setRecipeNameText] = useState("");

  const [ingredientArray, setIngredientArray] = useState([]);

  const [instructionArray, setInstructionArray] = useState([]);

  const [ingredients, setIngredientsText] = useState("");

  const [instructions, setInstructionsText] = useState("");

  const [addRecipe, { error }] = useMutation(ADD_RECIPE, {
    update(cache, { data: { addRecipe } }) {
      try {
        const { recipe } = cache.readQuery({ query: QUERY_RECIPES });

        cache.writeQuery({
          query: QUERY_RECIPES,
          data: { recipe: [addRecipe, ...recipe] },
        });
      } catch (e) {
        console.error(e);
      }

      // update me object's cache
      const { me } = cache.readQuery({ query: QUERY_ME }) || {
        me: { recipe: [] },
      };
      cache.writeQuery({
        query: QUERY_ME,
        data: { me: { ...me, recipe: [...me.recipe, addRecipe] } },
      });
    },
  });

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data } = await addRecipe({
        variables: {
          recipeName,
          ingredients: ingredientArray,
          instructions: instructionArray,
          recipeAuthor: Auth.getProfile().data.username,
        },
      });

      setIngredientsText("");
      setInstructionsText("");
      setRecipeNameText("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "recipeNameText") {
      setRecipeNameText(value);
    }
    if (name === "ingredientsText") {
      setIngredientsText(value);
    }
    if (name === "instructionsText") {
      setInstructionsText(value);
    }
  };

  const handleIngredient = async () => {
    setIngredientArray([...ingredientArray, ingredients]);
  };
  
  const handleInstruction = async () => {
  setInstructionArray([...instructionArray, instructions]);
  };
  

  return (
    <div>
      <h3>Whisking Up Recipe Fun: Let's Post!</h3>

      {Auth.loggedIn() ? (
        <>
          <form
            className="flex-row justify-center justify-space-between-md align-center"
            onSubmit={handleFormSubmit}
          >
            <div className="mini-title col-12 col-lg-4">
              What is your recipe called:
              <textarea
                name="recipeNameText"
                placeholder="Burger..."
                value={recipeName}
                className="form-input w-100"
                style={{ lineHeight: ".3", resize: "vertical" }}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="mini-title col-12 col-lg-9">
              What are your ingredients and quantities:
              <textarea
                name="ingredientsText"
                placeholder="New recipe in 3..2..1..."
                value={ingredients}
                className="form-input w-100"
                style={{ lineHeight: "1.5", resize: "vertical" }}
                onChange={handleChange}
                ></textarea>
                <div>{ingredientArray.map((ingredient) => (
                  <li>{ingredient}</li>
                ))}</div>
              <button
                className="btn btn-block py-3"
                type="text"
                onClick={handleIngredient}
                >
                Add Ingredient
              </button>
            </div>

            <div className="mini-title col-12 col-lg-9">
              Give detailed instructions on how to make:
              <textarea
                name="instructionsText"
                placeholder="Here's how to prep the masterpiece..."
                value={instructions}
                className="form-input w-100"
                style={{ lineHeight: "1.5", resize: "vertical" }}
                onChange={handleChange}
              ></textarea>
                <div className=""><ol>{instructionArray.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}</ol></div>
              <button
                className="btn btn-block py-3"
                type="text"
                onClick={handleInstruction}
              >
                Add Instruction
              </button>
            </div>

            <div className="col-12 col-lg-3">
              <button className="add-rec btn btn-block py-3" type="submit">
                Add Recipe
              </button>
            </div>
            {error && (
              <div className="col-12 my-3 bg-danger text-white p-3">
                {error.message}
              </div>
            )}
          </form>
        </>
      ) : (
        <p>
          You need to be logged in to share your recipe. Please{" "}
          <Link to="/login">login</Link> or <Link to="/signup">signup.</Link>
        </p>
      )}
    </div>
  );
};

export default RecipeForm;
