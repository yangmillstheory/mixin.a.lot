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
    omits?: string[];
    pre_mixing_advice?: (any) => void;
    pre_method_advice?: {
        [method: string]: (any) => (any)
    };
    post_mixing_advice?: (any) => void;
    post_method_advice?: {
        [method: string]: (any) => any
    },
}
