import { component, dispatch, updateList } from './html.js';
import { addNamedList, changeNamedListIndex, toggleNamedLists } from '../state.js';
import * as todoList from './todo-list.component.js';
import * as todoListIndex from './todo-list-index.component.js';

const template = /* html */ `
  <div class="named-lists">
    <div class="section-header primary">
      <div class="start">
        <button
          type="button"
          class="btn primary icon"
          data-named-lists-toggle
          title="Toggle named lists">
            <span class="toggle">&#9650;</span>
        </button>
      </div>
      <div class="center" data-named-lists-index></div>
      <div class="end">
        <button type="button" class="btn primary icon add" data-named-lists-add title="Add a named list">
          +
        </button>
      </div>
    </div>
    <div class="todo-lists" data-named-lists-content>
      <div class="left-ui">
        <button type="button" class="btn" data-named-lists-prev>
          &lsaquo;
        </button>
      </div>
      <div class="items-container">
        <div class="items is-animating" data-named-lists-items></div>
      </div>
      <div class="right-ui">
        <button type="button" class="btn" data-named-lists-next>
          &rsaquo;
        </button>
      </div>
    </div>
  </div>
`;

export function update(prevState, nextState, el) {
  el.querySelector('[data-named-lists-toggle]').classList.toggle(
    'is-active',
    !nextState.data.namedLists.isHidden,
  );

  el.querySelector('[data-named-lists-content]').classList.toggle(
    'is-hidden',
    nextState.data.namedLists.isHidden,
  );

  el.querySelector('[data-named-lists-prev]').toggleAttribute(
    'disabled',
    nextState.data.namedLists.index <= 0,
  );
  el.querySelector('[data-named-lists-next]').toggleAttribute(
    'disabled',
    nextState.data.namedLists.index >= nextState.data.namedLists.items.length - 5,
  );

  const prevIds = prevState?.data.namedLists.items;
  const nextIds = nextState.data.namedLists.items;

  const items = el.querySelector('[data-named-lists-items]');

  items.style.width = `calc((100% / 5) * (${Math.max(5, nextIds.length)}))`;
  items.style.marginLeft = `calc((100% / 5) * (${-nextState.data.namedLists.index}))`;

  updateList({
    element: items,
    prevIds,
    nextIds,
    add: (id) => todoList.create(id, nextState),
    update: (item) => todoList.update(prevState, nextState, item),
  });

  const prevIdsIndex = prevState?.data.namedLists?.items;
  const nextIdsIndex = nextState.data.namedLists.items;

  updateList({
    element: el.querySelector('[data-named-lists-index]'),
    prevIds: prevIdsIndex,
    nextIds: nextIdsIndex,
    add: (id) => todoListIndex.create(id, nextState),
    update: (item) => todoListIndex.update(prevState, nextState, item),
  });

  return el;
}

export function create(id, state) {
  const el = update(undefined, state, component(id, template));

  el.querySelector('[data-named-lists-toggle]').addEventListener('click', () => {
    dispatch(toggleNamedLists(), el);
  });

  el.querySelector('[data-named-lists-add]').addEventListener('click', () => {
    dispatch(addNamedList(), el);
  });

  el.querySelector('[data-named-lists-prev]').addEventListener('click', () => {
    dispatch(changeNamedListIndex(-1), el);
  });

  el.querySelector('[data-named-lists-next]').addEventListener('click', () => {
    dispatch(changeNamedListIndex(+1), el);
  });

  return el;
}
