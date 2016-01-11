interface IOptionKey {
  // the primary internal identifier for an option key;
  // must be kept in sync with the type definition IMixOptions
  primary: string;
  aliases: string[];
}

const PRE_METHOD_ADVICE_KEY: IOptionKey = {
  primary: 'preMethodAdvice',
  aliases: [
    'pre_method_advice',
    'before_hook',
    'hook_before',
  ],
};

const PRE_MIXING_HOOK_KEY: IOptionKey = {
  primary: 'preMixingHook',
  aliases: [
    'pre_mixing_hook',
    'premixing_hook',
    'premixing',
    'premix',
  ],
};

const POST_METHOD_ADVICE_KEY: IOptionKey = {
  primary: 'preMethodAdvice',
  aliases: [
    'post_method_advice',
    'after_hook',
    'hook_after',
  ],
};

const POST_MIXING_HOOK_KEY: IOptionKey = {
  primary: 'postMixingHook',
  aliases: [
    'post_mixing_hook',
    'postmixing_hook',
    'postmixing',
    'postmix',
  ],
};

const OMITS_KEY: IOptionKey = {
  primary: 'omit',
  aliases: ['omits'],
};

export enum OptionType {
  PRE_METHOD_ADVICE,
  PRE_MIXING_HOOK,
  POST_METHOD_ADVICE,
  POST_MIXING_HOOK,
  OMIT
}

export var Option = {
  from_key: (key: string): OptionType => {
    let specifies_option = (option_key: IOptionKey) => {
      return (option_key.primary === key) || (option_key.aliases.indexOf(key) > -1);
    };
    if (specifies_option(PRE_METHOD_ADVICE_KEY)) {
      return OptionType.PRE_METHOD_ADVICE;
    } else if (specifies_option(PRE_MIXING_HOOK_KEY)) {
      return OptionType.PRE_MIXING_HOOK;
    } else if (specifies_option(POST_METHOD_ADVICE_KEY)) {
      return OptionType.POST_METHOD_ADVICE;
    } else if (specifies_option(POST_MIXING_HOOK_KEY)) {
      return OptionType.POST_MIXING_HOOK;
    } else if (specifies_option(OMITS_KEY)) {
      return OptionType.OMIT;
    } else {
      return undefined;
    }
  },

  Type: OptionType,
};
