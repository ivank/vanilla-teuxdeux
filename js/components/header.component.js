import { component, dispatch } from './html.js';
import { clearState, setPrevious } from '../state.js';

const template = /* html */ `
  <header class="primary">
    <h1>
      Vanilla TeuxDeux Case Study
      <small>
        <a href="http://github.com/ivank/vanilla-teuxdeux">
          (what's this?)
        </a>
      </small>
    </h1>
    <div class="header-controls">
      <button
        type="button"
        class="btn primary"
        data-header-clear title="Deletes the locally stored data from this device">
          Clear
      </button>
      <div class="header-controls-undo">
        <h3
          data-header-undo-title
          title="Currently on revision 1">
            Undo
        </h3>
        <button
          type="button"
          class="btn icon primary"
          title="Undo latest edit"
          data-header-undo>
            &#10226;
        </button>
        <button
          type="button"
          class="btn icon primary"
          title="Redo latest undo, only available after undo"
          data-header-redo>
            &#10227;
        </button>
      </div>
    </div>
  </header>
`;

export function update(prevState, nextState, el) {
  el.querySelector('[data-header-undo-title]').title = `Currently on revision ${nextState.index}`;
  el.querySelector('[data-header-undo]').toggleAttribute('disabled', nextState.index === 0);
  el.querySelector('[data-header-redo]').toggleAttribute(
    'disabled',
    nextState.index === nextState.previous.length - 1,
  );

  return el;
}

export function create(id, state) {
  const el = update(undefined, state, component(id, template));

  el.querySelector('[data-header-clear]').addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all todo information?')) {
      dispatch(clearState(), el);
    }
  });

  el.querySelector('[data-header-undo]').addEventListener('click', () => {
    dispatch(setPrevious(-1), el);
  });

  el.querySelector('[data-header-redo]').addEventListener('click', () => {
    dispatch(setPrevious(+1), el);
  });

  return el;
}
