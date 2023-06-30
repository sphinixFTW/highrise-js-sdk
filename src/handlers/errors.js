/**
 * Error class for Highrise API errors.
 * @class
 * @extends Error
 * @param {string} message - The error message.
*/
class HighriseApiError extends Error {
  constructor(message) {
    super(message);
    this.name = 'HighriseApiError';
  }
}

/**
* Error class for Invalid User ID errors.
* @class
* @extends Error
* @param {string} message - The error message.
*/
class InvalidUserIdError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InvalidUserIdError';
  }
}

/**
* Error class for Invalid Facing errors.
* @class
* @extends Error
* @param {string} message - The error message.
*/
class InvalidFacingError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InvalidFacingError';
  }
}

/**
* Error class for Invalid User Name errors.
* @class
* @extends Error
* @param {string} message - The error message.
*/
class InvalidNameError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InvalidNameError';
  }
}

/**
* Error class for Invalid Player errors.
* @class
* @extends Error
* @param {string} message - The error message.
*/
class InvalidPlayer extends Error {
  constructor(message) {
    super(message);
    this.name = 'InvalidPlayer';
  }
}

/**
* Error class for Invalid Duration errors.
* @class
* @extends Error
* @param {string} message - The error message.
*/
class InvalidDurationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InvalidDurationError'
  }
}


/**
* Error class for Invalid Emote ID errors.
* @class
* @extends Error
* @param {string} message - The error message.
*/
class InvalidEmoteIdError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InvalidEmoteId'
  }
}


/**
* Error class for Invalid Message Type errors.
* @class
* @extends Error
* @param {string} message - The error message.
*/
class InvalidMessageTypeError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InvalidMessageTypeError'
  }
}


/**
* Error class for Invalid Coordinates errors.
* @class
* @extends Error
* @param {string} message - The error message.
*/
class InvalidCoordinatesError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InvalidCoordinatesError'
  }
}


/**
* Error class for Invalid Room ID errors.
* @class
* @extends Error
* @param {string} message - The error message.
*/
class InvalidRoomIdError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InvalidRoomIdError'
  }
}

/**
* Error class for Invalid Converstaion ID errors.
* @class
* @extends Error
* @param {string} message - The error message.
*/
class InvalidConversationIdError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InvalidConversationIdError'
  }
}

/**
* Error class for Invalid Currency Amount errors.
* @class
* @extends Error
* @param {string} message - The error message.
*/
class InvalidCurrencyAmount extends Error {
  constructor(message) {
    super(message);
    this.name = 'InvalidCurrencyAmount'
  }
}

/**
* Error class for Invalid Payment Method errors.
* @class
* @extends Error
* @param {string} message - The error message.
*/
class InvalidPaymentMethod extends Error {
  constructor(message) {
    super(message);
    this.name = 'InvalidPaymentMethod'
  }
}

module.exports = {
  HighriseApiError,
  InvalidNameError,
  InvalidPlayer,
  InvalidUserIdError,
  InvalidDurationError,
  InvalidEmoteIdError,
  InvalidMessageTypeError,
  InvalidCoordinatesError,
  InvalidRoomIdError,
  InvalidFacingError,
  InvalidConversationIdError,
  InvalidCurrencyAmount,
  InvalidPaymentMethod
}
