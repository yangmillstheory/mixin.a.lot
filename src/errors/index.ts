let errors: Array<Function> = [
    class NotImplemented extends Error {},
    class NotMutable extends Error {},
    class ValueError extends Error {},
];

for (let klass of errors) {
    Object.freeze(klass);
    Object.freeze(klass.prototype);
}

Object.freeze(errors);

export {errors};
