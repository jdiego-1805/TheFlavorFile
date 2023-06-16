import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import "../../styles/recipesform.css";
import { useNavigate } from "react-router-dom";

import { ADD_RECIPE } from "../../utils/mutations";
import { QUERY_RECIPES, QUERY_ME } from "../../utils/queries";

import Auth from "../../utils/auth";

const RecipeForm = () => {
  const [recipeName, setRecipeNameText] = useState("");

  const [ingredientArray, setIngredientArray] = useState([]);

  const [instructionArray, setInstructionArray] = useState([]);

  const [ingredients, setIngredientsText] = useState("");

  const [instructions, setInstructionsText] = useState("");

  const [addRecipe, { error }] = useMutation(ADD_RECIPE, {
    update(cache, { data: { addRecipe } }) {
      try {
        const { recipes } = cache.readQuery({ query: QUERY_RECIPES });
        console.log(recipes);
        cache.writeQuery({
          query: QUERY_RECIPES,
          data: { recipes: [addRecipe, ...recipes] },
        });
        console.log(recipes);
      } catch (e) {
        console.error("error", e);
        // console.error("error", e.message);
      }
      // update me object's cache
      try {
        const { me } = cache.readQuery({ query: QUERY_ME }) || {
          me: { recipes: [] },
        };
        // console.log("ME", me);
        cache.writeQuery({
          query: QUERY_ME,
          data: { me: { ...me, recipes: [...me.recipes, addRecipe] } },
        });
      } catch (e) {
        console.error("me", e);
      }
    },
  });
  const navigate = useNavigate();

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      if (!recipeName) {
        console.error("Recipe name is required.");
        return;
      }
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

      navigate("/me");
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (event) => {
    event.preventDefault();
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

  const handleIngredient = async (event) => {
    event.preventDefault();
    setIngredientArray([...ingredientArray, ingredients]);
    setIngredientsText("");
  };

  const handleInstruction = async (event) => {
    event.preventDefault();
    setInstructionArray([...instructionArray, instructions]);
    setInstructionsText("");
  };

  return (
    <div>
      
      <h3>Whisking Up Recipe Fun: Let's Post!</h3>

      {Auth.loggedIn() ? (
        <>
          <form className="form-body" onSubmit={handleFormSubmit}>
            <div className="mini-title">
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

            <div className="mini-title">
              What are your ingredients and quantities:
              <textarea
                name="ingredientsText"
                placeholder="New recipe in 3..2..1..."
                value={ingredients}
                className="form-input w-100"
                style={{ lineHeight: "1.5", resize: "vertical" }}
                onChange={handleChange}
                ></textarea>
              <div>
                {ingredientArray.map((ingredient, i) => (
                  <li key={i}>{ingredient}</li>
                ))}
              </div>
              <button
                className="add-btn btn"
                type="text"
                onClick={handleIngredient}
              >
                Add Ingredient
              </button>
                <div>{ingredientArray.map((ingredient) => (
                  <li>{ingredient}</li>
                ))}</div>
            </div>

            <div className="mini-title">
              Give detailed instructions on how to make:
              <textarea
                name="instructionsText"
                placeholder="Here's how to prep the masterpiece..."
                value={instructions}
                className="form-input w-100"
                style={{ lineHeight: "1.5", resize: "vertical" }}
                onChange={handleChange}
              ></textarea>
              <div className="">
                <ol>
                  {instructionArray.map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                  ))}
                </ol>
              </div>
              <button
                className="add-btn btn"
                type="text"
                onClick={handleInstruction}
              >
                Add Instruction
              </button>
                <div className=""><ol>{instructionArray.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}</ol></div>
            </div>

            <div className="">
              <button  onClick={navigateToMe} className="add-rec btn btn-block py-3" type="submit">
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
