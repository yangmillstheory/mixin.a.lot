interface Messaged {
    new(message?: string): Error
}

class _NotImplemented_ extends Error {};
class _NotMutable_ extends Error {};
class _ValueError_ extends Error {};

for (let klass of [_NotImplemented_, _NotMutable_, _ValueError_]) {
    Object.freeze(klass);
    Object.freeze(klass.prototype);
}

export var NotImplemented: Messaged = _NotImplemented_;
export var NotMutable: Messaged = _NotMutable_;
export var ValueError: Messaged = _ValueError_;