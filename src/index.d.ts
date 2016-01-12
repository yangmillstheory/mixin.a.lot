//////////////////////////////
// extend public API with
// snake-case for internal use
interface IMixin {
  pre_mix?: Function;
  post_mix?: Function;
}

interface IMixOptions {
  pre_adapters?: {
    [method: string]: Function
  };

  post_adapters?: {
    [method: string]: Function
  };
}
