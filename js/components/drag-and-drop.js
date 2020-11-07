function isOverEnd(direction, element, event) {
  if (direction === 'horizontal') {
    return (element.scrollWidth - event.offsetX) / element.scrollWidth <= 0.5;
  } else if ((direction = 'vertical')) {
    return (element.scrollHeight - event.offsetY) / element.scrollHeight <= 0.5;
  }
}

export function dropZone({ element, name, onDrop }) {
  element.addEventListener('drop', (event) => {
    const moveId = event.dataTransfer.getData(name);
    if (moveId) {
      onDrop({ moveId: event.dataTransfer.getData(name), element });
      event.preventDefault();
    }
  });

  element.addEventListener('dragover', (event) => {
    event.preventDefault();
  });
}

export function dragAndDrop({ element, handle, toText, name, direction, onMove }) {
  if (handle) {
    handle.addEventListener('mousedown', () => {
      element.handle = handle;
    });
    handle.addEventListener('mouseup', () => {
      delete element.handle;
    });
  }

  element.addEventListener('dragstart', (event) => {
    if (element === event.target) {
      if (!handle || element.handle) {
        setTimeout(() => element.classList.add('is-drag'));

        event.dataTransfer.dropEffect = 'move';
        event.dataTransfer.setData('text/plain', toText(element));
        event.dataTransfer.setData(name, element.id);
      } else {
        event.preventDefault();
      }
    }
  });

  element.addEventListener('dragend', () => {
    element.classList.remove('is-drag');
  });

  element.addEventListener('drop', (event) => {
    const moveId = event.dataTransfer.getData(name);
    if (moveId) {
      const overEnd = isOverEnd(direction, element, event);

      /**
       * Add and remove is-dropped to cut the dragenter / dragleave animation
       */
      element.classList.add('is-dropped');
      setTimeout(() => element.classList.remove('is-dropped'));

      element.classList.remove('is-dragover-start', 'is-dragover-end');

      if (moveId !== element.id) {
        onMove({ element, event, moveId, overEnd });
      }
      event.stopPropagation();
      event.preventDefault();
    }
  });

  element.addEventListener('dragover', (event) => {
    const overEnd = isOverEnd(direction, element, event);
    element.classList.toggle('is-dragover-start', !overEnd);
    element.classList.toggle('is-dragover-end', overEnd);
    event.preventDefault();
  });

  element.addEventListener('dragenter', (event) => {
    const overEnd = isOverEnd(direction, element, event);
    element.classList.toggle('is-dragover-start', !overEnd);
    element.classList.toggle('is-dragover-end', overEnd);
    event.preventDefault();
  });

  element.addEventListener('dragleave', (event) => {
    element.classList.remove('is-dragover-start', 'is-dragover-end');
    event.preventDefault();
  });
}
