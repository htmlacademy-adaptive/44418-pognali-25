let header = document.querySelector(".header")
let toggle = document.querySelector(".toggle-button")
let rateButton = document.querySelector(".rate-button")
let modal = document.querySelector(".modal")
let btnModalClose = document.querySelector(".modal__close")

let openMobileMenu = function() {
  if(header.classList.contains("header--open-modile")) {
    header.classList.remove("header--open-modile")
  } else {
    header.classList.add("header--open-modile")
  }
}

let openModal = function() {
  modal.classList.add("modal--open")
  document.body.style.overflow = 'hidden';
}

let closeModal = function() {
  modal.classList.remove("modal--open")
  document.body.style.overflow = '';
}

let sticky = function() {
  if(window.pageYOffset >= 100) {
    header.classList.add("header--sticky")
  } else {
    header.classList.remove("header--sticky")
  }
}


toggle.addEventListener("click", openMobileMenu)
window.addEventListener('scroll', sticky)

if(modal) {
  rateButton.addEventListener("click", openModal)
  btnModalClose.addEventListener("click", closeModal)
}
