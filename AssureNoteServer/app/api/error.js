var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
* @class RPCError
* @constructor
*/
var RPCError = (function () {
    function RPCError(rpcHttpStatus, code, message, data) {
        this.rpcHttpStatus = rpcHttpStatus;
        this.code = code;
        this.message = message;
        this.data = data;
    }
    /**
    * @method toStrictRPCError
    * @return {IRPCError}
    */
    RPCError.prototype.toStrictRPCError = function () {
        return {
            code: this.code,
            message: this.message
        };
    };
    return RPCError;
})();
exports.RPCError = RPCError;

/**
* @class ParseError
* @constructor
* @extends RPCError
* @param {String} msg
* @param {Any} data
*/
var ParseError = (function (_super) {
    __extends(ParseError, _super);
    function ParseError(msg, data) {
        _super.call(this, 500 /* INTERNAL_SERVER_ERROR */, -32700 /* PARSE_ERROR */, 'Parse error: ' + msg, data);
    }
    return ParseError;
})(RPCError);
exports.ParseError = ParseError;

/**
* @class InvalidRequestError
* @constructor
* @extends RPCError
* @param {String} msg
* @param {Any} data
*/
var InvalidRequestError = (function (_super) {
    __extends(InvalidRequestError, _super);
    function InvalidRequestError(msg, data) {
        _super.call(this, 400 /* BAD_REQUEST */, -32600, 'Invalid Request: ' + msg, data);
    }
    return InvalidRequestError;
})(RPCError);
exports.InvalidRequestError = InvalidRequestError;

/**
* @class MethodNotFoundError
* @constructor
* @extends RPCError
* @param {String} msg
* @param {Any} data
*/
var MethodNotFoundError = (function (_super) {
    __extends(MethodNotFoundError, _super);
    function MethodNotFoundError(msg, data) {
        _super.call(this, 404 /* NOT_FOUND */, -32601, 'Method not found: ' + msg, data);
    }
    return MethodNotFoundError;
})(RPCError);
exports.MethodNotFoundError = MethodNotFoundError;

/**
* @class InvalidParamsError
* @constructor
* @extends RPCError
* @param {Array<String>} msg
* @param {Any} data
*/
var InvalidParamsError = (function (_super) {
    __extends(InvalidParamsError, _super);
    function InvalidParamsError(msg, data) {
        if (msg instanceof Array) {
            msg = msg.join('\n');
        }
        _super.call(this, 200 /* OK */, -32602, 'Invalid method parameter is found: \n' + msg, data);
    }
    return InvalidParamsError;
})(RPCError);
exports.InvalidParamsError = InvalidParamsError;

/**
* @class InternalError
* @constructor
* @extends RPCError
* @param {String} msg
* @param {Any} data
*/
var InternalError = (function (_super) {
    __extends(InternalError, _super);
    function InternalError(msg, data) {
        _super.call(this, 500 /* INTERNAL_SERVER_ERROR */, -32603, 'Internal error: ' + msg, data);
    }
    return InternalError;
})(RPCError);
exports.InternalError = InternalError;

/**
* @class ApplicationError
* @constructor
* @extends IRPCOverHTTPError
* @param {String} msg
* @param {Any} data
*/
var ApplicationError = (function () {
    function ApplicationError(rpcHttpStatus, code, message, data) {
        this.rpcHttpStatus = rpcHttpStatus;
        this.code = code;
        this.message = message;
        this.data = data;
    }
    /**
    * @method toStrictRPCError
    * @return {IRPCError}
    */
    ApplicationError.prototype.toStrictRPCError = function () {
        return {
            code: this.code,
            message: this.message
        };
    };
    return ApplicationError;
})();
exports.ApplicationError = ApplicationError;

/**
* @class ForbiddenError
* @constructor
* @extends ApplicationError
* @param {String} msg
* @param {Any} [data]
*/
var ForbiddenError = (function (_super) {
    __extends(ForbiddenError, _super);
    function ForbiddenError(msg, data) {
        _super.call(this, 200 /* OK */, 23001 /* FORBIDDEN */, msg, data);
    }
    return ForbiddenError;
})(ApplicationError);
exports.ForbiddenError = ForbiddenError;

/**
* @class NotFoundError
* @constructor
* @extends ApplicationError
* @param {String} msg
* @param {Any} [data]
*/
var NotFoundError = (function (_super) {
    __extends(NotFoundError, _super);
    function NotFoundError(msg, data) {
        _super.call(this, 404 /* NOT_FOUND */, 24001 /* DATA_NOT_FOUND */, msg, data);
    }
    return NotFoundError;
})(ApplicationError);
exports.NotFoundError = NotFoundError;

/**
* @class DuplicatedError
* @constructor
* @extends ApplicationError
* @param {String} msg
* @param {Any} [data]
*/
var DuplicatedError = (function (_super) {
    __extends(DuplicatedError, _super);
    function DuplicatedError(msg, data) {
        _super.call(this, 200 /* OK */, 19999 /* NOT_DEFINED */, msg, data);
    }
    return DuplicatedError;
})(ApplicationError);
exports.DuplicatedError = DuplicatedError;

/**
* @class LoginError
* @constructor
* @extends ApplicationError
* @param {String} msg
* @param {Any} [data]
*/
var LoginError = (function (_super) {
    __extends(LoginError, _super);
    function LoginError(msg, data) {
        _super.call(this, 200 /* OK */, 23000 /* AUTH_ERROR */, msg, data);
    }
    return LoginError;
})(ApplicationError);
exports.LoginError = LoginError;

/**
* @class UnauthorizedError
* @constructor
* @extends ApplicationError
* @param {String} msg
* @param {Any} [data]
*/
var UnauthorizedError = (function (_super) {
    __extends(UnauthorizedError, _super);
    function UnauthorizedError(msg, data) {
        _super.call(this, 200 /* OK */, 23000 /* AUTH_ERROR */, msg, data);
    }
    return UnauthorizedError;
})(ApplicationError);
exports.UnauthorizedError = UnauthorizedError;

/**
* @class VersionConflictError
* @constructor
* @extends ApplicationError
* @param {String} msg
* @param {Any} [data]
*/
var VersionConflictError = (function (_super) {
    __extends(VersionConflictError, _super);
    function VersionConflictError(msg, data) {
        _super.call(this, 200 /* OK */, 24002 /* DATA_VERSION_CONFLICT */, msg, data);
    }
    return VersionConflictError;
})(ApplicationError);
exports.VersionConflictError = VersionConflictError;

/**
* @class ExternalParameterError
* @constructor
* @extends ApplicationError
* @param {String} msg
* @param {Any} [data]
*/
var ExternalParameterError = (function (_super) {
    __extends(ExternalParameterError, _super);
    function ExternalParameterError(msg, data) {
        _super.call(this, 200 /* OK */, 22000 /* CONFIG_ERROR */, msg, data);
    }
    return ExternalParameterError;
})(ApplicationError);
exports.ExternalParameterError = ExternalParameterError;

(function (RPC_ERROR) {
    RPC_ERROR[RPC_ERROR["INVALID_REQUEST"] = -32600] = "INVALID_REQUEST";
    RPC_ERROR[RPC_ERROR["METHOD_NOT_FOUND"] = -32601] = "METHOD_NOT_FOUND";
    RPC_ERROR[RPC_ERROR["INVALID_PARAMS"] = -32602] = "INVALID_PARAMS";
    RPC_ERROR[RPC_ERROR["INTERNAL_ERROR"] = -32603] = "INTERNAL_ERROR";
    RPC_ERROR[RPC_ERROR["PARSE_ERROR"] = -32700] = "PARSE_ERROR";
    RPC_ERROR[RPC_ERROR["CONFIG_ERROR"] = 22000] = "CONFIG_ERROR";
    RPC_ERROR[RPC_ERROR["AUTH_ERROR"] = 23000] = "AUTH_ERROR";
    RPC_ERROR[RPC_ERROR["FORBIDDEN"] = 23001] = "FORBIDDEN";
    RPC_ERROR[RPC_ERROR["DATA_NOT_FOUND"] = 24001] = "DATA_NOT_FOUND";
    RPC_ERROR[RPC_ERROR["DATA_VERSION_CONFLICT"] = 24002] = "DATA_VERSION_CONFLICT";
    RPC_ERROR[RPC_ERROR["DATA_DUPLICATE"] = 24003] = "DATA_DUPLICATE";
    RPC_ERROR[RPC_ERROR["NOT_DEFINED"] = 19999] = "NOT_DEFINED";
})(exports.RPC_ERROR || (exports.RPC_ERROR = {}));
var RPC_ERROR = exports.RPC_ERROR;

(function (HTTP_STATUS) {
    HTTP_STATUS[HTTP_STATUS["OK"] = 200] = "OK";
    HTTP_STATUS[HTTP_STATUS["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    HTTP_STATUS[HTTP_STATUS["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    HTTP_STATUS[HTTP_STATUS["FORBIDDEN"] = 403] = "FORBIDDEN";
    HTTP_STATUS[HTTP_STATUS["NOT_FOUND"] = 404] = "NOT_FOUND";
    HTTP_STATUS[HTTP_STATUS["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
})(exports.HTTP_STATUS || (exports.HTTP_STATUS = {}));
var HTTP_STATUS = exports.HTTP_STATUS;
