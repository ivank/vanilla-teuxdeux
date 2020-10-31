let state = {
  dailyLists: {
    currentDay: new Date('2020-01-01'),
    items: [
      { id: 't4', text: 'asdasd', day: new Date('2020-01-01'), isDone: false, isEdit: true },
      { id: 't5', text: 'sdfxcv', day: new Date('2020-01-01'), isDone: true },
    ],
  },
  namedLists: {
    index: 0,
    items: [
      {
        id: 'n1',
        name: 'test',
        items: [
          { id: 't1', text: 'asdasd', isDone: false, isEdit: true },
          { id: 't2', text: 'sdfxcv', isDone: true },
        ],
      },
      {
        id: 'n2',
        name: 'other',
        items: [
          { id: 't3', text: 'asdasd', isDone: false },
          { id: 't4', text: 'sdfxcv', isDone: true },
        ],
      },
    ],
  },
};

function uid() {
  return 'id' + (performance.now().toString(36) + Math.random().toString(36)).replace(/\./g, '');
}

function updateApp($app, state) {
  $app.querySelector('named-lists').data = state.namedLists;
}

function reducer(state, detail) {
  switch (detail.type) {
    case 'ADD_TODO_ITEM':
      const todoItem = { id: uid(), text: 'newly added' };
      return {
        ...state,
        namedLists: {
          ...state.namedLists,
          items: state.namedLists.items.map((list) =>
            list.id === detail.id ? { ...list, items: [...list.items, todoItem] } : list,
          ),
        },
      };

    case 'ADD_NAMED_LIST':
      const namedList = { id: uid(), items: [], name: 'new list' };
      return {
        ...state,
        namedLists: {
          ...state.namedLists,
          items: [...state.namedLists.items, namedList],
        },
      };

    case 'TOGGLE_TODO_ITEM_DONE':
      return {
        ...state,
        namedLists: {
          ...state.namedLists,
          items: state.namedLists.items.map((list) => ({
            ...list,
            items: list.items.map((item) =>
              item.id === detail.id ? { ...item, isDone: detail.toggle } : item,
            ),
          })),
        },
      };

    case 'CHANGE_TODO_ITEM_TEXT':
      return {
        ...state,
        namedLists: {
          ...state.namedLists,
          items: state.namedLists.items.map((list) => ({
            ...list,
            items: list.items.map((item) =>
              item.id === detail.id ? { ...item, text: detail.text } : item,
            ),
          })),
        },
      };

    case 'REMOVE_TODO_ITEM':
      return {
        ...state,
        namedLists: {
          ...state.namedLists,
          items: state.namedLists.items.map((list) => ({
            ...list,
            items: list.items.filter((item) => item.id !== detail.id),
          })),
        },
      };
  }
}

const $app = document.getElementById('app');
updateApp($app, state);

document.addEventListener('action', (event) => {
  const newState = reducer(state, event.detail);
  updateApp($app, newState);
  state = newState;
});
