import { component, dispatch } from './component.js';
import {
  toggleTodoItemDone,
  moveTodoItemOnItem,
  changeTodoItemText,
  removeTodoItem,
} from '../state.js';

export const template = /* html */ `
  <li class="todo-item" draggable="true">
    <div class="text" data-item-text>this is some content</div>
    <input type="text" data-item-input>
    <button type="button" class="todo-item-edit" data-item-edit>&#9998;</button>
    <button type="button" class="todo-item-remove" data-item-remove>&cross;</button>
  </li>
`;

export function update(prevState, nextState, el) {
  const next = nextState.todoItems.find((item) => item.id === el.id);
  el.isDone = next.isDone;
  el.classList.toggle('is-done', Boolean(next.isDone));
  el.classList.remove('is-drag', 'is-dragover');
  el.querySelector(':scope [data-item-text]').innerText = next.text;
  el.querySelector(':scope [data-item-input]').value = next.text;
  return el;
}

function isOverEnd(height, offsetY) {
  return (height - offsetY) / height >= 0.5;
}

export function create(id, state) {
  const el = update(undefined, state, component(id, template));

  const text = el.querySelector(':scope [data-item-text]');
  const edit = el.querySelector(':scope [data-item-edit]');
  const remove = el.querySelector(':scope [data-item-remove]');
  const input = el.querySelector(':scope [data-item-input]');

  /**
   * Drag
   */
  el.addEventListener('dragstart', (event) => {
    setTimeout(() => el.classList.add('is-drag'));

    event.dataTransfer.dropEffect = 'move';
    event.dataTransfer.setData('text/plain', event.target.innerText);
    event.dataTransfer.setData('application/todo-id', el.id);
  });

  el.addEventListener('dragend', () => {
    el.classList.remove('is-drag');
  });

  el.addEventListener('drop', (event) => {
    const toId = event.dataTransfer.getData('application/todo-id');

    /**
     * Add and remove is-dropped to cut the dragenter / dragleave animation
     */
    el.classList.add('is-dropped');
    setTimeout(() => el.classList.remove('is-dropped'));

    el.classList.remove('is-dragover-start', 'is-dragover-end');

    if (toId !== el.id) {
      const overEnd = isOverEnd(el.scrollHeight, event.offsetY);
      dispatch(
        moveTodoItemOnItem(event.dataTransfer.getData('application/todo-id'), el.id, overEnd),
        el,
      );
    }
    event.stopPropagation();
    event.preventDefault();
  });

  el.addEventListener('dragover', (event) => {
    const overEnd = isOverEnd(el.scrollHeight, event.offsetY);
    el.classList.toggle('is-dragover-start', overEnd);
    el.classList.toggle('is-dragover-end', !overEnd);
    event.preventDefault();
  });

  el.addEventListener('dragenter', (event) => {
    const overEnd = isOverEnd(el.scrollHeight, event.offsetY);
    el.classList.toggle('is-dragover-start', overEnd);
    el.classList.toggle('is-dragover-end', !overEnd);
    event.preventDefault();
  });

  el.addEventListener('dragleave', (event) => {
    el.classList.remove('is-dragover-start', 'is-dragover-end');
    event.preventDefault();
  });

  /**
   * Actions
   */

  text.addEventListener('click', () => {
    dispatch(toggleTodoItemDone(el.id, !el.isDone), el);
  });

  remove.addEventListener('click', () => {
    dispatch(removeTodoItem(el.id), el);
  });

  edit.addEventListener('click', () => {
    el.classList.toggle('is-edit', true);
    el.querySelector(':scope [data-item-input]').select();
  });

  input.addEventListener('blur', (event) => {
    el.classList.toggle('is-edit', false);
  });

  input.addEventListener('change', (event) => {
    el.classList.toggle('is-edit', false);
    if (event.target.value) {
      dispatch(changeTodoItemText(el.id, event.target.value), el);
    } else {
      dispatch(removeTodoItem(el.id), el);
    }
  });

  return el;
}
