function uid() {
  return (performance.now().toString(36) + Math.random().toString(36)).replace(/\./g, '');
}

document.addEventListener('click', function (event) {
  if ('add' in event.target.dataset) {
    const $collection = document.getElementById(event.target.dataset.add);
    $template = document.querySelector(`[data-add-template="${event.target.dataset.add}"]`);
    const $new = $template.cloneNode(true);
    $new.removeAttribute('style');
    $new.classList.add('add', 'fade-in');
    $new.id = uid();
    $collection.insertBefore($new, $template);
    setTimeout(() => $new.classList.remove('fade-in'), 1);
    setTimeout(() => $new.classList.remove('add'), 200);
  }
  event.preventDefault();
});
