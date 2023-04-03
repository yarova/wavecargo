import '../node_modules/bootstrap/scss/bootstrap.scss';
import './styles.scss';
import { Modal } from 'bootstrap';
import $ from 'jquery';


const successModal = Modal.getOrCreateInstance(document.querySelector('#successModal'));
const markers = document.querySelectorAll('.pin');


$.fn.scrollTo = function (duration, easing, complete) {
  return $.each(this, function () {
    $('html, body').animate({
      scrollTop: $(this).offset().top
    }, duration, easing, complete);
  })
}


function animateScrollOnAnchorClick() {
  $(document).on('click', 'a[href^="#"]', function (e) {
    e.preventDefault();
    $($(this).attr('href')).scrollTo(600, 'swing');
  });
}


function scrollToSectionOnLoad() {
  $(window.location.hash).scrollTo(600, 'swing');
}


function timeTillEndOfDay() {
  const now = new Date();
  const midnight = new Date();
  midnight.setSeconds(0);
  midnight.setMinutes(0);
  midnight.setHours(24);
  const utcTime = new Date(midnight - now).toISOString();
  return /(\d+):(\d+):(\d+)/.exec(utcTime)[0];
}


function animateTimers() {
  setInterval(() => {
    const time = timeTillEndOfDay();
    document.querySelectorAll('[data-timer="remaining"]').forEach((timeElement) => {
      timeElement.innerHTML = time;
    });
  }, 1000);
}


function handleSubmit() {
  document.querySelectorAll('.needs-validation').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (form.checkValidity()) {
        console.log('Here we can send ajax request to backend');
        successModal.show();
      }

    }, false);
  });
}


function positionMarkers() {
  markers.forEach((marker) => {
    const x = marker.dataset.x;
    const y = marker.dataset.y;
    marker.style.left = `calc(100% / 1000 * ${x})`;
    marker.style.top = `calc(100% / 800 * ${y})`;
  });
}


function animatePinsOnScroll() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const pins = document.querySelectorAll('.pin');
        pins.forEach((pin, index) => {
          pin.style.animation = `fall ${0.5 + index * 0.2}s ease forwards`;
        });
      }
    });
  });

  observer.observe(document.querySelector('#map'));
}


animateScrollOnAnchorClick();
scrollToSectionOnLoad();
animateTimers();
positionMarkers();
handleSubmit();

window.addEventListener('resize', positionMarkers);
window.addEventListener('load', animatePinsOnScroll);
