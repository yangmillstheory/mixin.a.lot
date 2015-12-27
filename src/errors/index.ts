interface ErrorWithMessage {
    new(message?: string): Error
}

class NotImplemented extends Error {};
class NotMutable extends Error {};
class ValueError extends Error {};


for (let klass of [NotImplemented, NotMutable, ValueError]) {
    Object.freeze(klass);
    Object.freeze(klass.prototype);
}

let errors: {[key: string]: ErrorWithMessage;} = {
    NotImplemented,
    NotMutable, 
    ValueError
};
export {errors};
