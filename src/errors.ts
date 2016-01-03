class APIError extends Error {
  constructor(message?: string) {
    super(message);
  }
}

class NotImplemented extends APIError {}
class NotMutable extends APIError {}
class ValueError extends APIError {}

export var value_error = (message: string): APIError => {
  return new ValueError(message);
};
export var not_mutable_error = (message: string): APIError => {
  return new NotMutable(message);
};
export var not_implemented_error = (message: string): APIError => {
  return new NotImplemented(message);
};
