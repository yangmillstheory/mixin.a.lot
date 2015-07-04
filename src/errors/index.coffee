errors =

  NotImplemented: class NotImplemented extends Error

  NotMutable: class NotMutable extends Error

  ValueError: class ValueError extends Error


for own _, error_class of errors
  Object.freeze error_class
Object.freeze errors


module.exports = errors