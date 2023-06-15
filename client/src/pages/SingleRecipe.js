import React from "react";

// Import the `useParams()` hook
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { QUERY_SINGLE_RECIPE } from "../utils/queries";
import "../styles/singlerecipe.css";

const SingleRecipe = () => {
    // Use `useParams()` to retrieve value of the route parameter `:profileId`
    const { recipeId } = useParams();
    const { loading, data } = useQuery(QUERY_SINGLE_RECIPE, {
        // pass URL parameter
        variables: { recipeId: recipeId },
    });

    const recipe = data?.recipe || {};

    if (loading) {
        return <div>Loading...</div>;
    }
    return (
        <div>
            <h1 className="centerTitle titleRecipe">{recipe.recipeName}</h1>
            <div className="bigBox">
                <div className="box1">
                    <h2 className="centerTitle">Ingredients:</h2>
                    <div className="ingredient">
                        {recipe.ingredients.map((ingredient) => (
                            <li>{ingredient}</li>
                        ))}
                    </div>
                </div>
                <div className="box2">
                    <h2 className="centerTitle">Instructions:</h2>
                    <div className="instruction">
                        <ol>
                            {recipe.instructions.map((instruction, index) => (
                                <li key={index}>{instruction}</li>
                            ))}
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SingleRecipe;
