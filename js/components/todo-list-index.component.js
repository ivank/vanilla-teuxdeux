import { component, dispatch } from './html.js';
import { toNamedList } from '../state.js';

const template = /* html */ `
  <button class="btn light tooltip-container">
    <div class="tooltip" data-todo-list-index-name>Title</div>
    <span>
      &#9679;
    </span>
  </button>
`;

export function update(prevState, nextState, el) {
  const next = nextState.data.todoLists.find((list) => list.id === el.id);
  const nextIndex = nextState.data.todoLists.findIndex((list) => list.id === el.id);
  el.isActive =
    nextIndex >= nextState.data.namedLists.index && nextIndex < nextState.data.namedLists.index + 5;

  el.querySelector('[data-todo-list-index-name]').innerText = next.name;
  el.classList.toggle('is-active', el.isActive);

  return el;
}

export function create(id, state) {
  const el = update(undefined, state, component(id, template));

  el.addEventListener('click', () => {
    if (!el.isActive) {
      dispatch(toNamedList(el.id), el);
    }
  });

  return el;
}
