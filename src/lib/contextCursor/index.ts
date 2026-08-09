import { addCursor, setStyles } from "./chunks";
import contextMode from "./modes/contextMode";
import propNames from "./propNames";
import type { CProps } from "./types";

const contextCursor = (props: CProps = {}) => {
  // Guard: never create a second cursor or wire listeners twice.
  if (document.querySelector(".c-cursor")) return;

  const opts: Required<CProps> = {
    radius: props.radius || 20,
    transitionSpeed: props.transitionSpeed || 0.16,
    parallaxIndex: props.parallaxIndex || 10,
    hoverPadding: props.hoverPadding || 6,
  };

  setStyles();
  const cCursor = addCursor(opts);

  const wire = () => {
    const interactElements = document.querySelectorAll(
      `[${propNames.dataAttr}]`
    ) as NodeListOf<Element>;
    contextMode(cCursor, opts, interactElements);
  };

  // Wiring used to hang on `window.onload`, which fires only once: a
  // post-load activation would leave the cursor frozen and invisible.
  // Wire immediately when load has already fired, else defer to `load`.
  if (document.readyState === "complete") {
    wire();
  } else {
    window.addEventListener("load", wire, { once: true });
  }
};

export default contextCursor;
