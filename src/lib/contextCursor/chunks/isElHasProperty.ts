import propNames from "../propNames";

const isElHasProperty = (el: HTMLElement, property: string) =>
  el.getAttribute(propNames.dataAttr)?.includes(property) ?? false;

export default isElHasProperty;
