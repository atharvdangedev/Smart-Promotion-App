import { lazy, Suspense } from "react";
import LoadingFallback from "./Partials/Apps/LoadingFallback/LoadingFallback";

export const lazyLoad = (importFunc) => {
  const LazyComponent = lazy(importFunc);

  return function LazyLoadedComponent(props) {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
};
