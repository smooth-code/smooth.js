module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/static/node/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./node_modules/smooth-core/lib/client/main-node.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/smooth-core/lib/client/AppContainer.js":
/*!*************************************************************!*\
  !*** ./node_modules/smooth-core/lib/client/AppContainer.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nexports.__esModule = true;\nexports.default = AppContainer;\n\nvar _react = _interopRequireDefault(__webpack_require__(/*! react */ \"react\"));\n\nvar _smooth_app = _interopRequireDefault(__webpack_require__(/*! __smooth_app */ \"./node_modules/smooth-core/lib/client/_app.js\"));\n\nvar _ErrorBoundary = _interopRequireDefault(__webpack_require__(/*! ./ErrorBoundary */ \"./node_modules/smooth-core/lib/client/ErrorBoundary.js\"));\n\nvar _ErrorContext = _interopRequireDefault(__webpack_require__(/*! ./ErrorContext */ \"./node_modules/smooth-core/lib/client/ErrorContext.js\"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction AppContainer() {\n  return _react.default.createElement(_ErrorContext.default.Consumer, null, ({\n    error\n  }) => _react.default.createElement(_ErrorBoundary.default, {\n    error: error\n  }, _react.default.createElement(_smooth_app.default, null)));\n}\n\n//# sourceURL=webpack:///./node_modules/smooth-core/lib/client/AppContainer.js?");

/***/ }),

/***/ "./node_modules/smooth-core/lib/client/ErrorBoundary.js":
/*!**************************************************************!*\
  !*** ./node_modules/smooth-core/lib/client/ErrorBoundary.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nexports.__esModule = true;\nexports.default = void 0;\n\nvar _react = _interopRequireDefault(__webpack_require__(/*! react */ \"react\"));\n\nvar _smooth_error = _interopRequireDefault(__webpack_require__(/*! __smooth_error */ \"./node_modules/smooth-core/lib/client/_error.js\"));\n\nvar _Status = _interopRequireDefault(__webpack_require__(/*! ./router/Status */ \"./node_modules/smooth-core/lib/client/router/Status.js\"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\n\nclass ErrorBoundary extends _react.default.Component {\n  constructor(...args) {\n    super(...args);\n\n    _defineProperty(this, \"state\", {\n      error: this.props.error\n    });\n  }\n\n  static getDerivedStateFromError(error) {\n    return {\n      error\n    };\n  }\n\n  render() {\n    const {\n      error\n    } = this.state;\n\n    if (error) {\n      return _react.default.createElement(_Status.default, {\n        code: error.statusCode\n      }, _react.default.createElement(_smooth_error.default, {\n        error: error\n      }));\n    }\n\n    return this.props.children;\n  }\n\n}\n\nexports.default = ErrorBoundary;\n\n//# sourceURL=webpack:///./node_modules/smooth-core/lib/client/ErrorBoundary.js?");

/***/ }),

/***/ "./node_modules/smooth-core/lib/client/ErrorContext.js":
/*!*************************************************************!*\
  !*** ./node_modules/smooth-core/lib/client/ErrorContext.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nexports.__esModule = true;\nexports.default = void 0;\n\nvar _react = _interopRequireDefault(__webpack_require__(/*! react */ \"react\"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar _default = _react.default.createContext({\n  error: null\n});\n\nexports.default = _default;\n\n//# sourceURL=webpack:///./node_modules/smooth-core/lib/client/ErrorContext.js?");

/***/ }),

/***/ "./node_modules/smooth-core/lib/client/_app.js":
/*!*****************************************************!*\
  !*** ./node_modules/smooth-core/lib/client/_app.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nexports.__esModule = true;\nexports.default = App;\n\nvar _react = _interopRequireDefault(__webpack_require__(/*! react */ \"react\"));\n\nvar _Routes = __webpack_require__(/*! ../components/Routes */ \"./node_modules/smooth-core/lib/components/Routes.js\");\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction App() {\n  return _react.default.createElement(_Routes.Routes, null);\n}\n\n//# sourceURL=webpack:///./node_modules/smooth-core/lib/client/_app.js?");

/***/ }),

/***/ "./node_modules/smooth-core/lib/client/_document.js":
/*!**********************************************************!*\
  !*** ./node_modules/smooth-core/lib/client/_document.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nexports.__esModule = true;\nexports.default = Document;\n\nvar _react = _interopRequireDefault(__webpack_require__(/*! react */ \"react\"));\n\nvar _document = __webpack_require__(/*! ../document */ \"./node_modules/smooth-core/lib/document/index.js\");\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction Document() {\n  return _react.default.createElement(_document.Html, null, _react.default.createElement(_document.Head, null), _react.default.createElement(\"body\", null, _react.default.createElement(_document.Main, null), _react.default.createElement(_document.MainScript, null)));\n}\n\n//# sourceURL=webpack:///./node_modules/smooth-core/lib/client/_document.js?");

/***/ }),

/***/ "./node_modules/smooth-core/lib/client/_error.js":
/*!*******************************************************!*\
  !*** ./node_modules/smooth-core/lib/client/_error.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nexports.__esModule = true;\nexports.default = ErrorPage;\n\nvar _react = _interopRequireDefault(__webpack_require__(/*! react */ \"react\"));\n\nvar _styledComponents = _interopRequireDefault(__webpack_require__(/*! styled-components */ \"styled-components\"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nconst Container = _styledComponents.default.div`\n  color: #000;\n  background: #fff;\n  font-family: -apple-system, BlinkMacSystemFont, Roboto, 'Segoe UI',\n    'Fira Sans', Avenir, 'Helvetica Neue', 'Lucida Grande', sans-serif;\n  height: 90vh;\n  text-align: center;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n`;\nconst Title = _styledComponents.default.h1`\n  display: inline-block;\n  border-right: 1px solid rgba(0, 0, 0, 0.3);\n  margin: 0;\n  margin-right: 20px;\n  padding: 10px 24px 10px 0;\n  font-size: 24px;\n  font-weight: 500;\n  vertical-align: top;\n`;\nconst Subtitle = _styledComponents.default.div`\n  display: inline-block;\n  text-align: left;\n  line-height: 50px;\n  height: 50px;\n  vertical-align: middle;\n\n  > h2 {\n    font-size: 14px;\n    font-weight: normal;\n    line-height: inherit;\n    margin: 0;\n    padding: 0;\n  }\n`;\nconst Stack = _styledComponents.default.code`\n  padding-top: 20px;\n  max-height: 400px;\n  overflow: auto;\n  max-width: 90%;\n  text-align: left;\n`;\n\nfunction ErrorPage({\n  error\n}) {\n  return _react.default.createElement(Container, null, _react.default.createElement(\"div\", null, _react.default.createElement(Title, null, error.statusCode || error.name), _react.default.createElement(Subtitle, null, _react.default.createElement(\"h2\", null, error.message))), _react.default.createElement(Stack, null, _react.default.createElement(\"pre\", null, error.stack)));\n}\n\n//# sourceURL=webpack:///./node_modules/smooth-core/lib/client/_error.js?");

/***/ }),

/***/ "./node_modules/smooth-core/lib/client/main-node.js":
/*!**********************************************************!*\
  !*** ./node_modules/smooth-core/lib/client/main-node.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nexports.__esModule = true;\nexports.ErrorContext = exports.AppContainer = exports.DocumentContainer = void 0;\n\n__webpack_require__(/*! @babel/polyfill */ \"@babel/polyfill\");\n\nvar _DocumentContainer = _interopRequireDefault(__webpack_require__(/*! ../document/DocumentContainer */ \"./node_modules/smooth-core/lib/document/DocumentContainer.js\"));\n\nexports.DocumentContainer = _DocumentContainer.default;\n\nvar _AppContainer = _interopRequireDefault(__webpack_require__(/*! ./AppContainer */ \"./node_modules/smooth-core/lib/client/AppContainer.js\"));\n\nexports.AppContainer = _AppContainer.default;\n\nvar _ErrorContext = _interopRequireDefault(__webpack_require__(/*! ./ErrorContext */ \"./node_modules/smooth-core/lib/client/ErrorContext.js\"));\n\nexports.ErrorContext = _ErrorContext.default;\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\n//# sourceURL=webpack:///./node_modules/smooth-core/lib/client/main-node.js?");

/***/ }),

/***/ "./node_modules/smooth-core/lib/client/router/Status.js":
/*!**************************************************************!*\
  !*** ./node_modules/smooth-core/lib/client/router/Status.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nexports.__esModule = true;\nexports.default = void 0;\n\nvar _react = _interopRequireDefault(__webpack_require__(/*! react */ \"react\"));\n\nvar _reactRouterDom = __webpack_require__(/*! react-router-dom */ \"react-router-dom\");\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nconst Status = ({\n  code,\n  children\n}) => _react.default.createElement(_reactRouterDom.Route, {\n  render: ({\n    staticContext\n  }) => {\n    if (staticContext && code) staticContext.status = code;\n    /* eslint-enable no-param-reassign */\n\n    return children;\n  }\n});\n\nvar _default = Status;\nexports.default = _default;\n\n//# sourceURL=webpack:///./node_modules/smooth-core/lib/client/router/Status.js?");

/***/ }),

/***/ "./node_modules/smooth-core/lib/components/Content.js":
/*!************************************************************!*\
  !*** ./node_modules/smooth-core/lib/components/Content.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nexports.__esModule = true;\nexports.getContents = getContents;\nexports.Content = Content;\n\nvar _react = _interopRequireDefault(__webpack_require__(/*! react */ \"react\"));\n\nvar _camelcase = _interopRequireDefault(__webpack_require__(/*! camelcase */ \"camelcase\"));\n\nvar _graphqlTag = _interopRequireDefault(__webpack_require__(/*! graphql-tag */ \"graphql-tag\"));\n\nvar _queryString = _interopRequireDefault(__webpack_require__(/*! query-string */ \"query-string\"));\n\nvar _reactApollo = __webpack_require__(/*! react-apollo */ \"react-apollo\");\n\nvar _HttpError = __webpack_require__(/*! ./HttpError */ \"./node_modules/smooth-core/lib/components/HttpError.js\");\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction getContents() {\n  const req = __webpack_require__(\"./src/contents sync recursive \\\\.js$\");\n\n  return req.keys().map(filePath => {\n    const m = req(filePath);\n    const {\n      contentFragment: fragment = null,\n      slug = null,\n      default: component\n    } = m;\n    if (!fragment) return null;\n    const {\n      name\n    } = component;\n\n    if (name !== 'Page' && !slug) {\n      throw new Error(`Please provide a slug in model ${name}`);\n    }\n\n    const path = slug ? `/:lang(.{2})?/${slug}/:slug+` : '/:lang(.{2})?/:slug*';\n    return {\n      hasSlug: Boolean(slug),\n      type: name,\n      path,\n      component,\n      fragment\n    };\n  }).sort((a, b) => a.hasSlug === b.hasSlug ? 0 : a.hasSlug ? -1 : 1).filter(Boolean);\n}\n\nfunction getQuery({\n  type,\n  fragment\n}) {\n  const fragmentDefinition = fragment.definitions.find(node => node.kind === 'FragmentDefinition' && node.typeCondition.kind === 'NamedType' && node.typeCondition.name.value === type);\n  return _graphqlTag.default`\n    query Content(\n      $lang: String\n      $slug: String!\n      $id: String\n      $preview: Boolean\n    ) {\n      content: ${(0, _camelcase.default)(type)}(\n        lang: $lang\n        slug: $slug\n        id: $id\n        preview: $preview\n      ) {\n        ...${fragmentDefinition.name.value}\n      }\n    }\n\n    ${fragment}\n  `;\n}\n\nfunction Content({\n  component: Component,\n  slug,\n  lang = null,\n  location,\n  type,\n  fragment\n}) {\n  const {\n    id,\n    preview\n  } = _queryString.default.parse(location.search);\n\n  const variables = {\n    lang,\n    slug\n  };\n\n  if (preview) {\n    variables.id = id;\n    variables.preview = true;\n  }\n\n  return _react.default.createElement(_reactApollo.Query, {\n    query: getQuery({\n      type,\n      fragment\n    }),\n    variables: variables\n  }, ({\n    loading,\n    error,\n    data\n  }) => {\n    if (loading) return null;\n\n    if (error) {\n      throw error;\n    }\n\n    if (!data.content) {\n      throw new _HttpError.HTTPError({\n        statusCode: 404\n      });\n    }\n\n    return _react.default.createElement(Component, data.content);\n  });\n}\n\n//# sourceURL=webpack:///./node_modules/smooth-core/lib/components/Content.js?");

/***/ }),

/***/ "./node_modules/smooth-core/lib/components/HttpError.js":
/*!**************************************************************!*\
  !*** ./node_modules/smooth-core/lib/components/HttpError.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nexports.__esModule = true;\nexports.HTTPError = void 0;\n\nfunction getMessage(statusCode) {\n  switch (statusCode) {\n    case 404:\n      return 'Not found';\n\n    default:\n      return `HTTP Error ${statusCode}`;\n  }\n}\n\nclass HTTPError extends Error {\n  constructor({\n    statusCode\n  }) {\n    super(getMessage(statusCode));\n    this.statusCode = statusCode;\n  }\n\n}\n\nexports.HTTPError = HTTPError;\n\n//# sourceURL=webpack:///./node_modules/smooth-core/lib/components/HttpError.js?");

/***/ }),

/***/ "./node_modules/smooth-core/lib/components/Routes.js":
/*!***********************************************************!*\
  !*** ./node_modules/smooth-core/lib/components/Routes.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nexports.__esModule = true;\nexports.Routes = Routes;\n\nvar _react = _interopRequireDefault(__webpack_require__(/*! react */ \"react\"));\n\nvar _reactRouterDom = __webpack_require__(/*! react-router-dom */ \"react-router-dom\");\n\nvar _Content = __webpack_require__(/*! ./Content */ \"./node_modules/smooth-core/lib/components/Content.js\");\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nconst contents = (0, _Content.getContents)();\n\nfunction Routes() {\n  return _react.default.createElement(_reactRouterDom.Switch, null, contents.map(content => _react.default.createElement(_reactRouterDom.Route, {\n    key: content.type,\n    path: content.path,\n    render: ({\n      location,\n      match: {\n        params: {\n          slug,\n          lang\n        }\n      }\n    }) => _react.default.createElement(_Content.Content, {\n      type: content.type,\n      component: content.component,\n      fragment: content.fragment,\n      lang: lang,\n      location: location,\n      slug: slug || 'index'\n    })\n  })));\n}\n\n//# sourceURL=webpack:///./node_modules/smooth-core/lib/components/Routes.js?");

/***/ }),

/***/ "./node_modules/smooth-core/lib/document/Context.js":
/*!**********************************************************!*\
  !*** ./node_modules/smooth-core/lib/document/Context.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nexports.__esModule = true;\nexports.default = void 0;\n\nvar _react = _interopRequireDefault(__webpack_require__(/*! react */ \"react\"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar _default = _react.default.createContext();\n\nexports.default = _default;\n\n//# sourceURL=webpack:///./node_modules/smooth-core/lib/document/Context.js?");

/***/ }),

/***/ "./node_modules/smooth-core/lib/document/DocumentContainer.js":
/*!********************************************************************!*\
  !*** ./node_modules/smooth-core/lib/document/DocumentContainer.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nexports.__esModule = true;\nexports.default = DocumentContainer;\n\nvar _react = _interopRequireDefault(__webpack_require__(/*! react */ \"react\"));\n\nvar _smooth_document = _interopRequireDefault(__webpack_require__(/*! __smooth_document */ \"./node_modules/smooth-core/lib/client/_document.js\"));\n\nvar _Context = _interopRequireDefault(__webpack_require__(/*! ./Context */ \"./node_modules/smooth-core/lib/document/Context.js\"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction DocumentContainer(props) {\n  return _react.default.createElement(_Context.default.Provider, {\n    value: props\n  }, _react.default.createElement(_smooth_document.default, null));\n}\n\n//# sourceURL=webpack:///./node_modules/smooth-core/lib/document/DocumentContainer.js?");

/***/ }),

/***/ "./node_modules/smooth-core/lib/document/GlobalScript.js":
/*!***************************************************************!*\
  !*** ./node_modules/smooth-core/lib/document/GlobalScript.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nexports.__esModule = true;\nexports.default = GlobalScript;\n\nvar _react = _interopRequireDefault(__webpack_require__(/*! react */ \"react\"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction GlobalScript({\n  varName,\n  json\n}) {\n  return _react.default.createElement(\"script\", {\n    dangerouslySetInnerHTML: {\n      __html: `window.${varName} = ${JSON.stringify(json).replace(/</g, '\\\\u003c')};`\n    }\n  });\n}\n\n//# sourceURL=webpack:///./node_modules/smooth-core/lib/document/GlobalScript.js?");

/***/ }),

/***/ "./node_modules/smooth-core/lib/document/Head.js":
/*!*******************************************************!*\
  !*** ./node_modules/smooth-core/lib/document/Head.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nexports.__esModule = true;\nexports.default = Head;\n\nvar _react = _interopRequireDefault(__webpack_require__(/*! react */ \"react\"));\n\nvar _Context = _interopRequireDefault(__webpack_require__(/*! ./Context */ \"./node_modules/smooth-core/lib/document/Context.js\"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction Head({\n  children\n}) {\n  return _react.default.createElement(_Context.default.Consumer, null, ({\n    extractor,\n    helmet,\n    sheet\n  }) => _react.default.createElement(\"head\", null, extractor.getLinkElements(), sheet.getStyleElement(), helmet.title.toComponent(), helmet.meta.toComponent(), helmet.link.toComponent(), children));\n}\n\n//# sourceURL=webpack:///./node_modules/smooth-core/lib/document/Head.js?");

/***/ }),

/***/ "./node_modules/smooth-core/lib/document/Html.js":
/*!*******************************************************!*\
  !*** ./node_modules/smooth-core/lib/document/Html.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nexports.__esModule = true;\nexports.default = Head;\n\nvar _react = _interopRequireDefault(__webpack_require__(/*! react */ \"react\"));\n\nvar _Context = _interopRequireDefault(__webpack_require__(/*! ./Context */ \"./node_modules/smooth-core/lib/document/Context.js\"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction Head({\n  children\n}) {\n  return _react.default.createElement(_Context.default.Consumer, null, ({\n    helmet\n  }) => _react.default.createElement(\"html\", helmet.htmlAttributes.toComponent(), children));\n}\n\n//# sourceURL=webpack:///./node_modules/smooth-core/lib/document/Html.js?");

/***/ }),

/***/ "./node_modules/smooth-core/lib/document/Main.js":
/*!*******************************************************!*\
  !*** ./node_modules/smooth-core/lib/document/Main.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nexports.__esModule = true;\nexports.default = Main;\n\nvar _react = _interopRequireDefault(__webpack_require__(/*! react */ \"react\"));\n\nvar _Context = _interopRequireDefault(__webpack_require__(/*! ./Context */ \"./node_modules/smooth-core/lib/document/Context.js\"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction Main() {\n  return _react.default.createElement(_Context.default.Consumer, null, ({\n    appHtml\n  }) => _react.default.createElement(\"div\", {\n    id: \"main\",\n    dangerouslySetInnerHTML: {\n      __html: appHtml\n    }\n  }));\n}\n\n//# sourceURL=webpack:///./node_modules/smooth-core/lib/document/Main.js?");

/***/ }),

/***/ "./node_modules/smooth-core/lib/document/MainScript.js":
/*!*************************************************************!*\
  !*** ./node_modules/smooth-core/lib/document/MainScript.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nexports.__esModule = true;\nexports.default = MainScript;\n\nvar _react = _interopRequireDefault(__webpack_require__(/*! react */ \"react\"));\n\nvar _Context = _interopRequireDefault(__webpack_require__(/*! ./Context */ \"./node_modules/smooth-core/lib/document/Context.js\"));\n\nvar _GlobalScript = _interopRequireDefault(__webpack_require__(/*! ./GlobalScript */ \"./node_modules/smooth-core/lib/document/GlobalScript.js\"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction MainScript() {\n  return _react.default.createElement(_Context.default.Consumer, null, ({\n    apolloState,\n    error,\n    extractor\n  }) => _react.default.createElement(_react.default.Fragment, null, _react.default.createElement(_GlobalScript.default, {\n    varName: \"__APOLLO_STATE__\",\n    json: apolloState\n  }), _react.default.createElement(_GlobalScript.default, {\n    varName: \"__SMOOTH_ERROR__\",\n    json: error ? {\n      name: error.name,\n      statusCode: error.statusCode,\n      stack: error.stack,\n      message: error.message\n    } : null\n  }), extractor.getScriptElements()));\n}\n\n//# sourceURL=webpack:///./node_modules/smooth-core/lib/document/MainScript.js?");

/***/ }),

/***/ "./node_modules/smooth-core/lib/document/index.js":
/*!********************************************************!*\
  !*** ./node_modules/smooth-core/lib/document/index.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nexports.__esModule = true;\nexports.MainScript = exports.Main = exports.Head = exports.Html = void 0;\n\nvar _Html = _interopRequireDefault(__webpack_require__(/*! ./Html */ \"./node_modules/smooth-core/lib/document/Html.js\"));\n\nexports.Html = _Html.default;\n\nvar _Head = _interopRequireDefault(__webpack_require__(/*! ./Head */ \"./node_modules/smooth-core/lib/document/Head.js\"));\n\nexports.Head = _Head.default;\n\nvar _Main = _interopRequireDefault(__webpack_require__(/*! ./Main */ \"./node_modules/smooth-core/lib/document/Main.js\"));\n\nexports.Main = _Main.default;\n\nvar _MainScript = _interopRequireDefault(__webpack_require__(/*! ./MainScript */ \"./node_modules/smooth-core/lib/document/MainScript.js\"));\n\nexports.MainScript = _MainScript.default;\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\n//# sourceURL=webpack:///./node_modules/smooth-core/lib/document/index.js?");

/***/ }),

/***/ "./src/contents sync recursive \\.js$":
/*!*********************************!*\
  !*** ./src/contents sync \.js$ ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var map = {\n\t\"./Book.js\": \"./src/contents/Book.js\",\n\t\"./Page.js\": \"./src/contents/Page.js\"\n};\n\n\nfunction webpackContext(req) {\n\tvar id = webpackContextResolve(req);\n\treturn __webpack_require__(id);\n}\nfunction webpackContextResolve(req) {\n\tvar id = map[req];\n\tif(!(id + 1)) { // check for number or string\n\t\tvar e = new Error(\"Cannot find module '\" + req + \"'\");\n\t\te.code = 'MODULE_NOT_FOUND';\n\t\tthrow e;\n\t}\n\treturn id;\n}\nwebpackContext.keys = function webpackContextKeys() {\n\treturn Object.keys(map);\n};\nwebpackContext.resolve = webpackContextResolve;\nmodule.exports = webpackContext;\nwebpackContext.id = \"./src/contents sync recursive \\\\.js$\";\n\n//# sourceURL=webpack:///./src/contents_sync_\\.js$?");

/***/ }),

/***/ "./src/contents/Book.js":
/*!******************************!*\
  !*** ./src/contents/Book.js ***!
  \******************************/
/*! exports provided: contentFragment, slug, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"contentFragment\", function() { return contentFragment; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"slug\", function() { return slug; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Book; });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var graphql_tag__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! graphql-tag */ \"graphql-tag\");\n/* harmony import */ var graphql_tag__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(graphql_tag__WEBPACK_IMPORTED_MODULE_1__);\nfunction _templateObject() {\n  var data = _taggedTemplateLiteralLoose([\"\\n  fragment BookFragment on Book {\\n    name\\n  }\\n\"]);\n\n  _templateObject = function _templateObject() {\n    return data;\n  };\n\n  return data;\n}\n\nfunction _taggedTemplateLiteralLoose(strings, raw) { if (!raw) { raw = strings.slice(0); } strings.raw = raw; return strings; }\n\n\n\nvar contentFragment = graphql_tag__WEBPACK_IMPORTED_MODULE_1___default()(_templateObject());\nvar slug = 'books';\nfunction Book(_ref) {\n  var name = _ref.name;\n  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", null, name);\n}\n\n//# sourceURL=webpack:///./src/contents/Book.js?");

/***/ }),

/***/ "./src/contents/Page.js":
/*!******************************!*\
  !*** ./src/contents/Page.js ***!
  \******************************/
/*! exports provided: contentFragment, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"contentFragment\", function() { return contentFragment; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Page; });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var graphql_tag__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! graphql-tag */ \"graphql-tag\");\n/* harmony import */ var graphql_tag__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(graphql_tag__WEBPACK_IMPORTED_MODULE_1__);\nfunction _templateObject() {\n  var data = _taggedTemplateLiteralLoose([\"\\n  fragment PageFragment on Page {\\n    metadata {\\n      slug\\n    }\\n    title\\n    book {\\n      metadata {\\n        slug\\n      }\\n      name\\n    }\\n  }\\n\"]);\n\n  _templateObject = function _templateObject() {\n    return data;\n  };\n\n  return data;\n}\n\nfunction _taggedTemplateLiteralLoose(strings, raw) { if (!raw) { raw = strings.slice(0); } strings.raw = raw; return strings; }\n\n\n\nvar contentFragment = graphql_tag__WEBPACK_IMPORTED_MODULE_1___default()(_templateObject());\nfunction Page(_ref) {\n  var title = _ref.title,\n      book = _ref.book,\n      metadata = _ref.metadata;\n  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", null, metadata.slug, title, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", null, book.name));\n}\n\n//# sourceURL=webpack:///./src/contents/Page.js?");

/***/ }),

/***/ "@babel/polyfill":
/*!**********************************!*\
  !*** external "@babel/polyfill" ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"@babel/polyfill\");\n\n//# sourceURL=webpack:///external_%22@babel/polyfill%22?");

/***/ }),

/***/ "camelcase":
/*!****************************!*\
  !*** external "camelcase" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"camelcase\");\n\n//# sourceURL=webpack:///external_%22camelcase%22?");

/***/ }),

/***/ "graphql-tag":
/*!******************************!*\
  !*** external "graphql-tag" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"graphql-tag\");\n\n//# sourceURL=webpack:///external_%22graphql-tag%22?");

/***/ }),

/***/ "query-string":
/*!*******************************!*\
  !*** external "query-string" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"query-string\");\n\n//# sourceURL=webpack:///external_%22query-string%22?");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"react\");\n\n//# sourceURL=webpack:///external_%22react%22?");

/***/ }),

/***/ "react-apollo":
/*!*******************************!*\
  !*** external "react-apollo" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"react-apollo\");\n\n//# sourceURL=webpack:///external_%22react-apollo%22?");

/***/ }),

/***/ "react-router-dom":
/*!***********************************!*\
  !*** external "react-router-dom" ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"react-router-dom\");\n\n//# sourceURL=webpack:///external_%22react-router-dom%22?");

/***/ }),

/***/ "styled-components":
/*!************************************!*\
  !*** external "styled-components" ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"styled-components\");\n\n//# sourceURL=webpack:///external_%22styled-components%22?");

/***/ })

/******/ });