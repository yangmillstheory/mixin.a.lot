declare class Mixin {
  mixin_keys: string[];
  name: string;
}

declare interface MixinSpec {
    name: string;
    [key: string]: any;
}