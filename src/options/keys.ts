export interface OptionKey {
    // the primary internal identifier for an option key;
    // must be kept in sync with the type definition MixOptions
    primary: string
    aliases: string[]
}

export const PRE_METHOD_ADVICE: OptionKey = {
    primary: 'pre_method_advice',
    aliases: [
        'before_hook',
        'hook_before'
    ],
};

export const PRE_MIXING_ADVICE: OptionKey = {
    primary: 'pre_mixing_advice',
    aliases: [
        'premixing_hook',
        'premixing', 
        'premix'
    ],
};

export const POST_METHOD_ADVICE: OptionKey = {
    primary: 'post_method_advice',
    aliases: [
        'after_hook',
        'hook_after'
    ],
};

export const POST_MIXING_ADVICE: OptionKey = {
    primary: 'post_mixing_advice',
    aliases: [
        'postmixing_hook',
        'postmixing', 
        'postmix'
    ], 
};

export const OMITS: OptionKey = {
    primary: 'omits',
    aliases: []
};

let specifies_option = (option_key: OptionKey, key: string) => {
    return (option_key.primary === key) || (key in option_key.aliases);
};

export var key_type_of = (key: string): OptionKey => {
    if (specifies_option(PRE_METHOD_ADVICE, key)) {
        return PRE_MIXING_ADVICE;
    } else if (specifies_option(PRE_MIXING_ADVICE, key)) {
        return PRE_METHOD_ADVICE;
    } else if (specifies_option(POST_METHOD_ADVICE, key)) {
        return POST_MIXING_ADVICE;
    } else if (specifies_option(POST_MIXING_ADVICE, key)) {
        return POST_METHOD_ADVICE;
    } else if (specifies_option(OMITS, key)) {
        return OMITS;
    } else {
        return {primary: key, aliases: []};
    }
};
