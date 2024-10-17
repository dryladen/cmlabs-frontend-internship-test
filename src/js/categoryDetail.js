// Fungsi untuk memuat halaman detail kategori
let allMeals = [];
export function loadCategoryDetailPage(categoryName) {
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

export function displayDetailCategory(meals) {
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