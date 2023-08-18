function offset(element: HTMLElement) {
  const rect = element.getBoundingClientRect();

  return {
    top: rect.top + document.body.scrollTop,
    left: rect.left + document.body.scrollLeft,
  };
}

export function getOffset(element: HTMLElement): any {
  const offsetElement = offset(element);
  const rectElement = element.getBoundingClientRect();

  const bottom = offsetElement.left === 0 && offsetElement.top === 0 ? 0 : window.innerHeight - rectElement.bottom;

  return {
    ...offsetElement,
    bottom,
  };
}
