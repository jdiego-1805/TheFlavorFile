import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';

import { ADD_RECIPE } from '../../utils/mutations';
import { QUERY_RECIPES, QUERY_ME } from '../../utils/queries';

import Auth from '../../utils/auth';

const RecipeForm = () => {
  const [ingredientsText, setIngredientsText] = useState('');
  
  const [instructionsText, setInstructionsText] = useState('');

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
      const { me } = cache.readQuery({ query: QUERY_ME });
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
          recipeNameText,
          ingredientsText,
          instructionsText,
          recipeAuthor: Auth.getProfile().data.username,
        },
      });

      setIngredientsText('');
      setInstructionsText('');
      setRecipeText('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === 'recipeNameText') {
      setRecipeNameText(value);
    }
    if (name === 'ingredientsText') {
      setIngredientsText(value);
    }
    if (name === 'instructionsText') {
      setInstructionsText(value);
    }
  };

  return (
    <div>
      <h3>Whisking Up Recipe Fun: Let's Post!</h3>

      {Auth.loggedIn() ? (
        <>
          <p>
            
          </p>
          <form
            className="flex-row justify-center justify-space-between-md align-center"
            onSubmit={handleFormSubmit}
          >
            <div className="col-12 col-lg-9">
              recipe name:
              <textarea
                name="recipeText"
                placeholder=""
                value={recipeText}
                className="form-input w-100"
                style={{ lineHeight: '1.5', resize: 'vertical' }}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="col-12 col-lg-9">
              ingredients:
              <textarea
                name="ingredientsText"
                placeholder="New recipe in 3..2..1..."
                value={ingredientsText}
                className="form-input w-100"
                style={{ lineHeight: '1.5', resize: 'vertical' }}
                onChange={handleChange}
              ></textarea>
            </div>
            
            <div className="col-12 col-lg-9">
              instructions:
              <textarea
                name="instructionsText"
                placeholder="Here's how to prep the masterpiece..."
                value={instructionsText}
                className="form-input w-100"
                style={{ lineHeight: '1.5', resize: 'vertical' }}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="col-12 col-lg-3">
              <button className="btn btn-primary btn-block py-3" type="submit">
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
          You need to be logged in to share your recipe. Please{' '}
          <Link to="/login">login</Link> or <Link to="/signup">signup.</Link>
        </p>
      )}
    </div>
  );
};

export default RecipeForm;
