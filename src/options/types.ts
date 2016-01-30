interface IOptionKey {
  // the primary internal identifier for an option key;
  // must be kept in sync with the type definition IMixOptions
  primary: string;
  aliases: string[];
}

const ADAPTER_TO_KEY: IOptionKey = {
  primary: 'adapterTo',
  aliases: [
    'adapter_to',
    'preAdapters',
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

const ADAPTER_FROM_KEY: IOptionKey = {
  primary: 'adapterFrom',
  aliases: [
    'adapter_from',
    'postAdapters',
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
  ADAPTER_TO,
  PRE_MIX,
  ADAPTER_FROM,
  POST_MIX,
  OMIT
}

export var Option = {
  fromKey: function(key: string): OptionType {
    let specifiesOption = (optionKey: IOptionKey) => {
      return (optionKey.primary === key) || (optionKey.aliases.indexOf(key) > -1);
    };
    if (specifiesOption(ADAPTER_TO_KEY)) {
      return OptionType.ADAPTER_TO;
    } else if (specifiesOption(PRE_MIX_KEY)) {
      return OptionType.PRE_MIX;
    } else if (specifiesOption(ADAPTER_FROM_KEY)) {
      return OptionType.ADAPTER_FROM;
    } else if (specifiesOption(POST_MIX_KEY)) {
      return OptionType.POST_MIX;
    } else if (specifiesOption(OMITS_KEY)) {
      return OptionType.OMIT;
    } else {
      return undefined;
    }
  },

  Type: OptionType,
};
