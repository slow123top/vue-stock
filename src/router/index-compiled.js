'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

var _vueRouter = require('vue-router');

var _vueRouter2 = _interopRequireDefault(_vueRouter);

var _HomePage = require('../components/article/HomePage');

var _HomePage2 = _interopRequireDefault(_HomePage);

var _SelectIndex = require('../components/stock/SelectIndex');

var _SelectIndex2 = _interopRequireDefault(_SelectIndex);

var _Result = require('../components/stock/Result');

var _Result2 = _interopRequireDefault(_Result);

var _History = require('../components/stock/History');

var _History2 = _interopRequireDefault(_History);

var _Backstage = require('../Backstage');

var _Backstage2 = _interopRequireDefault(_Backstage);

var _Article = require('../components/backstage/Article');

var _Article2 = _interopRequireDefault(_Article);

var _Officialannounce = require('../components/backstage/Officialannounce');

var _Officialannounce2 = _interopRequireDefault(_Officialannounce);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_vue2.default.use(_vueRouter2.default);
exports.default = new _vueRouter2.default({
  mode: 'history',
  routes: [{
    path: '/home',
    name: 'home',
    component: _HomePage2.default
  }, {
    path: '/newModel',
    component: _SelectIndex2.default
  }, {
    path: '/result',
    component: _Result2.default
  }, {
    path: '/history',
    component: _History2.default
  }, {
    path: '/backstage/article',

    name: 'article',
    component: _Article2.default

  }, {
    path: '/backstage/official',
    name: 'official',
    component: _Officialannounce2.default
  }]
});

//# sourceMappingURL=index-compiled.js.map