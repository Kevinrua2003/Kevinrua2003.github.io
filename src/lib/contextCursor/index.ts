import { addCursor, setStyles } from "./chunks";
import contextMode from "./modes/contextMode";
import propNames from "./propNames";
import type { CProps } from "./types";

const contextCursor = (props: CProps = {}) => {
  const opts: Required<CProps> = {
    radius: props.radius || 20,
    transitionSpeed: props.transitionSpeed || 0.16,
    parallaxIndex: props.parallaxIndex || 10,
    hoverPadding: props.hoverPadding || 6,
  };

  setStyles();
  const cCursor = addCursor(opts);

  window.onload = () => {
    const interactElements = document.querySelectorAll(
      `[${propNames.dataAttr}]`
    ) as NodeListOf<Element>;
    contextMode(cCursor, opts, interactElements);
  };
};

export default contextCursor;
