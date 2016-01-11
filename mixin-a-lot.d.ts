// Type definitions for mixin-a-lot v4.0.0
// Project: https://github.com/yangmillstheory/mixin.a.lot
// Definitions by: Victor Alvarez <https://github.com/yangmillstheory>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

declare module 'mixin-a-lot' {
  export function mix(target: Object, mixin: IMixin, options?: IMixOptions);
}

declare interface IMixin {
  preMixingHook?: Function;
  postMixingHook?: Function;

  [key: string]: any;
}

declare interface IMixOptions {
  omit?: string[];

  preMethodAdvice?: {
    [method: string]: Function
  };
  postMethodAdvice?: {
    [method: string]: Function
  };
}
