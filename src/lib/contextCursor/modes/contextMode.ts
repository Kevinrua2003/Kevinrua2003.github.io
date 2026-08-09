import { getMoveIndex, isElHasProperty, getStyleProp } from "../chunks";
import propNames from "../propNames";
import type { CProps } from "../types";

interface CursorState {
  x: number;
  y: number;
  width: number;
  height: number;
  scale: number;
  borderRadius: number;
  filter: string;
  backgroundImage: string;
}

interface TargetElState {
  x: number;
  y: number;
  scale: number;
  boxShadow: string;
}

const createCursorState = (radius: number): CursorState => ({
  x: -200,
  y: -200,
  width: radius,
  height: radius,
  scale: 1,
  borderRadius: 200,
  filter: "",
  backgroundImage: "none",
});

const contextMode = (
  cursor: HTMLElement,
  props: Required<CProps>,
  interactElements: NodeListOf<Element>
) => {
  const parallaxSpeed = {
    cursor: props.parallaxIndex,
    target: props.parallaxIndex * 1.5,
  };

  const target: CursorState = createCursorState(props.radius);
  const current: CursorState = createCursorState(props.radius);
  const targetEl: TargetElState = {
    x: 0,
    y: 0,
    scale: 1,
    boxShadow: "0 7px 15px rgba(0,0,0,0.0)",
  };
  const currentEl: TargetElState = {
    x: 0,
    y: 0,
    scale: 1,
    boxShadow: "0 7px 15px rgba(0,0,0,0.0)",
  };

  let isHovered: boolean = false;
  let cursorTarget: HTMLElement | null = null;
  let rafId: number | null = null;
  let lastTime: number = 0;

  const lerp = (from: number, to: number, t: number) => from + (to - from) * t;

  // FPS-independent exponential easing; tau tuned so ~90% of the tween
  // completes in `transitionSpeed` seconds (tween-like feel).
  const ease = (dt: number) =>
    1 - Math.exp(-dt / (props.transitionSpeed * 1000 * 0.43));

  const applyCursor = () => {
    cursor.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) scale(${current.scale})`;
    cursor.style.width = `${current.width}px`;
    cursor.style.height = `${current.height}px`;
    cursor.style.borderRadius = `${current.borderRadius}px`;
    cursor.style.filter = current.filter;
    cursor.style.backgroundImage = current.backgroundImage;
  };

  const applyTargetEl = () => {
    if (cursorTarget) {
      cursorTarget.style.transform = `translate3d(${currentEl.x}px, ${currentEl.y}px, 0) scale(${currentEl.scale})`;
      cursorTarget.style.boxShadow = currentEl.boxShadow;
    }
  };

  const tick = (time: number) => {
    const dt = lastTime === 0 ? 16 : Math.min(time - lastTime, 64);
    lastTime = time;
    const t = ease(dt);

    current.x = lerp(current.x, target.x, t);
    current.y = lerp(current.y, target.y, t);
    current.width = lerp(current.width, target.width, t);
    current.height = lerp(current.height, target.height, t);
    current.scale = lerp(current.scale, target.scale, t);
    current.borderRadius = lerp(current.borderRadius, target.borderRadius, t);
    current.filter = target.filter;
    current.backgroundImage = target.backgroundImage;

    currentEl.x = lerp(currentEl.x, targetEl.x, t);
    currentEl.y = lerp(currentEl.y, targetEl.y, t);
    currentEl.scale = lerp(currentEl.scale, targetEl.scale, t);
    currentEl.boxShadow = targetEl.boxShadow;

    applyCursor();
    applyTargetEl();

    // Stop the loop when everything is at rest; restart on interaction.
    rafId =
      Math.abs(current.x - target.x) > 0.5 ||
      Math.abs(current.y - target.y) > 0.5 ||
      Math.abs(current.width - target.width) > 0.5 ||
      Math.abs(current.height - target.height) > 0.5 ||
      Math.abs(current.scale - target.scale) > 0.001 ||
      Math.abs(current.borderRadius - target.borderRadius) > 0.5 ||
      Math.abs(currentEl.x - targetEl.x) > 0.5 ||
      Math.abs(currentEl.y - targetEl.y) > 0.5 ||
      Math.abs(currentEl.scale - targetEl.scale) > 0.001
        ? requestAnimationFrame(tick)
        : null;
  };

  const startLoop = () => {
    if (rafId !== null) return;
    lastTime = 0;
    rafId = requestAnimationFrame(tick);
  };

  const moveCursor = (e: MouseEvent) => {
    if (!isHovered || !cursorTarget) {
      target.x = e.clientX - props.radius / 2;
      target.y = e.clientY - props.radius / 2;
    } else {
      const rect = cursorTarget.getBoundingClientRect();
      const borderRadius = Number(
        window.getComputedStyle(cursorTarget).borderRadius.slice(0, -2)
      );

      if (isElHasProperty(cursorTarget, propNames.lift)) {
        targetEl.x = getMoveIndex(
          e.clientX,
          rect.left,
          cursorTarget.clientWidth,
          parallaxSpeed.target
        );
        targetEl.y = getMoveIndex(
          e.clientY,
          rect.top,
          cursorTarget.clientHeight,
          parallaxSpeed.target
        );
        targetEl.scale = 1.1;
        targetEl.boxShadow = getStyleProp("--ghost-shadow");
        target.filter = "blur(8px)";
        target.x =
          rect.left +
          (e.clientX - rect.left - cursorTarget.clientWidth / 2) /
            parallaxSpeed.cursor;
        target.y =
          rect.top +
          (e.clientY - rect.top - cursorTarget.clientHeight / 2) /
            parallaxSpeed.cursor;
        target.backgroundImage = `radial-gradient(circle at ${
          e.clientX - rect.left
        }px ${
          e.clientY - rect.top
        }px, rgba(255,255,255,0.4), rgba(255,255,255,0))`;
      } else {
        const noPadding = isElHasProperty(cursorTarget, propNames.noPadding);
        const noParallax = isElHasProperty(cursorTarget, propNames.noParallax);
        target.x =
          rect.left -
          (noPadding ? 0 : props.hoverPadding) +
          (noParallax
            ? 0
            : (e.clientX - rect.left - cursorTarget.clientWidth / 2) /
              parallaxSpeed.cursor);
        target.y =
          rect.top -
          (noPadding ? 0 : props.hoverPadding) +
          (noParallax
            ? 0
            : (e.clientY - rect.top - cursorTarget.clientHeight / 2) /
              parallaxSpeed.cursor);
        target.borderRadius = borderRadius * (noPadding ? 1 : 1.5);
        target.width =
          cursorTarget.clientWidth + (noPadding ? 0 : props.hoverPadding * 2);
        target.height =
          cursorTarget.clientHeight + (noPadding ? 0 : props.hoverPadding * 2);
        if (!noParallax) {
          targetEl.x = -getMoveIndex(
            e.clientX,
            rect.left,
            cursorTarget.clientWidth,
            parallaxSpeed.target
          );
          targetEl.y = -getMoveIndex(
            e.clientY,
            rect.top,
            cursorTarget.clientHeight,
            parallaxSpeed.target
          );
        }
      }
    }
    startLoop();
  };

  const handleMouseOver = (e: Event) => {
    isHovered = true;
    cursorTarget = e.target as HTMLElement;
    const borderRadius = Number(
      window.getComputedStyle(cursorTarget).borderRadius.slice(0, -2)
    );

    if (isElHasProperty(cursorTarget, propNames.lift)) {
      cursor.classList.add("c-cursor-lift_active");
      target.borderRadius = borderRadius;
      target.width = cursorTarget.clientWidth;
      target.height = cursorTarget.clientHeight;
      target.scale = 1.1;
    } else {
      cursor.classList.add("c-cursor_active");
    }
    startLoop();
  };

  const handleMouseOut = (e: Event) => {
    isHovered = false;
    cursor.classList.remove("c-cursor_active");
    cursor.classList.remove("c-cursor-lift_active");

    const mouse = e as MouseEvent;
    target.x = mouse.clientX - props.radius / 2;
    target.y = mouse.clientY - props.radius / 2;
    target.width = props.radius;
    target.height = props.radius;
    target.borderRadius = 100;
    target.scale = 1;
    target.backgroundImage = "none";
    target.filter = "blur(0px)";
    targetEl.x = 0;
    targetEl.y = 0;
    targetEl.scale = 1;
    targetEl.boxShadow = "0 7px 15px rgba(0,0,0,0.0)";
    startLoop();
  };

  document.addEventListener("mousewheel", handleMouseOut, { passive: true });
  document.addEventListener("mousemove", moveCursor, { passive: true });

  interactElements.forEach((item) => {
    item.addEventListener("mouseenter", handleMouseOver, { passive: true });
  });
  interactElements.forEach((item) => {
    item.addEventListener("mouseleave", handleMouseOut, { passive: true });
  });
};

export default contextMode;
