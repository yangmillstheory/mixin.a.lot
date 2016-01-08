declare module 'mixin_a_lot' {
  export function mix(target, mixin: Object, options?: IMixOptions);
}

declare interface IMixOptions {
  omits?: string[];
  pre_mixing_advice?: Function;
  pre_method_advice?: {
    [method: string]: Function
  };
  post_mixing_advice?: Function;
  post_method_advice?: {
    [method: string]: Function
  };
}
