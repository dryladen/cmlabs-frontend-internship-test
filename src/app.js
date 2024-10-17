import { loadCategoryDetailPage } from "./js/categoryDetail.js";
import { loadMealDetailPage } from "./js/mealDetail.js";
import { loadCategoryPage } from "./js/categoryList.js";

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
