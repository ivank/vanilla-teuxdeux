export function uid() {
  return 'id' + (performance.now().toString(36) + Math.random().toString(36)).replace(/\./g, '');
}

export function fence(min, max, value) {
  return Math.min(max, Math.max(min, value));
}

export function moveIndex(from, to, items) {
  const updated = [...items];
  if (to >= updated.length) {
    var k = to - updated.length + 1;
    while (k--) {
      updated.push(undefined);
    }
  }
  updated.splice(to, 0, updated.splice(from, 1)[0]);
  return updated;
}

export function changeDay(change, date) {
  const chnaged = new Date(date);
  chnaged.setDate(chnaged.getDate() + change);
  return chnaged;
}

export function diffDays(from, to) {
  const diffTime = from - to;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// export function flow(...fns) {
//   return function (data) {
//     return fns.reduce((acc, fn) => fn(acc), data);
//   };
// }

// export function map(fn) {
//   return function (data) {
//     return data.map(fn);
//   };
// }

// export function filter(fn) {
//   return function (data) {
//     return data.filter(fn);
//   };
// }

// export function update(path, fn) {
//   const pathArray = typeof path === 'string' ? path.split('.') : path;
//   return function (data) {
//     return pathArray.length === 0
//       ? fn(data)
//       : { ...data, [pathArray[0]]: update(pathArray.slice(1), fn)(data[pathArray[0]]) };
//   };
// }

// export function append(path, item) {
//   return update(path, (items) => [...items, item]);
// }

// export function set(path, value) {
//   return update(path, () => value);
// }

// export function pull(...value) {
//   return filter((item) => !value.includes(item));
// }

// export function pullId(...value) {
//   return filter((item) => !value.includes(item.id));
// }

// export function mapOnlyId(id, fn) {
//   return map((item) => (item.id === id ? fn(item) : item));
// }
