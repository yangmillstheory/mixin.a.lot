interface IOptionKey {
  // the primary internal identifier for an option key;
  // must be kept in sync with the type definition MixOptions
  primary: string;
  aliases: string[];
}

const PRE_METHOD_ADVICE_KEY: IOptionKey = {
  primary: 'pre_method_advice',
  aliases: [
    'before_hook',
    'hook_before',
  ],
};

const PRE_MIXING_HOOK_KEY: IOptionKey = {
  primary: 'pre_mixing_hook',
  aliases: [
    'premixing_hook',
    'premixing',
    'premix',
  ],
};

const POST_METHOD_ADVICE_KEY: IOptionKey = {
  primary: 'post_method_advice',
  aliases: [
    'after_hook',
    'hook_after',
  ],
};

const POST_MIXING_HOOK_KEY: IOptionKey = {
  primary: 'post_mixing_hook',
  aliases: [
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
      return (option_key.primary === key) || (key in option_key.aliases);
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
      return null;
    }
  },

  Type: OptionType,
};
