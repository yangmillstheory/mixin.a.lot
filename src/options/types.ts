interface IOptionKey {
  // the primary internal identifier for an option key;
  // must be kept in sync with the type definition IMixOptions
  primary: string;
  aliases: string[];
}

const PRE_ADAPTERS_KEY: IOptionKey = {
  primary: 'preAdapters',
  aliases: [
    'pre_adapters',
    'before_hook',
    'hook_before',
  ],
};

const PRE_MIX_KEY: IOptionKey = {
  primary: 'premix',
  aliases: [
    'pre_mix',
    'premixing_hook',
    'premixing',
  ],
};

const POST_ADAPTERS_KEY: IOptionKey = {
  primary: 'postAdapters',
  aliases: [
    'post_adapters',
    'after_hook',
    'hook_after',
  ],
};

const POST_MIX_KEY: IOptionKey = {
  primary: 'postmix',
  aliases: [
    'post_mix',
    'postmixing_hook',
    'postmixing',
  ],
};

const OMITS_KEY: IOptionKey = {
  primary: 'omit',
  aliases: ['omits'],
};

export enum OptionType {
  PRE_ADAPTERS,
  PRE_MIX,
  POST_ADAPTERS,
  POST_MIX,
  OMIT
}

export var Option = {
  from_key: (key: string): OptionType => {
    let specifies_option = (option_key: IOptionKey) => {
      return (option_key.primary === key) || (option_key.aliases.indexOf(key) > -1);
    };
    if (specifies_option(PRE_ADAPTERS_KEY)) {
      return OptionType.PRE_ADAPTERS;
    } else if (specifies_option(PRE_MIX_KEY)) {
      return OptionType.PRE_MIX;
    } else if (specifies_option(POST_ADAPTERS_KEY)) {
      return OptionType.POST_ADAPTERS;
    } else if (specifies_option(POST_MIX_KEY)) {
      return OptionType.POST_MIX;
    } else if (specifies_option(OMITS_KEY)) {
      return OptionType.OMIT;
    } else {
      return undefined;
    }
  },

  Type: OptionType,
};
