$(document).ready(function () {
  // Inisialisasi halaman pertama (List of Categories)
  loadCategoryPage();

  // Event listener untuk menangani navigasi menggunakan History API
  window.onpopstate = function (event) {
    if (event.state) {
      handleRoute(event.state.page, event.state.param);
    } else {
      loadCategoryPage(); // Default page
    }
  };

  // Fungsi untuk menangani navigasi
  function handleRoute(page, param = null) {
    switch (page) {
      case 'category':
        loadCategoryPage();
        break;
      case 'category-detail':
        loadCategoryDetailPage(param);
        break;
      case 'meal-detail':
        loadMealDetailPage(param);
        break;
      default:
        loadCategoryPage();
        break;
    }
  }

  // Fungsi untuk memuat halaman kategori
  function loadCategoryPage() {
    $.ajax({
      url: 'https://www.themealdb.com/api/json/v1/1/categories.php',
      type: 'GET',
      success: function (response) {
        const categories = response.categories;
        let categoryHtml = `
          <div class="flex flex-col gap-6 w-full justify-center items-center ">
            <div class="flex text-secondary gap-4">
              <img src="./public/soup.svg" alt="Soup" class="text-secondary">
              <img src="./public/utensils.svg" alt="Utensils" class="text-secondary">
              <img src="./public/cake.svg" alt="Cake" class="text-secondary">
            </div>
            <span class="text-xl text-primary font-semibold">mealapp API Website</span>
          </div>
          <h1 class="text-3xl md:text-[46px] lg:text-[64px] font-bold text-primary text-center my-6">See All The Delicous Foods</h1>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-6">`;
        categories.forEach(function (category) {
          categoryHtml += `
            <div class="cursor-pointer relative group overflow-hidden rounded-2xl" onclick="navigateToCategoryDetail('${category.strCategory}')">
                <img src="${category.strCategoryThumb}" alt="${category.strCategory}" class="w-full object-cover group-hover:scale-110 h-40 transition-all rounded-2xl" />
                <div class="absolute inset-0 bg-black rounded-2xl bg-opacity-40 flex items-center justify-center group-hover:opacity-100 transition-opacity duration-300">
                  <span class="text-white text-center text-xl font-semibold px-2">${category.strCategory}</span>
                </div>
            </div>
          `;
        });
        categoryHtml += '</div>';
        $('#app-container').html(categoryHtml);
        history.pushState({ page: 'category' }, 'Categories', '/');
      },
      error: function (error) {
        console.error('Error fetching categories', error);
      }
    });
  }

  // Fungsi untuk memuat halaman detail kategori
  function loadCategoryDetailPage(categoryName) {
    $.ajax({
      url: `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryName}`,
      type: 'GET',
      success: function (response) {
        const meals = response.meals;
        let mealHtml = `
        <div class="font-semibold text-secondary items-center flex gap-2 w-full">
          <div class="flex gap-[2px]">
            <img src="./public/home.svg" alt="Soup" class="text-secondary">
            <span class="cursor-pointer" onclick="navigateToCategoryList()">Home</span>
          </div>
          / 
          <span class="text-gray-400">${categoryName}</span>
        </div>      
        <h2 class="text-3xl md:text-[46px] xl:text-[64px] text-primary font-bold my-6">${categoryName}</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-6">`;
        meals.forEach(function (meal) {
          mealHtml += `
            <div class="cursor-pointer relative group overflow-hidden rounded-2xl" onclick="navigateToMealDetail('${meal.idMeal}','${categoryName}')">
              <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="w-full object-cover group-hover:scale-110 h-40 transition-all duration-300" />
              <div class="absolute inset-0 bg-black rounded-2xl bg-opacity-40 flex items-center justify-center group-hover:opacity-100 transition-opacity ">
                <span class="text-white text-center text-xl font-semibold px-2">${meal.strMeal}</span>
              </div>
            </div>`;
        });
        mealHtml += '</div>';
        $('#app-container').html(mealHtml);
        history.pushState({ page: 'category-detail', param: categoryName }, `Category: ${categoryName}`, `?category-name=${categoryName}`);
      },
      error: function (error) {
        console.error('Error fetching meals', error);
      }
    });
  }

  // Fungsi untuk memuat halaman detail meal
  function loadMealDetailPage(mealId, categoryName) {
    $.ajax({
      url: `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`,
      type: 'GET',
      success: function (response) {
        const meal = response.meals[0];
        const mealDetailHtml = `<div class="font-semibold text-secondary items-center flex gap-2 w-full">
          <div class="flex gap-[2px]">
            <img src="./public/home.svg" alt="Soup" class="text-secondary">
            <span class="cursor-pointer" onclick="navigateToCategoryList()">Home</span>
          </div> /
          <span class="cursor-pointer" onclick="navigateToCategoryDetail('${categoryName}')">Beef</span> /
          <span class="text-gray-400">${meal.strMeal}</span>
        </div>
        <div class="flex flex-col my-4 md:my-6 bg-secondary bg-opacity-10 rounded-lg overflow-hidden md:gap-6 shadow-md">
          <h1
            class="text-3xl text-center md:text-start md:text-[42px] font-bold p-4 text-primary bg-secondary bg-opacity-20">
            ${meal.strMeal}</h1>
          <div class="flex flex-col p-4 md:p-6 gap-4">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}"
              class="w-full h-full object-cover rounded-lg" />
            <div class="grid grid-cols-1 md:grid-cols-1 md:gap-4 mt-6">
              <div class="flex flex-col gap-4">
                <div class="flex gap-2 items-center text-secondary ">
                  <img src="./public/chef-hat.svg" alt="chef-hat">
                  <h3 class="text-3xl font-semibold ">Instruction</h3>
                </div>
                <p id="instruction" class="p-4 border-2 border-secondary rounded-lg bg-white bg-opacity-50 text-primary font-medium">${meal.strInstructions}</p>
              </div>
              <div class="flex flex-col gap-4">
                <div class="flex gap-2 items-center text-secondary ">
                  <img src="./public/scroll-text.svg" alt="scroll-text.svg">
                  <h3 class="text-3xl font-semibold ">Recipes</h3>
                </div>
                <ul
                  class="list-disc list-inside bg-white bg-opacity-50 rounded-lg p-4 border-2 border-secondary text-primary font-medium">
                  ${meal.strIngredient1 ? `<li>${meal.strIngredient1} - ${meal.strMeasure1}</li>` : ''}
                  ${meal.strIngredient2 ? `<li>${meal.strIngredient2} - ${meal.strMeasure2}</li>` : ''}
                  ${meal.strIngredient3 ? `<li>${meal.strIngredient3} - ${meal.strMeasure3}</li>` : ''}
                  ${meal.strIngredient4 ? `<li>${meal.strIngredient4} - ${meal.strMeasure4}</li>` : ''}
                  ${meal.strIngredient5 ? `<li>${meal.strIngredient5} - ${meal.strMeasure5}</li>` : ''}
                  ${meal.strIngredient6 ? `<li>${meal.strIngredient6} - ${meal.strMeasure6}</li>` : ''}
                  ${meal.strIngredient7 ? `<li>${meal.strIngredient7} - ${meal.strMeasure7}</li>` : ''}
                  ${meal.strIngredient8 ? `<li>${meal.strIngredient8} - ${meal.strMeasure8}</li>` : ''}
                  ${meal.strIngredient9 ? `<li>${meal.strIngredient9} - ${meal.strMeasure9}</li>` : ''}
                </ul>
              </div>
            </div>
            <div class="flex flex-col">
              <div class="flex gap-2 items-center text-secondary ">
                <img src="./public/youtube.svg" alt="youtube.svg">
                <h3 class="text-3xl font-semibold ">Video Tutorial</h3>
              </div>
              <iframe class="mt-4 mx-auto block w-full h-96 rounded-lg" src="https://www.youtube.com/embed/${meal.strYoutube.split('v=')[1]}" 
                frameborder="0" allowfullscreen>
              </iframe>
            </div>
          </div>
        </div>`
        $('#app-container').html(mealDetailHtml);
        history.pushState({ page: 'meal-detail', param: mealId }, `Meal: ${meal.strMeal}`, `?meal-id=${mealId}`);
      },
      error: function (error) {
        console.error('Error fetching meal details', error);
      }
    });
  }

  // Fungsi untuk navigasi ke detail kategori
  window.navigateToCategoryList = function () {
    loadCategoryPage();
  };
  // Fungsi untuk navigasi ke detail kategori
  window.navigateToCategoryDetail = function (categoryName) {
    loadCategoryDetailPage(categoryName);
  };

  // Fungsi untuk navigasi ke detail meal
  window.navigateToMealDetail = function (mealId, categoryName) {
    loadMealDetailPage(mealId, categoryName);
  };
});
