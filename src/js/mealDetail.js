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
        <div class="font-semibold text-secondary items-center flex flex-wrap gap-2 w-full">
          <div class="flex gap-[2px]">
            <img src="/public//home.svg" alt="Soup" class="text-secondary">
            <span class="cursor-pointer" onclick="navigateToCategoryList()">Home</span>
          </div> /
          <span class="cursor-pointer" onclick="navigateToCategoryDetail('${meal.strCategory}')">${meal.strCategory}</span> /
          <span class="text-gray-400">${meal.strMeal}</span>
        </div>
        <div class="flex flex-col my-4 gap-4 md:gap-0 md:my-6 overflow-hidden md:shadow-md rounded-lg">
          <h1 class="text-3xl md:text-[46px] xl:text-[64px] md:text-start rounded-lg h-full md:rounded-none font-bold leading-normal p-4 md:px-8 text-primary bg-secondary bg-opacity-30">
            ${meal.strMeal}
          </h1>
          <div class="flex flex-col sm:p-4 md:p-8 gap-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="relative overflow-hidden">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}"
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
              <div class="flex flex-col gap-4">
                <div class="flex gap-2 items-center text-secondary ">
                  <img src="/public//chef-hat.svg" alt="chef-hat">
                  <h3 class="text-3xl font-semibold ">Instruction</h3>
                </div>
                <div class="p-4 border-[1px] border-secondary rounded-lg bg-white bg-opacity-50 text-primary font-medium">
                  ${instructionHTML}
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
        `;
      $('#app-container').html(mealDetailHtml);
      document.title = `mealapp : ${meal.strMeal}`;
      history.pushState({ page: 'meal-detail', param: mealId }, `Meal: ${meal.strMeal}`, `?meal-id=${mealId}`);
    },
    error: function (error) {
      console.error('Error fetching meal details', error);
    }
  });
}