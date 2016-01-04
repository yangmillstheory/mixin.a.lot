/// <reference path="../typings/tsd.d.ts" />
declare module 'mixin_a_lot' {
  export function make(spec: IMixinSpec): Mixin;

  export function mix(target, mixin: Mixin, options: IMixOptions);
}

declare class Mixin {
  public mixin_keys: string[];
}

declare interface IMixinSpec {
  name: string;
  [key: string]: any;
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
