document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const mealName = urlParams.get('nombre');

    if (mealName) {
        getMealDetails(mealName);
    } else {
        showMessage("No se ha proporcionado el nombre de la receta.");
    }
});

function getMealDetails(mealName) {
    const apiUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.meals === null) {
                showMessage("No se encontró información detallada para esta receta.");
            } else {
                displayMealInfo(data.meals[0]);
            }
        })
        .catch(error => {
            console.error("Error al obtener información detallada:", error);
            showMessage("Ocurrió un error al obtener la información detallada de la receta. Por favor intenta de nuevo más tarde.");
        });
}

function displayMealInfo(meal) {
    const mealInfo = document.getElementById("receta_info");
    mealInfo.innerHTML = "";

    const mealName = document.createElement("h2");
    mealName.textContent = meal.strMeal;

    const mealImage = document.createElement("img");
    mealImage.src = meal.strMealThumb;
    mealImage.alt = meal.strMeal;

    const ingredientsTitle = document.createElement("h3");
    ingredientsTitle.textContent = "Ingredientes:";

    const ingredientsList = document.createElement("ul");
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal["strIngredient" + i];
        if (ingredient) {
            const ingredientItem = document.createElement("li");
            ingredientItem.textContent = ingredient;
            ingredientsList.appendChild(ingredientItem);
        }
    }

    const instructionsTitle = document.createElement("h3");
    instructionsTitle.textContent = "Instrucciones de Preparación:";

    const instructions = document.createElement("p");
    instructions.textContent = meal.strInstructions;

    mealInfo.appendChild(mealName);
    mealInfo.appendChild(mealImage);
    mealInfo.appendChild(ingredientsTitle);
    mealInfo.appendChild(ingredientsList);
    mealInfo.appendChild(instructionsTitle);
    mealInfo.appendChild(instructions);
}

function showMessage(message) {
    const mealInfo = document.getElementById("meal-info");
    mealInfo.innerHTML = "";

    const messageDiv = document.createElement("div");
    messageDiv.textContent = message;
    mealInfo.appendChild(messageDiv);
}
