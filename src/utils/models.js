class User {
    /**
     * User class representing a user in the game.
     * @param {string} id - The user's ID.
     * @param {string} username - The user's username.
     */
    constructor(id, username) {
        this.id = id;
        this.username = username;
    }
}

class ChatRequest {
    /**
     * ChatRequest class representing a request to send a chat message.
     * @param {string} message - The message to send.
     * @param {string} whisperTargetId - The ID of the user to whisper to. Defaults to null.
     * @param {string} rid - The request ID. Defaults to null.
     */
    constructor(message, whisperTargetId = null, rid = null) {
        this.message = message;
        this.whisper_target_id = whisperTargetId;
        this.rid = rid;
    }

    /**
     * Get the response class for this request.
     * @returns {ChatResponse} The response class.
     */
    static get ChatResponse() {
        return ChatResponse;
    }

    /**
     * Get the response class for this request.
     * @returns {ChatResponse} The response class.
     */
    static get Response() {
        return ChatResponse;
    }
}

class Position {
    /**
     * Position class representing a position in 3D space.
     * @param {number} x - The x-coordinate.
     * @param {number} y - The y-coordinate.
     * @param {number} z - The z-coordinate.
     * @param {string} facing - The direction the entity is facing. Defaults to "FrontRight".
     */
    constructor(x, y, z, facing = "FrontRight") {
        this.x = x;
        this.y = y;
        this.z = z;
        this.facing = facing;
    }
}


class AnchorPosition {
    /**
     * Constructor for an AnchorPosition object.
     * 
     * @param {string} entity_id - The ID of the entity.
     * @param {number} anchor_ix - The index of the anchor.
     */
    constructor(entity_id, anchor_ix) {
        this.entity_id = entity_id;
        this.anchor_ix = anchor_ix;
    }
}

class CurrencyItem {
    /**
     * Constructor for a CurrencyItem object.
     * 
     * @param {string} type - The type of currency.
     * @param {number} amount - The amount of currency.
     */
    constructor(type, amount) {
        this.type = type;
        this.amount = amount;
    }
}

class Item {
    /**
     * Constructor for an Item object.
     * 
     * @param {string} type - The type of item.
     * @param {number} amount - The amount of the item.
     * @param {string} id - The ID of the item.
     */
    constructor(type, amount, id) {
        this.type = type;
        this.amount = amount;
        this.id = id;
    }
}


class IndicatorRequest {
    /**
     * @param {string} icon - The icon to set as the indicator.
     * @param {string} rid - The request ID (optional).
     */
    constructor(icon = null, rid = null) {
        this.icon = icon;
        this.rid = rid;
    }

    static get Response() {
        class IndicatorResponse {
            constructor() {
                this.rid = null;
            }
        }

        return IndicatorResponse;
    }
}

class Error {
    /**
     * @param {string} message - The error message.
     * @param {string} rid - The request ID (optional).
     */
    constructor(message, rid = null) {
        this.message = message;
        this.rid = rid;
    }
}

class GetRoomUsersRequest {
    /**
     * @param {string} rid - The room ID to get users from.
     */
    constructor(rid) {
        this.rid = rid;
    }

    static get Response() {
        class GetRoomUsersResponse {
            /**
             * @param {Array} content - The users in the room.
             * @param {string} rid - The request ID.
             */
            constructor(content, rid) {
                this.content = content;
                this.rid = rid;
            }
        }
        return GetRoomUsersResponse;
    }
}


class GetWalletRequest {
    /**
     * Creates a new instance of GetWalletRequest.
     * @param {string|null} rid - The request ID.
     */
    constructor(rid = null) {
        this.rid = rid;
    }

    static get GetWalletResponse() {
        /**
         * The successful response to a GetWalletRequest.
         */
        class GetWalletResponse {
            /**
             * Creates a new instance of GetWalletResponse.
             * @param {Object} content - The content of the response.
             * @param {string} rid - The request ID.
             */
            constructor(content, rid) {
                this.content = content;
                this.rid = rid;
            }
        }
        return GetWalletResponse;
    }
}


class EmoteRequest {
    /**
     * Creates a new instance of EmoteRequest.
     * @param {string|null} targetUserId - The ID of the user to target with the emote.
     * @param {string} emoteId - The ID of the emote to use.
     * @param {string|null} rid - The request ID.
     */
    constructor(targetUserId = null, emoteId, rid = null) {
        this.emote_id = emoteId;
        this.target_user_id = targetUserId;
        this.rid = rid;
    }

    static get EmoteResponse() {
        /**
         * The successful response to an EmoteRequest.
         */
        return class {
            /**
             * Creates a new instance of EmoteResponse.
             * @param {string|null} rid - The request ID.
             */
            constructor(rid = null) {
                this.rid = rid;
            }
        };
    }

    static get Response() {
        return EmoteRequest.EmoteResponse;
    }
}


/**
 * Represents a request to add a reaction to a message.
 * @class
 * @classdesc This class encapsulates the data required to add a reaction to a message, such as the type of reaction
 * and the target user ID.
 * @param {string} targetUserId - The ID of the user to whom the reaction will be added.
 * @param {string} reaction - The type of reaction to be added.
 * @param {string|null} [rid=null] - The request ID associated with the request (optional).
 */
class ReactionRequest {
    constructor(targetUserId, reaction, rid = null) {
        this.reaction = reaction;
        this.target_user_id = targetUserId;
        this.rid = rid;
    }

    /**
     * Returns the `ReactionResponse` class.
     * @static
     * @returns {ReactionRequest.ReactionResponse} - The `ReactionResponse` class.
     */
    static get ReactionResponse() {
        return ReactionRequest.ReactionResponse;
    }

    /**
     * Returns the `ReactionResponse` class.
     * @static
     * @returns {ReactionRequest.ReactionResponse} - The `ReactionResponse` class.
     */
    static get Response() {
        return ReactionRequest.ReactionResponse;
    }

    /**
     * Returns a map of valid reaction types.
     * @static
     * @returns {Object.<string, string>} - A map of valid reaction types.
     */
    static getReactionMap() {
        return {
            clap: 'clap',
            heart: 'heart',
            thumbs: 'thumbs',
            wave: 'wave',
            wink: 'wink'
        };
    }

    /**
     * Determines if a given reaction type is valid.
     * @static
     * @param {string} reaction - The reaction type to validate.
     * @returns {boolean} - `true` if the reaction type is valid; `false` otherwise.
     */
    static isValidReaction(reaction) {
        return Object.keys(ReactionRequest.getReactionMap()).includes(reaction);
    }

    /**
     * Creates a new `ReactionRequest` object from a payload.
     * @static
     * @param {Object} payload - The payload to use.
     * @param {string} payload.reaction - The type of reaction to add.
     * @param {string} payload.target_user_id - The ID of the user to add the reaction to.
     * @param {string|null} [payload.rid=null] - The request ID associated with the request (optional).
     * @returns {ReactionRequest} - The new `ReactionRequest` object.
     */
    static fromPayload(payload) {
        const { reaction, target_user_id, rid } = payload;
        return new ReactionRequest(target_user_id, reaction, rid);
    }

    /**
     * Returns a payload object containing the data in this object.
     * @returns {Object} - The payload object.
     */
    toPayload() {
        return {
            _type: 'ReactionRequest',
            reaction: this.reaction,
            target_user_id: this.target_user_id,
            rid: this.rid
        };
    }

    /**
     * Returns the `ReactionResponse` class.
     * @static
     * @returns {ReactionRequest.ReactionResponse} - The `ReactionResponse` class.
     */
    static get ReactionResponse() {
        class ReactionResponse {
            constructor(rid = null) {
                this.rid = rid;
            }
        }
        return ReactionResponse;
    }
}



/**
 * The request to teleport a user to a new destination.
 */
class TeleportRequest {
    /**
     * @param {string} userId - The ID of the user to teleport.
     * @param {string} destination - The destination to teleport the user to.
     * @param {string|null} rid - An optional request ID.
     */
    constructor(userId, destination, rid = null) {
        this.user_id = userId;
        this.destination = destination;
        this.rid = rid;
    }

    /**
     * The response to a teleport request.
     */
    static get TeleportResponse() {
        return TeleportResponse;
    }

    /**
     * The response class for this request.
     */
    static get Response() {
        return TeleportResponse;
    }
}


class TeleportResponse {
    /**
     * The successful response to a `TeleportRequest`.
     * @param {string|null} rid The ID of the room the bot was teleported to
     */
    constructor(rid = null) {
        this.rid = rid;
    }
}

TeleportResponse.Response = TeleportResponse;
TeleportRequest.Response = TeleportResponse;

class FloorHitRequest {
    /**
     * Request to teleport to the specified floor within the room.
     * @param {string} destination The name or ID of the destination floor
     * @param {string|null} rid The ID of the room to teleport within
     */
    constructor(destination, rid = null) {
        this.destination = destination;
        this.rid = rid;
    }

    static get FloorHitResponse() {
        class FloorHitResponse {
            /**
             * The successful response to a `FloorHitRequest`.
             * @param {string|null} rid The ID of the room where the floor was hit
             */
            constructor(rid = null) {
                this.rid = rid;
            }
        }
        return FloorHitResponse;
    }

    static get Response() {
        return FloorHitRequest.FloorHitResponse;
    }
}

class AnchorHitRequest {
    /**
     * Request to teleport to the specified anchor within the room.
     * @param {string} destination The name or ID of the destination anchor
     * @param {string|null} rid The ID of the room to teleport within
     */
    constructor(anchor, rid = null) {
        this.anchor = anchor;
        this.rid = rid;
    }

    static get AnchorHitResponse() {
        class AnchorHitResponse {
            /**
             * The successful response to a `AnchorHitRequest`.
             * @param {string|null} rid The ID of the room where the floor was hit
             */
            constructor(rid = null) {
                this.rid = rid;
            }
        }
        return AnchorHitResponse;
    }

    static get Response() {
        return AnchorHitRequest.AnchorHitResponse;
    }
}

class RoomPermissions {
    /**
     * Represents the room permissions for a given user.
     * Both moderator and designer can be null, meaning the bot
     * is not a moderator/designer, or can be a boolean value.
     */
    constructor() {
        this.moderator = null;
        this.designer = null;
    }
}

class GetRoomPrivilegeRequest {
    /**
     * Construct a GetRoomPrivilegeRequest.
     * 
     * @param {string} user_id - The ID of the user to get room privilege for.
     */
    constructor(user_id) {
        this.user_id = user_id;
        this.rid = null;
    }

    static get GetRoomPrivilegeResponse() {
        class GetRoomPrivilegeResponse {
            /**
             * Construct a GetRoomPrivilegeResponse.
             * 
             * @param {Object} content - The content of the response.
             * @param {string} rid - The ID of the room for which the privilege was requested.
             */
            constructor(content, rid) {
                this.content = content;
                this.rid = rid;
            }
        }
        return GetRoomPrivilegeResponse;
    }
}

// Assign the inner class as a property of the outer class
GetRoomPrivilegeRequest.Response = GetRoomPrivilegeRequest.GetRoomPrivilegeResponse;


/**
 * Represents a request to moderate a room for a given user.
 */
class ModerateRoomRequest {
    /**
     * Creates a new instance of the `ModerateRoomRequest` class.
     *
     * @param {string} user_id - The ID of the user to moderate the room for.
     * @param {string} moderation_action - The type of moderation action to perform (e.g. 'mute', 'kick', etc.).
     * @param {number|null} action_length - The length of the moderation action (in seconds) if applicable.
     * @param {string|null} rid - The ID of the room to moderate (optional).
     */
    constructor(user_id, moderation_action, action_length = null, rid = null) {
        this.user_id = user_id;
        this.moderation_action = moderation_action;
        this.action_length = action_length;
        this.rid = rid;
    }

    /**
     * Represents the response to a `ModerateRoomRequest`.
     */
    static get Response() {
        /**
         * Represents the successful response to a `ModerateRoomRequest`.
         */
        class ModerateRoomResponse {
            /**
             * Creates a new instance of the `ModerateRoomResponse` class.
             *
             * @param {string|null} rid - The ID of the room that was moderated (optional).
             */
            constructor(rid = null) {
                this.rid = rid;
            }
        }

        return ModerateRoomResponse;
    }
}

function generateRequestId() {
    return Math.random().toString(36).substr(2, 9);
}


/**
 * A utility class for sending payloads to a bot and receiving responses.
 */
class sendPayloadAndGetResponse {
    /**
     * Creates a new instance of sendPayloadAndGetResponse.
     * @param {Bot} bot - The bot instance to send payloads to.
     */
    constructor(bot) {
        this.bot = bot;
    }

    /**
     * Sends a payload to the bot and waits for a response.
     * @param {object} payload - The payload to send to the bot.
     * @returns {Promise} A Promise that resolves with the response from the bot.
     */
    async sendPayloadAndGetResponse(payload) {
        return new Promise((resolve, reject) => {
            const requestId = generateRequestId();
            const responseClass = GetRoomUsersRequest.Response;

            // Handler for the bot's response message.
            const messageHandler = (message) => {
                const messageObject = JSON.parse(message);

                // If the message is the expected response from the bot, resolve the Promise with it.
                if (messageObject._type === responseClass.name && messageObject.rid === requestId) {
                    this.bot.ws.off('message', messageHandler);
                    resolve(new responseClass(messageObject.content, messageObject.rid));
                }
            };

            // Add the message handler to the bot's WebSocket listener.
            this.bot.ws.on('message', messageHandler);

            // Send the payload to the bot and set up an error handler.
            this.bot.ws.send(JSON.stringify({ ...payload, rid: requestId }), (error) => {
                if (error) {
                    reject(error);
                }
            });
        });
    }
}

class sendWalletPayloadAndGetResponse {
    constructor(bot) {
        this.bot = bot;
    }
    async sendWalletPayloadAndGetResponse(payload) {
        return new Promise((resolve, reject) => {
            const requestId = generateRequestId();
            const responseClass = GetWalletRequest.GetWalletResponse;

            const messageHandler = (message) => {
                const messageObject = JSON.parse(message);

                if (messageObject._type === responseClass.name && messageObject.rid === requestId) {
                    this.bot.ws.off('message', messageHandler);
                    resolve(new responseClass(messageObject.content, messageObject.rid));
                }
            };

            this.bot.ws.on('message', messageHandler);

            this.bot.ws.send(JSON.stringify({ ...payload, rid: requestId }), (error) => {
                if (error) {
                    reject(error);
                }
            });
        });
    }
}

class RoomInfo {
    /**
     * Information about the room.
     * @param {string} owner_id - The ID of the room owner.
     * @param {string} room_name - The name of the room.
     */
    constructor(owner_id, room_name) {
        this.owner_id = owner_id;
        this.room_name = room_name;
    }
}

class SessionMetadata {
    /**
     * Initial session data.
     * @param {string} user_id - The bot's user ID.
     * @param {RoomInfo} room_info - Additional information about the connected room.
     * @param {Object.<string, [number, number]>} rate_limits - A dictionary of rate limits,
     *                                                        with the key as the rate limit name
     *                                                        and the value as a tuple of (limit, period).
     * @param {string} connection_id - The connection ID of the WebSocket used in the bot connection.
     * @param {string|null} sdk_version - The SDK version recommended by the server (if applicable).
     */
    constructor(user_id, room_info, rate_limits, connection_id, sdk_version = null) {
        this.user_id = user_id;
        this.room_info = room_info;
        this.rate_limits = rate_limits;
        this.connection_id = connection_id;
        this.sdk_version = sdk_version;
    }
}

class MoveUserToRoomRequest {
    /**
     * Move user to another room using room_id as a target room id.
     * Bot operator must be owner of the target room, or has designer privileges in the target room, this will also work
     * if bot has designer privileges in the target room.
     *
     * All other restriction to room movement apply, ie if target room is full this will fail.
     *
     * @param {string} userId - The ID of the user to be moved to a different room.
     * @param {string} roomId - The ID of the room to which the user will be moved.
     * @param {string|null} rid - Optional parameter that indicates the request ID.
     */
    constructor(userId, roomId, rid = null) {
        this.user_id = userId;
        this.room_id = roomId;
        this.rid = rid;
    }

    /**
     * Move user to another room response.
     *
     * @class MoveUserToRoomResponse
     */
    static get MoveUserToRoomResponse() {
        return MoveUserToRoomResponse;
    }

    /**
     * Move user to another room response.
     *
     * @class MoveUserToRoomResponse
     */
    static get Response() {
        return MoveUserToRoomResponse;
    }
}

class MoveUserToRoomResponse {
    /**
     * Move user to another room response.
     *
     * @param {string|null} rid - Optional parameter that indicates the request ID.
     */
    constructor(rid = null) {
        this.rid = rid;
    }
}

class CheckVoiceChatRequest {
    /**
     * Check the voice chat status in the room.
     *
     * @param {string|null} rid The ID of the room to check the voice chat status in (optional).
     */
    constructor(rid = null) {
        this.rid = rid;
    }

    static get Response() {
        class CheckVoiceChatResponse {
            /**
             * Returns the status of voice chat in the room.
             *
             * @param {number} seconds_left The number of seconds left until the voice chat ends.
             * @param {Set<string>} auto_speakers The list of users that automatically have voice chat privileges in the room like moderators and owner.
             * @param {Object<string, 'invited' | 'voice' | 'muted'>} users The list of users that currently have voice chat privileges in the room.
             * @param {string|null} rid The ID of the room where the voice chat status was checked (optional).
             */
            constructor(seconds_left, auto_speakers, users, rid = null) {
                this.seconds_left = seconds_left;
                this.auto_speakers = auto_speakers;
                this.users = users;
                this.rid = rid;
            }
        }

        return CheckVoiceChatResponse;
    }
}

class InviteSpeakerRequest {
    /**
     * Invite a user to speak in the room.
     *
     * @param {string} user_id The ID of the user to invite.
     * @param {string|null} rid The ID of the room to invite the user to (optional).
     */
    constructor(user_id, rid = null) {
        this.user_id = user_id;
        this.rid = rid;
    }

    static get Response() {
        class InviteSpeakerResponse {
            /**
             * The response to an `InviteSpeakerRequest`.
             *
             * @param {string|null} rid The ID of the room where the user was invited to (optional).
             */
            constructor(rid = null) {
                this.rid = rid;
            }
        }

        return InviteSpeakerResponse;
    }
}

class RemoveSpeakerRequest {
    /**
     * Remove a user from speaking in the room.
     *
     * @param {string} user_id The ID of the user to remove from speaking.
     * @param {string|null} rid The ID of the room to remove the user from (optional).
     */
    constructor(user_id, rid = null) {
        this.user_id = user_id;
        this.rid = rid;
    }

    static get Response() {
        class RemoveSpeakerResponse {
            /**
             * The response to a `RemoveSpeakerRequest`.
             *
             * @param {string|null} rid The ID of the room from which the user was removed (optional).
             */
            constructor(rid = null) {
                this.rid = rid;
            }
        }

        return RemoveSpeakerResponse;
    }
}

MoveUserToRoomResponse.Response = MoveUserToRoomResponse;
MoveUserToRoomRequest.Response = MoveUserToRoomResponse;

// create a new map for storing cache.
const userMap = new Map();

module.exports = {
    User,
    ChatRequest,
    GetRoomUsersRequest,
    Error,
    Item,
    CurrencyItem,
    AnchorPosition,
    Position,
    RoomPermissions,
    EmoteRequest,
    ReactionRequest,
    TeleportRequest,
    FloorHitRequest,
    GetWalletRequest,
    GetRoomPrivilegeRequest,
    IndicatorRequest,
    ModerateRoomRequest,
    generateRequestId,
    sendPayloadAndGetResponse,
    sendWalletPayloadAndGetResponse,
    MoveUserToRoomRequest,
    userMap,
    AnchorHitRequest,
    RoomInfo,
    SessionMetadata,
    CheckVoiceChatRequest,
    InviteSpeakerRequest,
    RemoveSpeakerRequest
}