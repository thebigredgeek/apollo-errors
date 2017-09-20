"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var extendable_error_1 = require("extendable-error");
var isString = function (d) { return Object.prototype.toString.call(d) === '[object String]'; };
var isObject = function (d) { return Object.prototype.toString.call(d) === '[object Object]'; };
var ApolloError = /** @class */ (function (_super) {
    __extends(ApolloError, _super);
    function ApolloError(name, config) {
        var _this = this;
        var t = (config && config.time_thrown) || (new Date()).toISOString();
        var d = (config && config.data || {});
        var m = (config && config.message) || '';
        var opts = ((config && config.options) || {});
        _this = _super.call(this, m) || this;
        _this.name = name;
        _this.message = m;
        _this.time_thrown = t;
        _this.data = d;
        _this._showLocations = !!opts.showLocations;
        return _this;
    }
    ApolloError.prototype.serialize = function () {
        var _a = this, name = _a.name, message = _a.message, time_thrown = _a.time_thrown, data = _a.data, _showLocations = _a._showLocations, path = _a.path, locations = _a.locations;
        var error = {
            message: message,
            name: name,
            time_thrown: time_thrown,
            data: data,
            path: path,
            locations: locations
        };
        if (_showLocations) {
            error.locations = locations;
            error.path = path;
        }
        return error;
    };
    return ApolloError;
}(extendable_error_1.default));
exports.isInstance = function (e) { return e instanceof ApolloError; };
exports.createError = function (name, config) {
    console.log('config', config);
    assert(isObject(config), 'createError requires a config object as the second parameter');
    assert(isString(config.message), 'createError requires a "message" property on the config object passed as the second parameter');
    var e = ApolloError.bind(null, name, config);
    return e;
};
exports.formatError = function (error, returnNull) {
    if (returnNull === void 0) { returnNull = false; }
    var originalError = error ? error.originalError || error : null;
    if (!originalError)
        return returnNull ? null : error;
    var name = originalError.name;
    if (!name || !exports.isInstance(originalError))
        return returnNull ? null : error;
    var time_thrown = originalError.time_thrown, message = originalError.message, data = originalError.data, _showLocations = originalError._showLocations;
    if (_showLocations) {
        var locations = error.locations, path = error.path;
        originalError.locations = locations;
        originalError.path = path;
    }
    return originalError.serialize();
};
//# sourceMappingURL=index.js.map