// Type definitions for mixin-a-lot v4.0.0
// Project: https://github.com/yangmillstheory/mixin.a.lot
// Definitions by: Victor Alvarez <https://github.com/yangmillstheory>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

declare module 'mixin_a_lot' {
  export function mix(target: Object|Function, mixin: IMixin, options?: IMixOptions);
}

declare interface IMixin extends Object {
  pre_mixing_hook?: Function;
  post_mixing_hook?: Function;
}

declare interface IMixOptions {
  omit?: string[];
  pre_method_advice?: {
    [method: string]: Function
  };
  post_method_advice?: {
    [method: string]: Function
  };
}
