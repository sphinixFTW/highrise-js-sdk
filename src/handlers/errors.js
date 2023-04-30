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
class InvalidDuration extends Error {
    constructor(message) {
        super(message);
        this.name = 'InvalidDuration'
    }
}


/**
 * Error class for Invalid Emote ID errors.
 * @class
 * @extends Error
 * @param {string} message - The error message.
 */
class InvalidEmoteId extends Error {
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
class InvalidMessageType extends Error {
    constructor(message) {
        super(message);
        this.name = 'InvalidMessageType'
    }
}


/**
 * Error class for Invalid Coordinates errors.
 * @class
 * @extends Error
 * @param {string} message - The error message.
 */
class InvalidCoordinates extends Error {
    constructor(message) {
        super(message);
        this.name = 'InvalidCoordinates'
    }
}


/**
 * Error class for Invalid Room ID errors.
 * @class
 * @extends Error
 * @param {string} message - The error message.
 */
class InvalidRoomId extends Error {
    constructor(message) {
        super(message);
        this.name = 'InvalidRoomId'
    }
}


module.exports = {
    HighriseApiError,
    InvalidNameError,
    InvalidPlayer,
    InvalidUserIdError,
    InvalidDuration,
    InvalidEmoteId,
    InvalidMessageType,
    InvalidCoordinates,
    InvalidRoomId
}
