declare interface MixOptions {
    omits: Array<string>,
    post_method?: {
        [method: string]: (any) => any
    },
    pre_method?: {
        [method: string]: (any) => any
    },
    premixing_hook?:  (any) => void,
    postmixing_hook?: (any) => void
}
