declare module 'mixin_a_lot' {
  export function mix(target, mixin: Mixin, options?: MixOptions);
}

declare interface Mixin extends Object {
  pre_mixing_hook?: Function;
  post_mixing_hook?: Function;
}

declare interface MixOptions {
  omit?: string[];
  pre_method_advice?: {
    [method: string]: Function
  };
  post_method_advice?: {
    [method: string]: Function
  };
}
