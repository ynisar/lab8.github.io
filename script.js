
let recipes = [];
let currentPage = 1;
const itemsPerPage = 5;


function addRecipe(title, ingredients, instructions, image) {
  const recipe = {
    id: Date.now(),
    title,
    ingredients,
    instructions,
    image
  };
  recipes.push(recipe);
  saveRecipes();
  displayRecipes();
}


function deleteRecipe(id) {
  recipes = recipes.filter(recipe => recipe.id !== id);
  saveRecipes();
  displayRecipes();
}


function saveRecipes() {
  localStorage.setItem('recipes', JSON.stringify(recipes));
}


function loadRecipes() {
  const storedRecipes = localStorage.getItem('recipes');
  if (storedRecipes) {
    recipes = JSON.parse(storedRecipes);
    displayRecipes();
  }
}


function displayRecipes() {
  const recipesList = document.getElementById('recipes');
  recipesList.innerHTML = '';

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRecipes = recipes.slice(startIndex, endIndex);

  currentRecipes.forEach(recipe => {
    const item = document.createElement('li');
    item.innerHTML = `
      <h3>${recipe.title}</h3>
      <div>
        <img src="${recipe.image}" alt="${recipe.title}">
        <p>${recipe.ingredients}</p>
        <p>${recipe.instructions}</p>
      </div>
      <div class="recipe-actions">
        <button onclick="viewRecipe(${recipe.id})">View</button>
        <button onclick="editRecipe(${recipe.id})">Edit</button>
        <button onclick="deleteRecipe(${recipe.id})">Delete</button>
      </div>
    `;
    recipesList.appendChild(item);
  });

  displayPagination();
}


function displayPagination() {
  const totalPages = Math.ceil(recipes.length / itemsPerPage);
  const paginationContainer = document.getElementById('pagination');
  paginationContainer.innerHTML = '';

  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement('button');
    button.textContent = i;
    button.addEventListener('click', () => {
      currentPage = i;
      displayRecipes();
    });
    paginationContainer.appendChild(button);
  }
}



function handleFormSubmit(event) {
  event.preventDefault();

  const title = document.getElementById('title').value;
  const ingredients = document.getElementById('ingredients').value;
  const instructions = document.getElementById('instructions').value;
  const imageInput = document.getElementById('image');

  
  if (imageInput.files.length > 0) {
    const image = imageInput.files[0];

   
    const reader = new FileReader();
    reader.onload = function (event) {
      const imageDataURL = event.target.result;
      addRecipe(title, ingredients, instructions, imageDataURL);
    };
    reader.readAsDataURL(image);
  } else {
   
    addRecipe(title, ingredients, instructions, '');
  }

  
  document.getElementById('recipe-form').reset();
}



function viewRecipe(id) {
  const recipe = recipes.find(recipe => recipe.id === id);
  if (recipe) {
   
    console.log(recipe);
  }
}


function editRecipe(id) {
  const recipe = recipes.find(recipe => recipe.id === id);
  if (recipe) {
 
    document.getElementById('title').value = recipe.title;
    document.getElementById('ingredients').value = recipe.ingredients;
    document.getElementById('instructions').value = recipe.instructions;


   
    document.getElementById('recipe-form').addEventListener('submit', function(event) {
      event.preventDefault();

      recipe.title = document.getElementById('title').value;
      recipe.ingredients = document.getElementById('ingredients').value;
      recipe.instructions = document.getElementById('instructions').value;
    

      saveRecipes();
      displayRecipes();

    
      document.getElementById('recipe-form').reset();
     
      document.getElementById('recipe-form').removeEventListener('submit', arguments.callee);
    });
  }
}


function searchRecipes(query) {
  const searchResults = recipes.filter(recipe => {
    const titleMatch = recipe.title.toLowerCase().includes(query.toLowerCase());
    const ingredientsMatch = recipe.ingredients.toLowerCase().includes(query.toLowerCase());
    return titleMatch || ingredientsMatch;
  });
  displaySearchResults(searchResults);
}


function displaySearchResults(results) {
  const recipesList = document.getElementById('recipes');
  recipesList.innerHTML = '';

  if (results.length === 0) {
    const message = document.createElement('li');
    message.textContent = 'No matching recipes found.';
    recipesList.appendChild(message);
    return;
  }

  results.forEach(recipe => {
    const item = document.createElement('li');
    item.innerHTML = `
      <h3>${recipe.title}</h3>
      <div>
        <img src="${recipe.image}" alt="${recipe.title}">
        <p>${recipe.ingredients}</p>
        <p>${recipe.instructions}</p>
      </div>
      <div class="recipe-actions">
        <button onclick="viewRecipe(${recipe.id})">View</button>
        <button onclick="editRecipe(${recipe.id})">Edit</button>
        <button onclick="deleteRecipe(${recipe.id})">Delete</button>
      </div>
    `;
    recipesList.appendChild(item);
  });
}


function init() {
  loadRecipes();
  document.getElementById('recipe-form').addEventListener('submit', handleFormSubmit);
  document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const query = document.getElementById('search-input').value;
    searchRecipes(query);
 
    document.getElementById('search-input').value = '';
  });
}


document.addEventListener('DOMContentLoaded', init);




// Get the search icon, search form, and cancel button
const searchIcon = document.querySelector('.search-icon');
const searchForm = document.querySelector('#search-form');
const cancelBtn = document.querySelector('#cancel-btn');

// Add event listeners
searchIcon.addEventListener('click', toggleSearchBar);
cancelBtn.addEventListener('click', toggleSearchBar);

// Function to toggle the search bar
function toggleSearchBar() {
  searchForm.classList.toggle('active');
  searchIcon.classList.toggle('active');
  cancelBtn.classList.toggle('active'); // Toggle the cancel button visibility
}

// document.getElementById("search-icon").addEventListener("click", function() {
//   document.getElementById("search-input").focus();
// });
