import React, { useEffect, useState } from "react";
import {
    EditRecipeName,
    InstructionsList,
    IngredientList,
} from "../utils/exportSingleRecipe";
// Import the `useParams()` hook
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { QUERY_SINGLE_RECIPE, QUERY_ME, QUERY_RECIPES } from "../utils/queries";
import "../styles/singlerecipe.css";
import { UPDATE_RECIPE } from "../utils/mutations";
import Auth from "../utils/auth";


const SingleRecipe = () => {
    const [editMode, setEditMode] = useState(false);
    const [editRecipe, setEditRecipe] = useState({
        ingredients: [],
        instructions: [],
    });

    const { recipeId } = useParams();


    const { loading, data } = useQuery(QUERY_SINGLE_RECIPE, {
        // pass URL parameter
        variables: { recipeId: recipeId },
    });

    const [updateRecipe, { error }] = useMutation(UPDATE_RECIPE, {
        update(cache, { data: { updateRecipe } }) {
            try {
                const { recipe } = cache.readQuery({
                    query: QUERY_SINGLE_RECIPE,
                    variables: { recipeId: recipeId },
                });

                cache.writeQuery({
                    query: QUERY_SINGLE_RECIPE,
                    data: { recipe: { ...recipe, ...updateRecipe } },
                });

                const { recipes } = cache.readQuery({ query: QUERY_RECIPES });
                cache.writeQuery({
                    query: QUERY_RECIPES,
                    data: {
                        recipes: recipes.map((recipe) => {
                            if (updateRecipe._id == recipe._id) {
                                return updateRecipe;
                            } else {
                                return recipe;
                            }
                        }),
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
    });

    useEffect(() => {
        if (data) {
            setEditRecipe(data.recipe);
        }
    }, [data]);

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
            setEditMode(false)
        }
        catch (err) {
            console.error(err);
        }
    };

    const recipe = data?.recipe || { ingredients: [], instructions: [] };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>

            <EditRecipeName
                editMode={editMode}
                recipe={editMode ? editRecipe : recipe}
                setEditRecipe={setEditRecipe}
            ></EditRecipeName>


            <div className="btnLine">
                <button className="editSaveBtn" onClick={() => setEditMode(!editMode)}>Edit</button>
                <button className="editSaveBtn" onClick={handleFormSubmit}>Save</button>
            </div>

            <div className="bigBox">
                <div className="box1">
                    <h2 className="centerTitle">Ingredients:</h2>

                    <div className="ingredient">
                        <IngredientList
                            editMode={editMode}
                            recipe={editMode ? editRecipe : recipe}
                            setEditRecipe={setEditRecipe}
                        ></IngredientList>
                    </div>
                </div>
                <div className="box2">
                    <h2 className="centerTitle">Instructions:</h2>
                    <div className="instruction">
                        <ol>
                            <InstructionsList
                                className="instructionList"
                                editMode={editMode}
                                recipe={editMode ? editRecipe : recipe}
                                setEditRecipe={setEditRecipe}
                            ></InstructionsList>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SingleRecipe;
