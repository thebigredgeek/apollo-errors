'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatError = exports.createError = exports.isInstance = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _es6Error = require('es6-error');

var _es6Error2 = _interopRequireDefault(_es6Error);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var isString = function isString(d) {
  return Object.prototype.toString.call(d) === '[object String]';
};
var isObject = function isObject(d) {
  return Object.prototype.toString.call(d) === '[object Object]';
};

var ApolloError = function (_ExtendableError) {
  _inherits(ApolloError, _ExtendableError);

  function ApolloError(name, _ref) {
    var message = _ref.message,
        _ref$time_thrown = _ref.time_thrown,
        time_thrown = _ref$time_thrown === undefined ? new Date().toISOString() : _ref$time_thrown,
        _ref$data = _ref.data,
        data = _ref$data === undefined ? {} : _ref$data,
        _ref$options = _ref.options,
        options = _ref$options === undefined ? {} : _ref$options;

    _classCallCheck(this, ApolloError);

    var t = arguments[2] && arguments[2].time_thrown || time_thrown;
    var d = Object.assign({}, data, arguments[2] && arguments[2].data || {});
    var m = arguments[2] && arguments[2].message || message;
    var opts = Object.assign({}, options, arguments[2] && arguments[2].options || {});

    var _this = _possibleConstructorReturn(this, (ApolloError.__proto__ || Object.getPrototypeOf(ApolloError)).call(this, m));

    _this.name = name;
    _this.message = m;
    _this.time_thrown = t;
    _this.data = d;
    _this._showLocations = !!opts.showLocations;
    return _this;
  }

  _createClass(ApolloError, [{
    key: 'serialize',
    value: function serialize() {
      var name = this.name,
          message = this.message,
          time_thrown = this.time_thrown,
          data = this.data,
          _showLocations = this._showLocations,
          path = this.path,
          locations = this.locations;


      var error = {
        message: message,
        name: name,
        time_thrown: time_thrown,
        data: data
      };

      if (_showLocations) {
        error.locations = locations;
        error.path = path;
      }

      return error;
    }
  }]);

  return ApolloError;
}(_es6Error2.default);

var isInstance = exports.isInstance = function isInstance(e) {
  return e instanceof ApolloError;
};

var createError = exports.createError = function createError(name, config) {
  (0, _assert2.default)(isObject(config), 'createError requires a config object as the second parameter');
  (0, _assert2.default)(isString(config.message), 'createError requires a "message" property on the config object passed as the second parameter');
  var e = ApolloError.bind(null, name, config);
  return e;
};

var formatError = exports.formatError = function formatError(error) {
  var returnNull = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var originalError = error ? error.originalError || error : null;

  if (!originalError) return returnNull ? null : error;

  var name = originalError.name;


  if (!name || !isInstance(originalError)) return returnNull ? null : error;

  var time_thrown = originalError.time_thrown,
      message = originalError.message,
      data = originalError.data,
      _showLocations = originalError._showLocations;


  if (_showLocations) {
    var locations = error.locations,
        path = error.path;

    originalError.locations = locations;
    originalError.path = path;
  }

  return originalError.serialize();
};
//# sourceMappingURL=index.js.map