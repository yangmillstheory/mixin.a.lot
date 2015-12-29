interface ErrorWithMessage {
    new(message?: string): Error
}

class __NotImplemented__ extends Error {};
class __NotMutable__ extends Error {};
class __ValueError__ extends Error {};


for (let klass of [__NotImplemented__, __NotMutable__, __ValueError__]) {
    Object.freeze(klass);
    Object.freeze(klass.prototype);
}

export var NotImplemented: ErrorWithMessage = __NotImplemented__;
export var NotMutable: ErrorWithMessage = __NotMutable__;
export var ValueError: ErrorWithMessage = __ValueError__;
