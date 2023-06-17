import React from "react";
import "../styles/profile.css";
import { useQuery, useMutation } from "@apollo/client";
import { Navigate, useParams } from "react-router-dom";
import { QUERY_USER, QUERY_ME } from "../utils/queries";
import { REMOVE_RECIPE } from "../utils/mutations";
import Auth from "../utils/auth";
import { Link } from "react-router-dom";

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
      <a href="/post">
        <h1 className="recipeTitle">Click here to create a new recipe!</h1>
      </a>
      <div>
        <div className="eachBox">
          {recipes &&
            recipes.map((recipe) => (
              <div key={recipe._id} className="recipeBox container">
                <h1 className="recipeName">{recipe.recipeName}</h1>
                <div className="example1">
                  <div className="buttonGrid">
                    <Link className="linkText" to={`/recipes/${recipe._id}`}>
                      <button className="btn-view">View this recipe!</button>
                    </Link>
                    <button
                      className="btn-delete"
                      onClick={() => handleRemoveRecipe(recipe._id)}
                    >
                      Delete this recipe!
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
