"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/get-proto";
exports.ids = ["vendor-chunks/get-proto"];
exports.modules = {

/***/ "(ssr)/../backend/node_modules/get-proto/Object.getPrototypeOf.js":
/*!******************************************************************!*\
  !*** ../backend/node_modules/get-proto/Object.getPrototypeOf.js ***!
  \******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("\n\nvar $Object = __webpack_require__(/*! es-object-atoms */ \"(ssr)/../backend/node_modules/es-object-atoms/index.js\");\n\n/** @type {import('./Object.getPrototypeOf')} */\nmodule.exports = $Object.getPrototypeOf || null;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi4vYmFja2VuZC9ub2RlX21vZHVsZXMvZ2V0LXByb3RvL09iamVjdC5nZXRQcm90b3R5cGVPZi5qcyIsIm1hcHBpbmdzIjoiQUFBYTs7QUFFYixjQUFjLG1CQUFPLENBQUMsK0VBQWlCOztBQUV2QyxXQUFXLG1DQUFtQztBQUM5QyIsInNvdXJjZXMiOlsiQzpcXFVzZXJzXFxMdWNreSBNYWhhbGVcXE9uZURyaXZlXFxEZXNrdG9wXFxyc2djX2FwcFxcUlNHQ1xcYmFja2VuZFxcbm9kZV9tb2R1bGVzXFxnZXQtcHJvdG9cXE9iamVjdC5nZXRQcm90b3R5cGVPZi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbnZhciAkT2JqZWN0ID0gcmVxdWlyZSgnZXMtb2JqZWN0LWF0b21zJyk7XG5cbi8qKiBAdHlwZSB7aW1wb3J0KCcuL09iamVjdC5nZXRQcm90b3R5cGVPZicpfSAqL1xubW9kdWxlLmV4cG9ydHMgPSAkT2JqZWN0LmdldFByb3RvdHlwZU9mIHx8IG51bGw7XG4iXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbMF0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/../backend/node_modules/get-proto/Object.getPrototypeOf.js\n");

/***/ }),

/***/ "(ssr)/../backend/node_modules/get-proto/Reflect.getPrototypeOf.js":
/*!*******************************************************************!*\
  !*** ../backend/node_modules/get-proto/Reflect.getPrototypeOf.js ***!
  \*******************************************************************/
/***/ ((module) => {

eval("\n\n/** @type {import('./Reflect.getPrototypeOf')} */\nmodule.exports = (typeof Reflect !== 'undefined' && Reflect.getPrototypeOf) || null;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi4vYmFja2VuZC9ub2RlX21vZHVsZXMvZ2V0LXByb3RvL1JlZmxlY3QuZ2V0UHJvdG90eXBlT2YuanMiLCJtYXBwaW5ncyI6IkFBQWE7O0FBRWIsV0FBVyxvQ0FBb0M7QUFDL0MiLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcTHVja3kgTWFoYWxlXFxPbmVEcml2ZVxcRGVza3RvcFxccnNnY19hcHBcXFJTR0NcXGJhY2tlbmRcXG5vZGVfbW9kdWxlc1xcZ2V0LXByb3RvXFxSZWZsZWN0LmdldFByb3RvdHlwZU9mLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuLyoqIEB0eXBlIHtpbXBvcnQoJy4vUmVmbGVjdC5nZXRQcm90b3R5cGVPZicpfSAqL1xubW9kdWxlLmV4cG9ydHMgPSAodHlwZW9mIFJlZmxlY3QgIT09ICd1bmRlZmluZWQnICYmIFJlZmxlY3QuZ2V0UHJvdG90eXBlT2YpIHx8IG51bGw7XG4iXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbMF0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/../backend/node_modules/get-proto/Reflect.getPrototypeOf.js\n");

/***/ }),

/***/ "(ssr)/../backend/node_modules/get-proto/index.js":
/*!**************************************************!*\
  !*** ../backend/node_modules/get-proto/index.js ***!
  \**************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("\n\nvar reflectGetProto = __webpack_require__(/*! ./Reflect.getPrototypeOf */ \"(ssr)/../backend/node_modules/get-proto/Reflect.getPrototypeOf.js\");\nvar originalGetProto = __webpack_require__(/*! ./Object.getPrototypeOf */ \"(ssr)/../backend/node_modules/get-proto/Object.getPrototypeOf.js\");\n\nvar getDunderProto = __webpack_require__(/*! dunder-proto/get */ \"(ssr)/../backend/node_modules/dunder-proto/get.js\");\n\n/** @type {import('.')} */\nmodule.exports = reflectGetProto\n\t? function getProto(O) {\n\t\t// @ts-expect-error TS can't narrow inside a closure, for some reason\n\t\treturn reflectGetProto(O);\n\t}\n\t: originalGetProto\n\t\t? function getProto(O) {\n\t\t\tif (!O || (typeof O !== 'object' && typeof O !== 'function')) {\n\t\t\t\tthrow new TypeError('getProto: not an object');\n\t\t\t}\n\t\t\t// @ts-expect-error TS can't narrow inside a closure, for some reason\n\t\t\treturn originalGetProto(O);\n\t\t}\n\t\t: getDunderProto\n\t\t\t? function getProto(O) {\n\t\t\t\t// @ts-expect-error TS can't narrow inside a closure, for some reason\n\t\t\t\treturn getDunderProto(O);\n\t\t\t}\n\t\t\t: null;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi4vYmFja2VuZC9ub2RlX21vZHVsZXMvZ2V0LXByb3RvL2luZGV4LmpzIiwibWFwcGluZ3MiOiJBQUFhOztBQUViLHNCQUFzQixtQkFBTyxDQUFDLG1HQUEwQjtBQUN4RCx1QkFBdUIsbUJBQU8sQ0FBQyxpR0FBeUI7O0FBRXhELHFCQUFxQixtQkFBTyxDQUFDLDJFQUFrQjs7QUFFL0MsV0FBVyxhQUFhO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJDOlxcVXNlcnNcXEx1Y2t5IE1haGFsZVxcT25lRHJpdmVcXERlc2t0b3BcXHJzZ2NfYXBwXFxSU0dDXFxiYWNrZW5kXFxub2RlX21vZHVsZXNcXGdldC1wcm90b1xcaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG52YXIgcmVmbGVjdEdldFByb3RvID0gcmVxdWlyZSgnLi9SZWZsZWN0LmdldFByb3RvdHlwZU9mJyk7XG52YXIgb3JpZ2luYWxHZXRQcm90byA9IHJlcXVpcmUoJy4vT2JqZWN0LmdldFByb3RvdHlwZU9mJyk7XG5cbnZhciBnZXREdW5kZXJQcm90byA9IHJlcXVpcmUoJ2R1bmRlci1wcm90by9nZXQnKTtcblxuLyoqIEB0eXBlIHtpbXBvcnQoJy4nKX0gKi9cbm1vZHVsZS5leHBvcnRzID0gcmVmbGVjdEdldFByb3RvXG5cdD8gZnVuY3Rpb24gZ2V0UHJvdG8oTykge1xuXHRcdC8vIEB0cy1leHBlY3QtZXJyb3IgVFMgY2FuJ3QgbmFycm93IGluc2lkZSBhIGNsb3N1cmUsIGZvciBzb21lIHJlYXNvblxuXHRcdHJldHVybiByZWZsZWN0R2V0UHJvdG8oTyk7XG5cdH1cblx0OiBvcmlnaW5hbEdldFByb3RvXG5cdFx0PyBmdW5jdGlvbiBnZXRQcm90byhPKSB7XG5cdFx0XHRpZiAoIU8gfHwgKHR5cGVvZiBPICE9PSAnb2JqZWN0JyAmJiB0eXBlb2YgTyAhPT0gJ2Z1bmN0aW9uJykpIHtcblx0XHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignZ2V0UHJvdG86IG5vdCBhbiBvYmplY3QnKTtcblx0XHRcdH1cblx0XHRcdC8vIEB0cy1leHBlY3QtZXJyb3IgVFMgY2FuJ3QgbmFycm93IGluc2lkZSBhIGNsb3N1cmUsIGZvciBzb21lIHJlYXNvblxuXHRcdFx0cmV0dXJuIG9yaWdpbmFsR2V0UHJvdG8oTyk7XG5cdFx0fVxuXHRcdDogZ2V0RHVuZGVyUHJvdG9cblx0XHRcdD8gZnVuY3Rpb24gZ2V0UHJvdG8oTykge1xuXHRcdFx0XHQvLyBAdHMtZXhwZWN0LWVycm9yIFRTIGNhbid0IG5hcnJvdyBpbnNpZGUgYSBjbG9zdXJlLCBmb3Igc29tZSByZWFzb25cblx0XHRcdFx0cmV0dXJuIGdldER1bmRlclByb3RvKE8pO1xuXHRcdFx0fVxuXHRcdFx0OiBudWxsO1xuIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6WzBdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/../backend/node_modules/get-proto/index.js\n");

/***/ }),

/***/ "(ssr)/./node_modules/get-proto/Object.getPrototypeOf.js":
/*!*********************************************************!*\
  !*** ./node_modules/get-proto/Object.getPrototypeOf.js ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("\n\nvar $Object = __webpack_require__(/*! es-object-atoms */ \"(ssr)/./node_modules/es-object-atoms/index.js\");\n\n/** @type {import('./Object.getPrototypeOf')} */\nmodule.exports = $Object.getPrototypeOf || null;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvZ2V0LXByb3RvL09iamVjdC5nZXRQcm90b3R5cGVPZi5qcyIsIm1hcHBpbmdzIjoiQUFBYTs7QUFFYixjQUFjLG1CQUFPLENBQUMsc0VBQWlCOztBQUV2QyxXQUFXLG1DQUFtQztBQUM5QyIsInNvdXJjZXMiOlsiQzpcXFVzZXJzXFxMdWNreSBNYWhhbGVcXE9uZURyaXZlXFxEZXNrdG9wXFxyc2djX2FwcFxcUlNHQ1xcZnJvbnRlbmRcXG5vZGVfbW9kdWxlc1xcZ2V0LXByb3RvXFxPYmplY3QuZ2V0UHJvdG90eXBlT2YuanMiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG52YXIgJE9iamVjdCA9IHJlcXVpcmUoJ2VzLW9iamVjdC1hdG9tcycpO1xuXG4vKiogQHR5cGUge2ltcG9ydCgnLi9PYmplY3QuZ2V0UHJvdG90eXBlT2YnKX0gKi9cbm1vZHVsZS5leHBvcnRzID0gJE9iamVjdC5nZXRQcm90b3R5cGVPZiB8fCBudWxsO1xuIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6WzBdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/get-proto/Object.getPrototypeOf.js\n");

/***/ }),

/***/ "(ssr)/./node_modules/get-proto/Reflect.getPrototypeOf.js":
/*!**********************************************************!*\
  !*** ./node_modules/get-proto/Reflect.getPrototypeOf.js ***!
  \**********************************************************/
/***/ ((module) => {

eval("\n\n/** @type {import('./Reflect.getPrototypeOf')} */\nmodule.exports = (typeof Reflect !== 'undefined' && Reflect.getPrototypeOf) || null;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvZ2V0LXByb3RvL1JlZmxlY3QuZ2V0UHJvdG90eXBlT2YuanMiLCJtYXBwaW5ncyI6IkFBQWE7O0FBRWIsV0FBVyxvQ0FBb0M7QUFDL0MiLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcTHVja3kgTWFoYWxlXFxPbmVEcml2ZVxcRGVza3RvcFxccnNnY19hcHBcXFJTR0NcXGZyb250ZW5kXFxub2RlX21vZHVsZXNcXGdldC1wcm90b1xcUmVmbGVjdC5nZXRQcm90b3R5cGVPZi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbi8qKiBAdHlwZSB7aW1wb3J0KCcuL1JlZmxlY3QuZ2V0UHJvdG90eXBlT2YnKX0gKi9cbm1vZHVsZS5leHBvcnRzID0gKHR5cGVvZiBSZWZsZWN0ICE9PSAndW5kZWZpbmVkJyAmJiBSZWZsZWN0LmdldFByb3RvdHlwZU9mKSB8fCBudWxsO1xuIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6WzBdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/get-proto/Reflect.getPrototypeOf.js\n");

/***/ }),

/***/ "(ssr)/./node_modules/get-proto/index.js":
/*!*****************************************!*\
  !*** ./node_modules/get-proto/index.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("\n\nvar reflectGetProto = __webpack_require__(/*! ./Reflect.getPrototypeOf */ \"(ssr)/./node_modules/get-proto/Reflect.getPrototypeOf.js\");\nvar originalGetProto = __webpack_require__(/*! ./Object.getPrototypeOf */ \"(ssr)/./node_modules/get-proto/Object.getPrototypeOf.js\");\n\nvar getDunderProto = __webpack_require__(/*! dunder-proto/get */ \"(ssr)/./node_modules/dunder-proto/get.js\");\n\n/** @type {import('.')} */\nmodule.exports = reflectGetProto\n\t? function getProto(O) {\n\t\t// @ts-expect-error TS can't narrow inside a closure, for some reason\n\t\treturn reflectGetProto(O);\n\t}\n\t: originalGetProto\n\t\t? function getProto(O) {\n\t\t\tif (!O || (typeof O !== 'object' && typeof O !== 'function')) {\n\t\t\t\tthrow new TypeError('getProto: not an object');\n\t\t\t}\n\t\t\t// @ts-expect-error TS can't narrow inside a closure, for some reason\n\t\t\treturn originalGetProto(O);\n\t\t}\n\t\t: getDunderProto\n\t\t\t? function getProto(O) {\n\t\t\t\t// @ts-expect-error TS can't narrow inside a closure, for some reason\n\t\t\t\treturn getDunderProto(O);\n\t\t\t}\n\t\t\t: null;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvZ2V0LXByb3RvL2luZGV4LmpzIiwibWFwcGluZ3MiOiJBQUFhOztBQUViLHNCQUFzQixtQkFBTyxDQUFDLDBGQUEwQjtBQUN4RCx1QkFBdUIsbUJBQU8sQ0FBQyx3RkFBeUI7O0FBRXhELHFCQUFxQixtQkFBTyxDQUFDLGtFQUFrQjs7QUFFL0MsV0FBVyxhQUFhO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJDOlxcVXNlcnNcXEx1Y2t5IE1haGFsZVxcT25lRHJpdmVcXERlc2t0b3BcXHJzZ2NfYXBwXFxSU0dDXFxmcm9udGVuZFxcbm9kZV9tb2R1bGVzXFxnZXQtcHJvdG9cXGluZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxudmFyIHJlZmxlY3RHZXRQcm90byA9IHJlcXVpcmUoJy4vUmVmbGVjdC5nZXRQcm90b3R5cGVPZicpO1xudmFyIG9yaWdpbmFsR2V0UHJvdG8gPSByZXF1aXJlKCcuL09iamVjdC5nZXRQcm90b3R5cGVPZicpO1xuXG52YXIgZ2V0RHVuZGVyUHJvdG8gPSByZXF1aXJlKCdkdW5kZXItcHJvdG8vZ2V0Jyk7XG5cbi8qKiBAdHlwZSB7aW1wb3J0KCcuJyl9ICovXG5tb2R1bGUuZXhwb3J0cyA9IHJlZmxlY3RHZXRQcm90b1xuXHQ/IGZ1bmN0aW9uIGdldFByb3RvKE8pIHtcblx0XHQvLyBAdHMtZXhwZWN0LWVycm9yIFRTIGNhbid0IG5hcnJvdyBpbnNpZGUgYSBjbG9zdXJlLCBmb3Igc29tZSByZWFzb25cblx0XHRyZXR1cm4gcmVmbGVjdEdldFByb3RvKE8pO1xuXHR9XG5cdDogb3JpZ2luYWxHZXRQcm90b1xuXHRcdD8gZnVuY3Rpb24gZ2V0UHJvdG8oTykge1xuXHRcdFx0aWYgKCFPIHx8ICh0eXBlb2YgTyAhPT0gJ29iamVjdCcgJiYgdHlwZW9mIE8gIT09ICdmdW5jdGlvbicpKSB7XG5cdFx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ2dldFByb3RvOiBub3QgYW4gb2JqZWN0Jyk7XG5cdFx0XHR9XG5cdFx0XHQvLyBAdHMtZXhwZWN0LWVycm9yIFRTIGNhbid0IG5hcnJvdyBpbnNpZGUgYSBjbG9zdXJlLCBmb3Igc29tZSByZWFzb25cblx0XHRcdHJldHVybiBvcmlnaW5hbEdldFByb3RvKE8pO1xuXHRcdH1cblx0XHQ6IGdldER1bmRlclByb3RvXG5cdFx0XHQ/IGZ1bmN0aW9uIGdldFByb3RvKE8pIHtcblx0XHRcdFx0Ly8gQHRzLWV4cGVjdC1lcnJvciBUUyBjYW4ndCBuYXJyb3cgaW5zaWRlIGEgY2xvc3VyZSwgZm9yIHNvbWUgcmVhc29uXG5cdFx0XHRcdHJldHVybiBnZXREdW5kZXJQcm90byhPKTtcblx0XHRcdH1cblx0XHRcdDogbnVsbDtcbiJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOlswXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/get-proto/index.js\n");

/***/ })

};
;