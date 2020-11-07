import { moveIndex } from '../utils.js';

export function updateList({ prevIds = [], nextIds = [], add, update, element }) {
  prevIds.forEach((prevId) => {
    if (nextIds.every((nextId) => prevId !== nextId)) {
      element.querySelector(`#${prevId}`).remove();
    }
  });

  let prevIdsFiltered = prevIds.filter((prevId) => nextIds.some((nextId) => prevId === nextId));
  let current = Array.from(element.querySelectorAll(':scope > *'));

  nextIds.forEach((nextId, nextIndex) => {
    const prevIndex = prevIdsFiltered.findIndex((prevId) => prevId === nextId);
    const prevId = prevIndex !== -1 ? prevIdsFiltered[prevIndex] : undefined;

    if (prevId) {
      const updatedItem = element.querySelector(`#${nextId}`);
      update(updatedItem);
      if (prevIndex !== nextIndex && current[nextIndex]) {
        element.insertBefore(updatedItem, current[nextIndex]);
        prevIdsFiltered = moveIndex(prevIndex, nextIndex, prevIdsFiltered);
      }
    } else {
      const newItem = add(nextId);
      if (current[nextIndex]) {
        element.insertBefore(newItem, current[nextIndex]);
      } else {
        element.appendChild(newItem);
      }
    }
    current = Array.from(element.querySelectorAll(':scope > *'));
  });
}

export function component(id, template) {
  const container = document.createElement('div');
  container.innerHTML = template.trim();
  const el = container.firstChild;
  el.id = id;
  return el;
}

const replacements = [
  [/\*\*(?<text>[^\n]+)\*\*/, '<strong>$<text></strong>'],
  [/\_(?<text>[^\n]+)\_/, '<em>$<text></em>'],
  [/\[(?<text>[^\n\]]+)\]\((?<link>[^\)]+)\)/, '<a href="$<link>" target="_blank">$<text></a>'],
];

export function markdownToHtml(text) {
  return replacements.reduce((acc, [regex, replacement]) => acc.replace(regex, replacement), text);
}

export function dispatch(detail, el) {
  detail.type
    ? el.dispatchEvent(new CustomEvent('action', { detail, bubbles: true }))
    : detail((detail) => el.dispatchEvent(new CustomEvent('action', { detail, bubbles: true })));
}
