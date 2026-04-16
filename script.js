// DOM Elements
const bars = document.querySelector(".hamburger-btn");
const mobileMenuFixed = document.querySelector(".mobile-menu-fixed");
const menu = document.querySelector(".mobile-menu-container");

if (!bars || !mobileMenuFixed || !menu) {
  //Elements not found, don't run the script
} else {

  function openMenu() {
    mobileMenuFixed.classList.add('is-open');
  }

  function closeMenu() {
    mobileMenuFixed.classList.remove('is-open');
  }

  function toggleMenu() {
    if (mobileMenuFixed.classList.contains('is-open')) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  //Toggle Menu on click
  bars.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    toggleMenu();
  });

  //Close when a link inside the menu is clicked
  menu.addEventListener('click', function (e) {
    const link = e.target.closest('.mobile-menu-link');
    if (link) {
      closeMenu();
    }
  });

  //Close when clicking outside the menu (on the backdrop overlay)
  mobileMenuFixed.addEventListener("click", function(e) {
    if (!menu.contains(e.target)) {
      closeMenu();
    }
  });

}