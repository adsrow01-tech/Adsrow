import React from "react";

// A preload-aware lazy wrapper for browser navigation and SSR prerendering.
// React.lazy cannot synchronously observe an already-resolved Promise during
// its first render, so this wrapper caches the resolved component itself. That
// keeps prerendered routes complete while retaining Suspense-compatible lazy
// loading in the browser.
export function lazyRoute(loader) {
  let loadedComponent;
  let loadingPromise;

  const load = () => {
    if (loadedComponent) return Promise.resolve(loadedComponent);
    if (!loadingPromise) loadingPromise = Promise.resolve(loader());
    return loadingPromise.then((module) => {
      loadedComponent = module?.default || module;
      return loadedComponent;
    });
  };

  function LazyRoute(props) {
    if (loadedComponent) return React.createElement(loadedComponent, props);
    throw load();
  }

  LazyRoute.preload = load;
  return LazyRoute;
}
