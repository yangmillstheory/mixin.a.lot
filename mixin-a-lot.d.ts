// Type definitions for mixin-a-lot v4.0.0
// Project: https://github.com/yangmillstheory/mixin.a.lot
// Definitions by: Victor Alvarez <https://github.com/yangmillstheory>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

declare module 'mixin-a-lot' {
  export function mix(target: Object, mixin: IMixin, options?: IMixOptions);
}

declare interface IMixin {
  preMix?: Function;
  postMix?: Function;

  [key: string]: any;
}

declare interface IMixOptions {
  omit?: string[];

  preAdapters?: {
    [method: string]: Function
  };
  postAdapters?: {
    [method: string]: Function
  };
}
