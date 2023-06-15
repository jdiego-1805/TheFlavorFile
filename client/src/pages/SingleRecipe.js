import React, { useEffect, useState } from "react";
// Import the `useParams()` hook
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { QUERY_SINGLE_RECIPE, QUERY_ME, QUERY_RECIPES } from "../utils/queries";
import "../styles/singlerecipe.css";
import { UPDATE_RECIPE } from "../utils/mutations";
import Auth from "../utils/auth";

const SingleRecipe = () => {
    // Use `useParams()` to retrieve value of the route parameter `:profileId`
    const [ingredientArray, setIngredientArray] = useState([]);
    const [instructionArray, setInstructionArray] = useState([]);
    const [recipeName, setRecipeNameText] = useState("");

    const [editMode, setEditMode] = useState(false)
    const [editRecipe, setEditRecipe] = useState({ ingredients: [], instructions: [] });

    const { recipeId } = useParams();


    const { loading, data } = useQuery(QUERY_SINGLE_RECIPE, {
        // pass URL parameter
        variables: { recipeId: recipeId },
    });

    const [updateRecipe, { error }] = useMutation(UPDATE_RECIPE, {
        update(cache, { data: { updateRecipe } }) {
            try {
                const { recipe } = cache.readQuery({ query: QUERY_SINGLE_RECIPE, variables: { recipeId: recipeId } });

                cache.writeQuery({
                    query: QUERY_SINGLE_RECIPE,
                    data: { recipe: { ...recipe, ...updateRecipe } },
                });

                const { recipes } = cache.readQuery({ query: QUERY_RECIPES });
                cache.writeQuery({
                    query: QUERY_RECIPES,
                    data: {
                        recipes: recipes.map(recipe => {

                            if (updateRecipe._id == recipe._id) {
                                return updateRecipe;
                            }
                            else {
                                return recipe;
                            }
                        })
                    },
                });

            } catch (e) {
                console.error(e);
            }
            const { me } = cache.readQuery({ query: QUERY_ME }) || {
                me: { recipe: [] },
            };
            cache.writeQuery({
                query: QUERY_ME,
                data: { me: { ...me, recipe: [...me.recipe, updateRecipe] } },
            });
        },
    })

    useEffect(() => {

        if (data) {
            setEditRecipe(data.recipe);

        }

    }, [data])

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        try {
            const { data } = await updateRecipe({
                variables: {
                    recipeId: editRecipe._id,
                    recipeName: editRecipe.recipeName,
                    ingredients: editRecipe.ingredients,
                    instructions: editRecipe.instructions,
                    recipeAuthor: Auth.getProfile().data.username,
                },
            });
        } catch (err) {
            console.error(err);
        }
    };


    const recipe = data?.recipe || { ingredients: [], instructions: [] };

    console.log(editRecipe);
    console.log(recipe);

    if (loading) {
        return <div>Loading...</div>;
    }




    return (
        <div>
            <button onClick={() => setEditMode(!editMode)}>edit</button>
            <button onClick={handleFormSubmit}>save</button>
            <h1 className="centerTitle titleRecipe">
                <EditRecipeName editMode={editMode} recipe={editMode ? editRecipe : recipe} setEditRecipe={setEditRecipe}></EditRecipeName>
            </h1>
            <div className="bigBox">
                <div className="box1">
                    <h2 className="centerTitle">Ingredients:</h2>

                    <div className="ingredient">


                        <IngredientList editMode={editMode} recipe={editMode ? editRecipe : recipe} setEditRecipe={setEditRecipe}></IngredientList>




                    </div>

                </div>
                <div className="box2">
                    <h2 className="centerTitle">Instructions:</h2>
                    <div className="instruction">
                        <ol>
                            <InstructionsList editMode={editMode} recipe={editMode ? editRecipe : recipe} setEditRecipe={setEditRecipe}></InstructionsList>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    );
};



function IngredientList({ recipe, editMode, setEditRecipe }) {

    function changeIngredient(event, index) {

        console.log(recipe);
        console.log(event.target.value)
        setEditRecipe({
            ...recipe, ingredients: recipe.ingredients.map((ingredient, i) => {
                if (i === index) {
                    return event.target.value
                }
                else
                    return ingredient
            })
        })
        // recipe.ingredients

    }
    if (editMode) {

        return recipe.ingredients.map((ingredient, i) => {

            return <input value={ingredient} onChange={(event) => changeIngredient(event, i)}></input>
        })

    }
    else {
        return recipe.ingredients.map((ingredient, i) => {
            return <li>{ingredient}</li>

        })
    }
}


function InstructionsList({ recipe, editMode, setEditRecipe }) {

    function changeInstructions(event, index) {

        console.log(recipe);
        console.log(event.target.value)
        setEditRecipe({
            ...recipe, instructions: recipe.instructions.map((instruction, i) => {
                if (i === index) {
                    return event.target.value
                }
                else
                    return instruction
            })
        })
        // recipe.ingredients

    }
    if (editMode) {

        return recipe.instructions.map((instruction, i) => {

            return <input value={instruction} onChange={(event) => changeInstructions(event, i)}></input>
        })

    }
    else {
        return recipe.instructions.map((instruction, i) => {
            return <li>{instruction}</li>

        })
    }
}

function EditRecipeName({ recipe, editMode, setEditRecipe }) {
    function changeRecipeName(event) {

        console.log(recipe);
        console.log(event.target.value)
        setEditRecipe({
            ...recipe, recipeName: event.target.value
        })
        // recipe.ingredients

    }
    if (editMode) {

        return <input value={recipe.recipeName} onChange={(event) => changeRecipeName(event)}></input>

    }
    else {
        return <h1>{recipe.recipeName}</h1>

    }
}

export default SingleRecipe;
