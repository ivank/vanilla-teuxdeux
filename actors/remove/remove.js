document.addEventListener('click', function (event) {
  if ('remove' in event.target.dataset) {
    const $target = event.target.closest('[data-remove-target]');
    $target.classList.add('remove', 'fade-out');
    setTimeout(() => $target.remove(), 200);
  }
  event.preventDefault();
});
