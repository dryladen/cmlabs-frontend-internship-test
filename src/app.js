$(document).ready(function () {
  let allCategories = [];
  let allMeals = [];
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
        allCategories = response.categories;
        let categoryHtml = `
          <div class="flex flex-col h-72 bg-gray-50 justify-center">
            <div class="flex flex-col gap-6 w-full justify-center items-center ">
              <div id="jumbotronIcon" class="flex text-secondary gap-4">
                <img src="/public/soup.svg" alt="Soup" class="text-secondary">
                <img src="/public/utensils.svg" alt="Utensils" class="text-secondary">
                <img src="/public/cake.svg" alt="Cake" class="text-secondary">
              </div>
              <span id="jumbotronDesc" class="text-xl text-primary font-semibold">mealapp API Website</span>
            </div>
            <h1 id="jumbotronLabel" class="text-3xl md:text-[46px] lg:text-[64px] font-bold text-primary text-center my-6">See All The Delicous
              Foods</h1>
            </div>
            <div class="p-4 md:py-10 md:px-20 xl:px-40">
              <div id="categoryList" class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              </div>
            </div>
          </div>`;
        $('#app-container').html(categoryHtml);
        displayCategoryList(allCategories);
        document.title = 'mealapp';
        history.pushState({ page: 'category' }, 'Categories', '/');
        // animasi untuk jumbotronIcon
        gsap.to("#jumbotronIcon > img", {
          y: -10,
          rotate: 360,
          duration: 1,
          repeat: -1,
          repeatDelay: 1,
          ease: 'elastic.inOut',
          yoyo: true,
          stagger: 0.5
        });
        gsap.from("#jumbotronLabel", {
          y: -50,
          opacity: 0,
          duration: 1,
          ease: 'back.out',
        });
        gsap.from("#jumbotronDesc", {
          y: -50,
          opacity: 0,
          duration: 1,
          delay: 0.2,
          ease: 'back.out',
        });
      },
      error: function (error) {
        console.error('Error fetching categories', error);
      }
    });
    // Event listener untuk pencarian di halaman kategori
    $('.search-input').off('input').on('input', function () {
      const searchQuery = $(this).val().toLowerCase(); // Ambil nilai input
      const filteredCategories = allCategories.filter(category =>
        category.strCategory.toLowerCase().includes(searchQuery)
      );
      displayCategoryList(filteredCategories);
    });
  }

  // fungsi untuk menampilkan daftar kategori
  function displayCategoryList(categories) {
    let categoryList = '';
    if (categories.length === 0) {
      categoryList += `<p class="text-center text-xl text-red-500 col-span-full">No categories found.</p>`;
    } else {
      categories.forEach(function (category) {
        categoryList += `
          <div class="box cursor-pointer relative group overflow-hidden rounded-2xl" onclick="navigateToCategoryDetail('${category.strCategory}')">
            <img src="${category.strCategoryThumb}" alt="${category.strCategory}" class="w-full object-cover group-hover:scale-110 h-40 transition-all rounded-2xl" />
            <div class="absolute inset-0 bg-black rounded-2xl bg-opacity-40 flex items-center justify-center group-hover:opacity-100 transition-opacity duration-300">
              <span class="text-white text-center text-xl font-semibold px-2">${category.strCategory}</span>
            </div>
          </div>`;
      });
    }
    $('#categoryList').html(categoryList);
    // animasi category list
    gsap.to(".box", {
      duration: 1,
      opacity: 1,
      stagger: 0.1,
      y: 0,
      ease: "back.out",
      force3D: true
    });
  }

  // Fungsi untuk memuat halaman detail kategori
  function loadCategoryDetailPage(categoryName) {
    $.ajax({
      url: `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryName}`,
      type: 'GET',
      success: function (response) {
        allMeals = response.meals;
        let mealHtml = `
        <div class="p-4 md:py-10 md:px-20 xl:px-40 bg-gray-50">
          <div class="font-semibold text-secondary items-center flex flex-wrap gap-2 w-full">
            <div class="flex gap-[2px]">
              <img src="/public//home.svg" alt="Soup" class="text-secondary">
              <span class="cursor-pointer" onclick="navigateToCategoryList()">Home</span>
            </div>
            / 
            <span class="text-gray-400">${categoryName}</span>
          </div> 
          <h2 class="text-3xl md:text-[46px] xl:text-[64px] text-primary font-bold my-4 md:my-6 xl:my-8">${categoryName}</h2>
          <div id="categoryList" class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"></div>
        </div>`;
        $('#app-container').html(mealHtml);
        displayDetailCategory(allMeals);
        document.title = `mealapp : ${categoryName}`;
        history.pushState({ page: 'category-detail', param: categoryName }, `Category: ${categoryName}`, `?category-name=${categoryName}`);
        // animasi category list
        gsap.to(".box", {
          duration: 1,
          opacity: 1,
          stagger: 0.1,
          y: 0,
          ease: "back.out",
          force3D: true
        });
      },
      error: function (error) {
        console.error('Error fetching meals', error);
      }
    });
    // Event listener untuk pencarian di halaman detail kategori
    $('.search-input').off('input').on('input', function () {
      const searchQuery = $(this).val().toLowerCase(); // Ambil nilai input
      const filterdMeals = allMeals.filter(meal =>
        meal.strMeal.toLowerCase().includes(searchQuery)
      );
      displayDetailCategory(filterdMeals);
    });

  }

  function displayDetailCategory(meals) {
    let listMeal = '';
    meals.forEach(function (meal) {
      listMeal += `<div class="box cursor-pointer relative group overflow-hidden rounded-2xl" onclick="navigateToMealDetail('${meal.idMeal}')">
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="w-full object-cover group-hover:scale-110 h-40 transition-all duration-300" />
          <div class="absolute inset-0 bg-black rounded-2xl bg-opacity-40 flex items-center justify-center group-hover:opacity-100 transition-opacity ">
            <span class="text-white text-center text-xl font-semibold px-2">${meal.strMeal}</span>
          </div>
        </div>`;
    });
    $('#categoryList').html(listMeal);
    // animasi category list
    gsap.to(".box", {
      duration: 1,
      opacity: 1,
      stagger: 0.1,
      y: 0,
      ease: "back.out",
      force3D: true
    });
  }

  // Fungsi untuk memuat halaman detail meal
  function loadMealDetailPage(mealId) {
    $.ajax({
      url: `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`,
      type: 'GET',
      success: function (response) {
        const meal = response.meals[0];
        let ingredientsHtml = '';
        let instructionHTML = '';
        for (let i = 1; i <= 20; i++) {
          if (meal[`strIngredient${i}`]) {
            ingredientsHtml += `<li>${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}</li>`;
          }
        }
        let instructionText = meal.strInstructions.split('\r\n');
        for (let i = 0; i < instructionText.length; i++) {
          if (instructionText[i]) {
            instructionHTML += `<p>${instructionText[i]}</p><br>`;
          }
        }
        const mealDetailHtml = `
          <div class="p-4 md:py-10 md:px-20 xl:px-40 bg-gray-50">
            <div class="font-semibold text-secondary items-center flex flex-wrap gap-2 w-full">
              <div class="flex gap-[2px]">
                <img src="/public//home.svg" alt="Soup" class="text-secondary">
                <span class="cursor-pointer" onclick="navigateToCategoryList()">Home</span>
              </div> /
              <span class="cursor-pointer" onclick="navigateToCategoryDetail('${meal.strCategory}')">${meal.strCategory}</span> /
              <span class="text-gray-400">${meal.strMeal}</span>
            </div>
            <div class="flex flex-col my-4 gap-4 md:gap-0 md:my-6 overflow-hidden md:shadow-md rounded-lg">
              <h1 id="mealLabel" class="text-3xl md:text-[46px] xl:text-[64px] md:text-start rounded-lg h-full md:rounded-none font-bold leading-normal p-4 md:px-8 text-primary bg-secondary bg-opacity-30">
                ${meal.strMeal}
              </h1>
              <div class="flex flex-col sm:p-4 md:p-8 gap-4 ">
                <div id="recipes" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="relative overflow-hidden">
                    <img id="mealImg" src="${meal.strMealThumb}" alt="${meal.strMeal}"
                      class="w-full h-full object-cover rounded-lg " />
                    <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg"></div>
                    <div class="absolute bottom-4 left-4 text-white text-2xl font-serif">
                      ${meal.strArea} Culinary
                    </div>
                  </div>
                  <div class="flex flex-col gap-4">
                    <div class="flex gap-2 items-center text-secondary ">
                      <img src="/public//scroll-text.svg" alt="scroll-text.svg">
                      <h3 class="text-3xl font-semibold ">Recipes</h3>
                    </div>
                    <ul
                      class="list-disc list-inside bg-white rounded-lg p-4 border-[1px] border-secondary text-primary font-medium">
                      ${ingredientsHtml}
                    </ul>
                  </div>
                </div>
                <div class="flex flex-col  gap-4">
                  <div id="instructions" class="flex flex-col gap-4">
                    <div class="flex gap-2 items-center text-secondary ">
                      <img src="/public//chef-hat.svg" alt="chef-hat">
                      <h3 class="text-3xl font-semibold ">Instruction</h3>
                    </div>
                    <div class="flex flex-col">
                      <div id="instructionText" class="p-4 border-[1px] relative border-secondary rounded-lg bg-white bg-opacity-50 text-primary font-medium h-60 overflow-hidden transition-all duration-150 pb-8">
                        ${instructionHTML}
                        <button id="readmore" class="z-10 absolute bottom-0 left-0 right-0 text-primary font-semibold bg-gradient-to-t from-gray-100 rounded-b-lg py-4 hover:from-gray-200 hover:text-secondary transition-all duration-300">Read More</button>
                      </div>
                    </div>  
                  </div>
                  <hr class="border-secondary my-6">
                  <div class="flex flex-col">
                    <div class="flex gap-2 items-center text-secondary ">
                      <img src="/public//youtube.svg" alt="youtube.svg">
                      <h3 class="text-3xl font-semibold ">Video Tutorial</h3>
                    </div>
                    <iframe class="mt-4 mx-auto block w-full h-96 rounded-lg" src="https://www.youtube.com/embed/${meal.strYoutube.split('v=')[1]}"
                      frameborder="0" allowfullscreen>
                    </iframe>
                  </div>
                </div>
              </div>
            </div>
          </div>
          `;
        $('#app-container').html(mealDetailHtml);
        $('#readmore').on('click', function () {
          $('#instructionText').toggleClass('h-auto');
          $('#readmore').text($('#instructionText').hasClass('h-auto') ?
            'Read Less' : 'Read More');
        });
        document.title = `mealapp : ${meal.strMeal}`;
        history.pushState({ page: 'meal-detail', param: mealId }, `Meal: ${meal.strMeal}`, `?meal-id=${mealId}`);
        // animasi untuk detail meal label
        gsap.from("#mealLabel", {
          duration: 1,
          opacity: 0,
          y: -100,
          ease: 'back.out',
        });
        // animasi untuk detail meal image
        gsap.from("#mealImg", {
          duration: 1,
          opacity: 0,
          x: -100,
          ease: 'expo.out',
        });
        // animasi untuk detail meal recipes
        gsap.from("#recipes", {
          duration: 1,
          opacity: 0,
          y: 100,
          ease: 'expo.out',
        });
        // animasi untuk detail meal instructions
        gsap.from("#instructions", {
          duration: 1,
          opacity: 0,
          y: 100,
          ease: 'expo.out',
        });
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
  window.navigateToMealDetail = function (mealId) {
    loadMealDetailPage(mealId);
  };
});
