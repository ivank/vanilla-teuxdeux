/**
 * date-fns re-implementation
 */

const idFormat = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

export function toISODate(date) {
  const parts = idFormat.formatToParts(date);
  return `${parts.find((part) => part.type === 'year').value}-${
    parts.find((part) => part.type === 'month').value
  }-${parts.find((part) => part.type === 'day').value}`;
}

export function addDays(days, date) {
  return new Date(date.valueOf() + 24 * 60 * 60 * 1000 * days);
}

export function startOfDay(date) {
  const day = new Date(date);
  day.setHours(0, 0, 0, 0);
  return day;
}

export function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function diffDays(from, to) {
  const diffTime = from - to;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Custom helpers
 */

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

/**
 * lodash/fp re-implementations
 */

export function flow(...fns) {
  return function (data) {
    return fns.reduce((acc, fn) => fn(acc), data);
  };
}

export function map(fn) {
  return function (data) {
    return data.map(fn);
  };
}

export function filter(fn) {
  return function (data) {
    return data.filter(fn);
  };
}

export function reduce(fn, initial) {
  return function (data) {
    return data.reduce(fn, initial);
  };
}

export function update(path, fn) {
  const pathArray = typeof path === 'string' ? path.split('.') : path;
  return function (data) {
    return pathArray.length === 0
      ? fn(data)
      : { ...data, [pathArray[0]]: update(pathArray.slice(1), fn)(data[pathArray[0]]) };
  };
}

export function set(path, value) {
  return update(path, () => value);
}

export function pull(...value) {
  return filter((item) => !value.includes(item));
}

/**
 * Some custom helpers based on lodash
 */

export function append(path, item) {
  return update(path, (items) => [...items, item]);
}

export function insert(newItem, item, isAfter) {
  return reduce(
    (acc, current) =>
      acc.concat(current === item ? (isAfter ? [current, newItem] : [newItem, current]) : current),
    [],
  );
}

export function insertId(toNewItem, itemId, isAfter) {
  return reduce(
    (acc, current) =>
      acc.concat(
        current.id === itemId
          ? isAfter
            ? [current, toNewItem(current)]
            : [toNewItem(current), current]
          : current,
      ),
    [],
  );
}

export function pullId(...value) {
  return filter((item) => !value.includes(item.id));
}

export function mapOnlyId(id, fn) {
  return map((item) => (item.id === id ? fn(item) : item));
}
