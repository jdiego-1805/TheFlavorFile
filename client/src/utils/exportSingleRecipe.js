import "../styles/singlerecipe.css";
export function IngredientList({ recipe, editMode, setEditRecipe }) {
  function changeIngredient(event, index) {
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
          className="inputIngredients"
          key={i}
          value={ingredient}
          onChange={(event) => changeIngredient(event, i)}
        ></input>
      );
    });
  } else {
    return recipe.ingredients.map((ingredient, i) => {
      return (
        <li key={i} className="ingredientList">
          {ingredient}
        </li>
      );
    });
  }
}

export function InstructionsList({ recipe, editMode, setEditRecipe }) {
  function changeInstructions(event, index) {
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
        <textarea
          className="inputInstructions"
          key={i}
          value={instruction}
          onChange={(event) => changeInstructions(event, i)}
        ></textarea>
      );
    });
  } else {
    return recipe.instructions.map((instruction, i) => {
      return (
        <li key={i} className="instructionList">
          {instruction}
        </li>
      );
    });
  }
}

export function EditRecipeName({ recipe, editMode, setEditRecipe }) {
  function changeRecipeName(event) {
    setEditRecipe({
      ...recipe,
      recipeName: event.target.value,
    });
    // recipe.ingredients
  }
  if (editMode) {
    return (
      <div className="centerRecipeName">
        <input
          className="centerRecipeName"
          value={recipe.recipeName}
          onChange={(event) => changeRecipeName(event)}
        ></input>
      </div>
    );
  } else {
    return <h1 className="centerTitle titleRecipe">{recipe.recipeName}</h1>;
  }
}
