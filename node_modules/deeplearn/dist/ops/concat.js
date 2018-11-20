"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var doc_1 = require("../doc");
var environment_1 = require("../environment");
var util = require("../util");
var concat_util = require("./concat_util");
var operation_1 = require("./operation");
var Concat = (function () {
    function Concat() {
    }
    Concat.concat1d = function (tensors) {
        return Concat.concat(tensors, 0);
    };
    Concat.concat2d = function (tensors, axis) {
        return Concat.concat(tensors, axis);
    };
    Concat.concat3d = function (tensors, axis) {
        return Concat.concat(tensors, axis);
    };
    Concat.concat4d = function (tensors, axis) {
        return Concat.concat(tensors, axis);
    };
    Concat.concat = function (tensors, axis) {
        if (axis === void 0) { axis = 0; }
        util.assert(tensors.length >= 2, 'Pass at least two tensors to concat');
        var result = tensors[0];
        for (var i = 1; i < tensors.length; ++i) {
            result = concat2Tensors(result, tensors[i], axis);
        }
        return result;
    };
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Slicing and Joining' }),
        operation_1.operation
    ], Concat, "concat", null);
    return Concat;
}());
exports.Concat = Concat;
function concat2Tensors(a, b, axis) {
    concat_util.assertParams(a.shape, b.shape, axis);
    var outShape = concat_util.computeOutShape(a.shape, b.shape, axis);
    var a2D = a.as2D(-1, util.sizeFromShape(a.shape.slice(axis)));
    var b2D = b.as2D(-1, util.sizeFromShape(b.shape.slice(axis)));
    var _a = concat_util.computeGradientSliceShapes(a2D.shape, b2D.shape), aBegin = _a.aBegin, aSize = _a.aSize, bBegin = _a.bBegin, bSize = _a.bSize;
    var der = function (dy) {
        return { a: function () { return dy.slice(aBegin, aSize); }, b: function () { return dy.slice(bBegin, bSize); } };
    };
    var res = environment_1.ENV.engine.executeKernel('Concat', { inputs: { a: a2D, b: b2D } }, der);
    return res.reshape(outShape);
}
