;(function() {
  var navMain = document.querySelector('.main-nav');
  var navToggle = document.querySelector('.main-nav__toggle');
  var navClose = document.querySelector('.main-nav__close');

  navMain.classList.remove('main-nav--nojs');

  navToggle.addEventListener('click', function() {
    if (navMain.classList.contains('main-nav--closed')) {
      navMain.classList.remove('main-nav--closed');
      navMain.classList.add('main-nav--opened');
    } else {
      navMain.classList.add('main-nav--closed');
      navMain.classList.remove('main-nav--opened');
    }
  });

  navClose.addEventListener('click', function() {
    if (navMain.classList.contains('main-nav--opened')) {
      navMain.classList.add('main-nav--closed');
      navMain.classList.remove('main-nav--opened');
    }
  });
})()

;(function() {
  var success = document.getElementById('popup-success');
  var error = document.getElementById('popup-error');
  if (!success || !error) return;

  var successClose = success.querySelector('button');
  var errorClose = error.querySelector('button');
  var form = document.getElementById('review-form');
  var submit = form.querySelector('[type=submit]');

  successClose.addEventListener('click', closeModals);
  errorClose.addEventListener('click', closeModals);

  window.addEventListener('keydown', function (evt) {
      if (evt.keyCode === 27) closeModals(evt);
  });

  submit.addEventListener('click', function (evt) {
      if (form.checkValidity()) {
        evt.preventDefault();
        if (!success.classList.contains('popup--show')) success.classList.add('popup--show');
        if (error.classList.contains('popup--show')) error.classList.remove('popup--show');
      } else {
        if (success.classList.contains('popup--show')) success.classList.remove('popup--show');
        if (!error.classList.contains('popup--show')) error.classList.add('popup--show');
      }
  });

  function closeModals(evt) {
    evt.preventDefault();
    if (success.classList.contains('popup--show')) success.classList.remove('popup--show');
    if (error.classList.contains('popup--show')) error.classList.remove('popup--show');
  }
})()
