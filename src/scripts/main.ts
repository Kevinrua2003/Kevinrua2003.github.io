import contextCursor from "@/lib/contextCursor";

const mq = window.matchMedia("(min-width: 640px)");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const container = document.documentElement;
const throttleDelay = 50; // cap the rate of scroll events in ms
const scrollSpeedSensitivity = 1.6; // adjust this value to your needs, 1.0 is the 100% scroll speed

let isDragging = false;
let startY !: number;
let scrollTop !: number;
let lastY !: number;
let cursorActive = false;

// Limit the rate of scroll events
function throttle(func: Function, delay: number) {
	let lastCall = 0;

	return function (...args: unknown[]) {
		const now = Date.now();
		if (now - lastCall < delay) return;
		lastCall = now;
		return func(...args);
	};
}

const onMouseDown = (e: MouseEvent) => {
	isDragging = true;
	startY = e.pageY;
	lastY = e.pageY;
	scrollTop = container.scrollTop;
};

const onMouseMove = throttle((e: MouseEvent) => {
	if (!isDragging) return;
	lastY = e.pageY;
	requestAnimationFrame(() => {
		const deltaY = lastY - startY;
		container.scrollTop = scrollTop - deltaY * scrollSpeedSensitivity;
	});
}, throttleDelay);

const onMouseUp = () => {
	isDragging = false;
};

const onMouseLeave = () => {
	if (isDragging) {
		isDragging = false;
	}
};

const activateCursor = () => {
	if (cursorActive) return;
	cursorActive = true;

	const cursor = document.querySelector<HTMLElement>(".c-cursor");
	if (!cursor) {
		// First activation creates the cursor element; its listeners are wired
		// by contextCursor(). Keep it alive across toggles so re-activation only
		// needs to show it again.
		contextCursor({
			radius: 25,
			transitionSpeed: 0.1,
		});
	} else {
		cursor.style.display = "";
	}

	// Hide the native cursor via a class so that, if this script ever fails to
	// run, the user keeps a visible cursor (safe fallback).
	document.documentElement.classList.add("cursor-hidden");
	container.style.scrollBehavior = "smooth";
	container.addEventListener("mousedown", onMouseDown);
	container.addEventListener("mousemove", onMouseMove);
	container.addEventListener("mouseup", onMouseUp);
	container.addEventListener("mouseleave", onMouseLeave);
};

const deactivateCursor = () => {
	if (!cursorActive) return;
	cursorActive = false;

	document.documentElement.classList.remove("cursor-hidden");
	container.style.scrollBehavior = "";
	container.removeEventListener("mousedown", onMouseDown);
	container.removeEventListener("mousemove", onMouseMove);
	container.removeEventListener("mouseup", onMouseUp);
	container.removeEventListener("mouseleave", onMouseLeave);

	const cursor = document.querySelector<HTMLElement>(".c-cursor");
	if (cursor) {
		cursor.style.display = "none";
	}
};

const syncCursorState = () => {
	if (mq.matches && !reducedMotion.matches) {
		activateCursor();
	} else {
		deactivateCursor();
	}
};

syncCursorState();
mq.addEventListener("change", syncCursorState);
reducedMotion.addEventListener("change", syncCursorState);
