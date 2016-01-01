class APIError extends Error {
    constructor(message?: string) {
        super(message)
    }
}

class NotImplemented extends APIError {}
class NotMutable extends APIError {}
class ValueError extends APIError {}

export default {
    value_error(message: string): APIError {
        return new ValueError(message);
    },
    not_mutable_error(message: string): APIError {
        return new NotMutable(message);
    },
    not_implemented_error(message: string): APIError {
        return new NotImplemented(message);
    },
}
