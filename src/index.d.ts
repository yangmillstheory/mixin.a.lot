/// <reference path="options/index.d.ts" />
/// <reference path="mixin/index.d.ts" />

declare module 'mixin_a_lot' {
    export function make({name: string}): Mixin;
    export function mix(target: any, mixin: Mixin, options: MixOptions);
}