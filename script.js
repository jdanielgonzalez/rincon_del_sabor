document.addEventListener("DOMContentLoaded", function () {
    const searchBtn = document.getElementById("bnt-buscador");

    searchBtn.addEventListener("click", function () {
        const searchInput = document.getElementById("input-buscador").value.trim();
        const searchCriteria = document.getElementById("tipo-buscador").value;

        if (searchInput === "") {
            showMessage("Por favor ingresa un término de búsqueda válido.");
        } else {
            performSearch(searchInput, searchCriteria);
        }
    });
});

function buildApiUrl(query, criteria) {
    let apiUrl;
    if (criteria !== 's') {
        apiUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?${criteria}=${query}`;
    } else {
        apiUrl = `https://www.themealdb.com/api/json/v1/1/search.php?${criteria}=${query}`;
    }
    return apiUrl;
}

function performSearch(query, criteria) {
    const apiUrl = buildApiUrl(query, criteria);

    console.log(apiUrl)
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.meals === null) {
                showMessage("No se encontraron resultados para esta búsqueda.");
                const resultsContainer = document.getElementById("results-container");
                resultsContainer.innerHTML = "";
            } else {
                displayResults(data.meals);
                removeMessageIfExists();
            }
        })
        .catch(error => {
            console.error("Error al realizar la búsqueda:", error);
            showMessage("Ocurrió un error al buscar. Por favor intenta de nuevo más tarde.");
        });
}

function displayResults(meals) {
    const resultsContainer = document.getElementById("results-container");
    resultsContainer.innerHTML = "";

    const maxRecipesToShow = 18;
    meals.slice(0, maxRecipesToShow).forEach(meal => {
        const mealCard = document.createElement("div");
        mealCard.classList.add("meal-card");

        const mealImageContainer = document.createElement("div");
        mealImageContainer.classList.add("meal-image-container");
        const mealImage = document.createElement("img");
        mealImage.src = meal.strMealThumb;
        mealImage.alt = meal.strMeal;
        mealImageContainer.appendChild(mealImage);

        const mealName = document.createElement("span");
        mealName.textContent = meal.strMeal;

        mealCard.appendChild(mealImageContainer);
        mealCard.appendChild(mealName);
        resultsContainer.appendChild(mealCard);

        mealCard.addEventListener("click", function () {
            window.location.href = `receta.html?nombre=${encodeURIComponent(meal.strMeal)}`;
        });

        mealCard.addEventListener("mouseenter", function () {
            mealImageContainer.classList.add("img-hover");
            mealName.classList.add("span-hover");
        });

        mealCard.addEventListener("mouseleave", function () {
            mealImageContainer.classList.remove("img-hover");
            mealName.classList.remove("span-hover");
        });    
    });
}

function showMessage(message) {
    const messageDiv = document.getElementById("message");
    messageDiv.textContent = message;
    messageDiv.style.display = "block";
}

function removeMessageIfExists() {
    const messageDiv = document.getElementById("message");
    if (messageDiv.textContent.trim() !== "") {
        messageDiv.textContent = "";
        messageDiv.style.display = "none";
    }
}