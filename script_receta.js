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
    mealName.classList.add("meal-name");
    mealName.textContent = meal.strMeal;

    const mealImageContainer = document.createElement("div");
    const ingredientContainer = document.createElement("div");

    mealImageContainer.classList.add("meal-image-container");
    const mealImage = document.createElement("img");
    mealImage.src = meal.strMealThumb;
    mealImage.alt = meal.strMeal;
    mealImageContainer.appendChild(mealImage);

    const ingredientsTitle = document.createElement("h3");
    ingredientsTitle.classList.add("ingredient-title");
    ingredientsTitle.textContent = "Ingredientes:";

    const ingredientsList = document.createElement("ul");
    ingredientsList.classList.add("ingredient-list");
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal["strIngredient" + i];
        const measure = meal["strMeasure" + i];
        if (ingredient && measure) {
            const ingredientItem = document.createElement("li");
            ingredientItem.textContent = `${measure} ${ingredient}`;
            ingredientsList.appendChild(ingredientItem);
        }
    }

    ingredientContainer.appendChild(ingredientsTitle);
    ingredientContainer.appendChild(ingredientsList);

    mealImageContainer.appendChild(ingredientContainer);

    const instructionsTitle = document.createElement("h3");
    instructionsTitle.textContent = "Instrucciones de Preparación:";
    instructionsTitle.classList.add("instructions-title");

    const instructions = document.createElement("p");
    instructions.textContent = meal.strInstructions;
    instructions.classList.add("instructions");

    mealInfo.appendChild(mealName);
    mealInfo.appendChild(mealImageContainer);
    mealInfo.appendChild(instructionsTitle);
    mealInfo.appendChild(instructions);

    if (meal.strYoutube) {
        const videoContainer = document.createElement("div");
        const videoTitle = document.createElement("div");
        const video = document.createElement("iframe");
        video.src = meal.strYoutube.replace("watch?v=", "embed/");
        video.width = "560";
        video.height = "315";
        video.allowFullscreen = true;
        video.classList.add("video");
        videoContainer.classList.add("video-container");
        videoContainer.appendChild(video);
        mealInfo.appendChild(videoContainer);
    }
}

function showMessage(message) {
    const mealInfo = document.getElementById("meal-info");
    mealInfo.innerHTML = "";

    const messageDiv = document.createElement("div");
    messageDiv.textContent = message;
    mealInfo.appendChild(messageDiv);
}
