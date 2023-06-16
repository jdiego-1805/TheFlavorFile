import "../styles/singlerecipe.css";
export function IngredientList({ recipe, editMode, setEditRecipe }) {
  function changeIngredient(event, index) {
    console.log(recipe);
    console.log(event.target.value);
    setEditRecipe({
      ...recipe,
      ingredients: recipe.ingredients.map((ingredient, i) => {
        if (i === index) {
          return event.target.value;
        } else return ingredient;
      }),
    });
    // recipe.ingredients
  }
  if (editMode) {
    return recipe.ingredients.map((ingredient, i) => {
      return (
        <input
          key={i}
          value={ingredient}
          onChange={(event) => changeIngredient(event, i)}
        ></input>
      );
    });
  } else {
    return recipe.ingredients.map((ingredient, i) => {
      return <li key={i}>{ingredient}</li>;
    });
  }
}

export function InstructionsList({ recipe, editMode, setEditRecipe }) {
  function changeInstructions(event, index) {
    console.log(recipe);
    console.log(event.target.value);
    setEditRecipe({
      ...recipe,
      instructions: recipe.instructions.map((instruction, i) => {
        if (i === index) {
          return event.target.value;
        } else return instruction;
      }),
    });
    // recipe.ingredients
  }
  if (editMode) {
    return recipe.instructions.map((instruction, i) => {
      return (
        <input
          key={i}
          value={instruction}
          onChange={(event) => changeInstructions(event, i)}
        ></input>
      );
    });
  } else {
    return recipe.instructions.map((instruction, i) => {
      return <li key={i}>{instruction}</li>;
    });
  }
}

export function EditRecipeName({ recipe, editMode, setEditRecipe }) {
  function changeRecipeName(event) {
    console.log(recipe);
    console.log(event.target.value);
    setEditRecipe({
      ...recipe,
      recipeName: event.target.value,
    });
    // recipe.ingredients
  }
  if (editMode) {
    return (
      <input
        value={recipe.recipeName}
        onChange={(event) => changeRecipeName(event)}
      ></input>
    );
  } else {
    return <h1 className="centerTitle titleRecipe">{recipe.recipeName}</h1>;
  }
}
