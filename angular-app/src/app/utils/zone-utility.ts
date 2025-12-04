import { NgZone } from '@angular/core';

export function patchFetch(ngZone: NgZone) {
  const originalFetch = window.fetch;
  window.fetch = (...args) => {
    return originalFetch(...args).then(result =>
      ngZone.run(() => result)
    );
  };
} 
