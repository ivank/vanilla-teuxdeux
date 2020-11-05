import { component, dispatch } from './component.js';
import { toNamedList } from '../state.js';

const template = /* html */ `
  <button class="btn todo-list-index" title="">
    &#9679;
  </button>
`;

export function update(prevState, nextState, el) {
  const next = nextState.todoLists.find((list) => list.id === el.id);
  const nextIndex = nextState.todoLists.findIndex((list) => list.id === el.id);
  el.isActive =
    nextIndex >= nextState.namedLists.index && nextIndex < nextState.namedLists.index + 7;

  el.title = next.name;
  el.classList.toggle('is-active', el.isActive);
  el.classList.toggle('disabled', el.isActive);

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
