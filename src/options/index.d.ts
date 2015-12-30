declare interface MixOptions {
    omits: Array<string>,
    post_mixing_hook?: (any) => void,
    post_method_hook?: {
        [method: string]: (any) => any
    },
    pre_mixing_hook?:  (any) => void,
    pre_method_hook?: {
        [method: string]: (any) => any
    },
}
