let allCategories = [];
// Fungsi untuk memuat halaman kategori
export function loadCategoryPage() {
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
export function displayCategoryList(categories) {
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