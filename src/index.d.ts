//////////////////////////////
// extend public API with
// snake-case for internal use
interface IMixin {
  pre_mixing_hook?: Function;
  post_mixing_hook: Function;
}

interface IMixOptions {
  pre_method_advice?: {
    [method: string]: Function
  };

  post_method_advice?: {
    [method: string]: Function
  };
}
