declare module 'mixin_a_lot' {
    export function make(spec: MixinSpec): Mixin;

    export function mix(target: any, mixin: Mixin, options: MixOptions);
}

declare class Mixin {
    mixin_keys: string[];
    name: string;
}

declare interface MixinSpec {
    name: string;
    [key: string]: any;
}

declare interface MixOptions {
    omits?: string[],
    post_mixing_hook?: (any) => void,
    post_method_hook?: {
        [method: string]: (any) => any
    },
    pre_mixing_hook?:  (any) => void,
    pre_method_hook?: {
        [method: string]: (any) => any
    },
}
