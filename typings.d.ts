declare class Mixin {
    mixin_keys: Array<string>
}

declare interface MixOptions {
    omits: Array<string>,
    post_methods?: {
        [method: string]: (any) => any
    },
    pre_methods?: {
        [method: string]: (any) => any
    },
    premixing_hook?:  (any) => void,
    postmixing_hook?: (any) => void
}

declare module 'mixin_a_lot' {
    export function make({name: string}): Mixin;
    export function mix(target: any, mixin: Mixin, options: MixOptions);
    
}