import React from "react";
import "../styles/profile.css";
import { useQuery, useMutation } from "@apollo/client";
import { Navigate, useParams } from "react-router-dom";
import { QUERY_USER, QUERY_ME } from "../utils/queries";
import { REMOVE_RECIPE } from "../utils/mutations";
import Auth from "../utils/auth";

const Profile = () => {
  const { username: userParam } = useParams();
  const [removeRecipe, { error }] = useMutation(REMOVE_RECIPE, {
    update(cache, { data: { removeRecipe } }) {
      try {
        cache.writeQuery({
          query: QUERY_ME,
          data: { me: removeRecipe },
        });
      } catch (e) {
        console.error(e);
      }
    },
  });

  const handleRemoveRecipe = async (recipeId) => {
    try {
      const { data } = await removeRecipe({
        variables: { recipeId },
      });
    } catch (err) {
      console.error(err);
    }
  };

  const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
    variables: { username: userParam },
  });

  const user = data?.me || data?.user || {};
  // navigate to personal profile page if username is yours
  if (Auth.loggedIn() && Auth.getProfile().data.username === userParam) {
    return <Navigate to="/me" />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user?.username) {
    return (
      <h4>
        You need to be logged in to see this. Use the navigation links above to
        sign up or log in!
      </h4>
    );
  }

  const recipes = user.recipes || [];
  return (
    <div className="justify-center mb-3">
      <div>
        {recipes &&
          recipes.map((recipe) => (
            <div key={recipe}>
              <h1>{recipe.recipeName}</h1>
              <p>{recipe.ingredients}</p>
              <p>{recipe.instructions}</p>
              <button
                className="btn-block btn-danger"
                onClick={() => handleRemoveRecipe(recipe._id)}
              >
                Delete this recipe!
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Profile;
