class NotImplemented extends Error {}
class NotMutable extends Error {}
class ValueError extends Error {}

export default {
    value_error(message: string): Error {
        return new ValueError(message);
    },
    not_mutable_error(message: string): Error {
        return new NotMutable(message);
    },
    not_implemented_error(message: string): Error {
        return new NotImplemented(message);
    },
}
