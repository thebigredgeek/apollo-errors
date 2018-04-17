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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var extendable_error_1 = require("extendable-error");
var isString = function (d) { return Object.prototype.toString.call(d) === '[object String]'; };
var isObject = function (d) { return Object.prototype.toString.call(d) === '[object Object]'; };
var ApolloError = /** @class */ (function (_super) {
    __extends(ApolloError, _super);
    // NOTE: The object passed to the Constructor is actually `ctorData`.
    //       We are binding the constructor to the name and config object
    //       for the first two parameters inside of `createError`
    function ApolloError(name, config, ctorConfig) {
        var _this = _super.call(this, (ctorConfig && ctorConfig.message) || (config && config.message) || '') || this;
        _this._showLocations = false;
        _this._showPath = false;
        var t = (ctorConfig && ctorConfig.time_thrown) || (config && config.time_thrown) || (new Date()).toISOString();
        var m = (ctorConfig && ctorConfig.message) || (config && config.message) || '';
        var ctorData = (ctorConfig && ctorConfig.data) || {};
        var ctorInternalData = (ctorConfig && ctorConfig.internalData) || {};
        var configData = (config && config.data) || {};
        var configInternalData = (config && config.internalData) || {};
        var d = __assign({}, _this.data, configData, ctorData);
        var id = __assign({}, _this.internalData, configInternalData, ctorInternalData);
        var ctorOptions = (ctorConfig && ctorConfig.options) || {};
        var configOptions = (config && config.options) || {};
        var opts = __assign({}, configOptions, ctorOptions);
        _this.name = name;
        _this.message = m;
        _this.time_thrown = t;
        _this.data = d;
        _this.internalData = id;
        _this._showLocations = !!opts.showLocations;
        _this._showPath = !!opts.showPath;
        return _this;
    }
    ApolloError.prototype.serialize = function () {
        var _a = this, name = _a.name, message = _a.message, time_thrown = _a.time_thrown, data = _a.data, _showLocations = _a._showLocations, _showPath = _a._showPath, path = _a.path, locations = _a.locations;
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
        }
        if (_showPath) {
            error.path = path;
        }
        return error;
    };
    return ApolloError;
}(extendable_error_1.default));
exports.ApolloError = ApolloError;
exports.isInstance = function (e) { return e instanceof ApolloError; };
exports.createError = function (name, config) {
    assert(isObject(config), 'createError requires a config object as the second parameter');
    assert(isString(config.message), 'createError requires a "message" property on the config object passed as the second parameter');
    // NOTE: The first two parameters give to the constructor will always be name and config
    //       Parameters passed to the constructor when `new` is invoked will be passed as
    //       subsequent parameters.
    return ApolloError.bind(null, name, config);
};
exports.formatError = function (error, returnNull) {
    if (returnNull === void 0) { returnNull = false; }
    var originalError = error ? error.originalError || error : null;
    if (!originalError)
        return returnNull ? null : error;
    var name = originalError.name;
    if (!name || !exports.isInstance(originalError))
        return returnNull ? null : error;
    var time_thrown = originalError.time_thrown, message = originalError.message, data = originalError.data, _showLocations = originalError._showLocations, _showPath = originalError._showPath;
    var locations = error.locations, path = error.path;
    if (_showLocations) {
        originalError.locations = locations;
    }
    if (_showPath) {
        originalError.path = path;
    }
    return originalError.serialize();
};
//# sourceMappingURL=index.js.map