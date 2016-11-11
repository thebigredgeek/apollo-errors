'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatError = exports.createError = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _es6Error = require('es6-error');

var _es6Error2 = _interopRequireDefault(_es6Error);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var errorMap = new Map();

var DELIMITER = ':';

var serializeName = function serializeName() {
  var arr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  return arr.reduce(function (str, val) {
    return '' + (str.length > 0 ? str + DELIMITER : str) + val;
  }, '');
};
var deserializeName = function deserializeName() {
  var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  var arr = [];
  var str = name.split(DELIMITER);
  arr.push(str.shift());
  arr.push(str.join(DELIMITER));
  return arr;
};

var ApolloError = function (_ExtendableError) {
  _inherits(ApolloError, _ExtendableError);

  function ApolloError(name, _ref) {
    var message = _ref.message,
        _ref$time_thrown = _ref.time_thrown,
        time_thrown = _ref$time_thrown === undefined ? new Date().toISOString() : _ref$time_thrown,
        _ref$data = _ref.data,
        data = _ref$data === undefined ? {} : _ref$data;

    _classCallCheck(this, ApolloError);

    var t = arguments[2] && arguments[2].thrown_at || time_thrown;
    var d = Object.assign({}, data, arguments[2] && arguments[2].data || {});

    var _this = _possibleConstructorReturn(this, (ApolloError.__proto__ || Object.getPrototypeOf(ApolloError)).call(this, serializeName([name, t])));

    _this._name = name;
    _this._humanized_message = message || '';
    _this._time_thrown = t;
    _this._data = d;
    return _this;
  }

  _createClass(ApolloError, [{
    key: 'serialize',
    value: function serialize() {
      var name = this._name;
      var message = this._humanized_message;
      var time_thrown = this._time_thrown;
      var data = this._data;
      return {
        message: message,
        name: name,
        time_thrown: time_thrown,
        data: data
      };
    }
  }]);

  return ApolloError;
}(_es6Error2.default);

var createError = exports.createError = function createError(name) {
  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { message: 'An error has occurred' };

  var e = ApolloError.bind(null, name, data);
  errorMap.set(name, e);
  return e;
};

var formatError = exports.formatError = function formatError(originalError) {
  var returnNull = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var _deserializeName = deserializeName(originalError.message),
      _deserializeName2 = _slicedToArray(_deserializeName, 2),
      name = _deserializeName2[0],
      thrown_at = _deserializeName2[1];

  if (!name) return returnNull ? null : originalError;
  var CustomError = errorMap.get(name);
  if (!CustomError) return returnNull ? null : originalError;
  var error = new CustomError({
    thrown_at: thrown_at
  });
  return error.serialize();
};
//# sourceMappingURL=index.js.map