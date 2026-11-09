import { useSyncExternalStore } from "react";

const listeners = new Set();

let now = null;
let interval;

const update = () => {
  now = Date.now();
  listeners.forEach((listener) => listener());
};

const subscribe = (listener) => {
  listeners.add(listener);
  if (!interval) {
    update();
    interval = setInterval(update, 15_000);
  }
  return () => {
    listeners.delete(listener);
    if (!listeners.size) {
      clearInterval(interval);
      interval = undefined;
    }
  };
};

const getSnapshot = () => now;

const getServerSnapshot = () => null;

// All visible dates share one clock, including after client-side navigation.
export const useDateClock = () =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
