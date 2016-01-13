//////////////////////////////
// extend public API with
// snake-case for internal use
interface IMixin {
  pre_mix?: Function;
  post_mix?: Function;
}

interface IMixOptions {
  adapter_to?: {
    [method: string]: Function
  };

  adapter_from?: {
    [method: string]: Function
  };
}
