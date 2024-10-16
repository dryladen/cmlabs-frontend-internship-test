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
                <div class="absolute inset-0 bg-black rounded-2xl bg-opacity-30 flex items-center justify-center group-hover:opacity-100 transition-opacity duration-300">
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
        <h2 class="text-3xl md:text-[46px] xl:text-[64px] text-primary font-bold my-6">${categoryName}</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-6">`;
        meals.forEach(function (meal) {
          mealHtml += `
            <div class="cursor-pointer relative group overflow-hidden rounded-2xl" onclick="navigateToMealDetail('${meal.idMeal}')">
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
  function loadMealDetailPage(mealId) {
    $.ajax({
      url: `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`,
      type: 'GET',
      success: function (response) {
        const meal = response.meals[0];
        const mealDetailHtml = `
                  <h1 class="text-3xl font-bold text-center my-6">${meal.strMeal}</h1>
                  <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="w-full md:w-1/2 mx-auto" />
                  <p class="text-center my-4">${meal.strInstructions}</p>
                  <h3 class="text-xl font-semibold mt-4 text-center">Recipe:</h3>
                  <ul class="list-disc list-inside text-center">
                      ${meal.strIngredient1 ? `<li>${meal.strIngredient1} - ${meal.strMeasure1}</li>` : ''}
                      ${meal.strIngredient2 ? `<li>${meal.strIngredient2} - ${meal.strMeasure2}</li>` : ''}
                  </ul>
                  <iframe width="560" height="315" class="mt-4 mx-auto block"
                      src="https://www.youtube.com/embed/${meal.strYoutube.split('v=')[1]}" 
                      frameborder="0" allowfullscreen></iframe>
              `;
        $('#app-container').html(mealDetailHtml);
        history.pushState({ page: 'meal-detail', param: mealId }, `Meal: ${meal.strMeal}`, `?meal-id=${mealId}`);
      },
      error: function (error) {
        console.error('Error fetching meal details', error);
      }
    });
  }

  // Fungsi untuk navigasi ke detail kategori
  window.navigateToCategoryDetail = function (categoryName) {
    loadCategoryDetailPage(categoryName);
  };

  // Fungsi untuk navigasi ke detail meal
  window.navigateToMealDetail = function (mealId) {
    loadMealDetailPage(mealId);
  };
});
