interface OptionKey {
    // the primary internal identifier for an option key;
    // should be kept in sync with the type definition.
    primary: string,
    aliases: string[],
}

const PRE_METHOD_ADVICE: OptionKey = {
    primary: 'pre_method_hook',
    aliases: [
        'before_hook',
        'hook_before'
    ],
};

const PRE_MIXING_ADVICE: OptionKey = {
    primary: 'pre_mixing_hook',
    aliases: [
        'premixing_hook',
        'premixing', 
        'premix'
    ],
};

const POST_METHOD_ADVICE: OptionKey = {
    primary: 'post_method_hook',
    aliases: [
        'after_hook',
        'hook_after'
    ],
};

const POST_MIXING_ADVICE: OptionKey = {
    primary: 'post_mixing_hook',
    aliases: [
        'postmixing_hook',
        'postmixing', 
        'postmix'
    ], 
};

let specifies_option = (option_key: OptionKey, key: string) => {
    return (option_key.primary === key) || (key in option_key.aliases);
};

let specifies_pre_method_advice = (key: string) => {
    return specifies_option(PRE_METHOD_ADVICE, key);
};

let specifies_pre_mixing_advice = (key: string) => {
    return specifies_option(PRE_MIXING_ADVICE, key);
};

let specifies_post_method_advice = (key: string) => {
    return specifies_option(POST_METHOD_ADVICE, key);
};

let specifies_post_mixing_advice = (key: string) => {
    return specifies_option(POST_MIXING_ADVICE, key);
};

export var normalize_option_key = (key: string): string => {
    if (specifies_pre_mixing_advice(key)) {
        return PRE_MIXING_ADVICE.primary;
    } else if (specifies_pre_method_advice(key)) {
        return PRE_METHOD_ADVICE.primary;
    } else if (specifies_post_mixing_advice(key)) {
        return POST_MIXING_ADVICE.primary;
    } else if (specifies_post_method_advice(key)) {
        return POST_METHOD_ADVICE.primary;
    } else {
        return key;
    }
};
