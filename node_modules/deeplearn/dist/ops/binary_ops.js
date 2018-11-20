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
var broadcast_util = require("./broadcast_util");
var operation_1 = require("./operation");
var ops_1 = require("./ops");
var Ops = (function () {
    function Ops() {
    }
    Ops.add = function (a, b) {
        util.assertTypesMatch(a, b);
        var outShape = broadcast_util.assertAndGetBroadcastShape(a.shape, b.shape);
        var der = function (dy, y) {
            var derA = function () {
                var res = dy;
                var reduceAxes = broadcast_util.getReductionAxes(a.shape, outShape);
                if (reduceAxes.length > 0) {
                    res = res.sum(reduceAxes);
                }
                return res.reshape(a.shape);
            };
            var derB = function () {
                var res = dy;
                var reduceAxes = broadcast_util.getReductionAxes(b.shape, outShape);
                if (reduceAxes.length > 0) {
                    res = res.sum(reduceAxes);
                }
                return res.reshape(b.shape);
            };
            return { a: derA, b: derB };
        };
        return environment_1.ENV.engine.executeKernel('Add', { inputs: { a: a, b: b } }, der);
    };
    Ops.addStrict = function (a, b) {
        util.assertShapesMatch(a.shape, b.shape, 'Error in addStrict: ');
        return a.add(b);
    };
    Ops.sub = function (a, b) {
        util.assertTypesMatch(a, b);
        var outShape = broadcast_util.assertAndGetBroadcastShape(a.shape, b.shape);
        var der = function (dy, y) {
            var derA = function () {
                var res = dy;
                var reduceAxes = broadcast_util.getReductionAxes(a.shape, outShape);
                if (reduceAxes.length > 0) {
                    res = res.sum(reduceAxes);
                }
                return res.reshape(a.shape);
            };
            var derB = function () {
                var res = dy;
                var reduceAxes = broadcast_util.getReductionAxes(b.shape, outShape);
                if (reduceAxes.length > 0) {
                    res = res.sum(reduceAxes);
                }
                return res.neg().reshape(b.shape);
            };
            return { a: derA, b: derB };
        };
        return environment_1.ENV.engine.executeKernel('Sub', { inputs: { a: a, b: b } }, der);
    };
    Ops.subStrict = function (a, b) {
        util.assertShapesMatch(a.shape, b.shape, 'Error in subStrict: ');
        return a.sub(b);
    };
    Ops.pow = function (base, exp) {
        util.assert(exp.dtype === 'int32', 'only supports int32 data type for the exponent parameter.');
        broadcast_util.assertAndGetBroadcastShape(base.shape, exp.shape);
        var gradient = function (dy, y) {
            if (!util.arraysEqual(base.shape, exp.shape) &&
                !util.isScalarShape(exp.shape)) {
                throw new Error("Gradient of pow not yet supported for broadcasted shapes.");
            }
            var derBase = function () {
                var dx = exp.toFloat().mul(base.pow(exp.sub(ops_1.scalar(1, 'int32'))).toFloat());
                return dy.mul(dx);
            };
            var derExp = function () {
                throw new Error("Backprop through exponent not implemented yet.");
            };
            return { base: derBase, exp: derExp };
        };
        return environment_1.ENV.engine.executeKernel('Pow', { inputs: { base: base, exp: exp } }, gradient);
    };
    Ops.powStrict = function (base, exp) {
        util.assertShapesMatch(base.shape, exp.shape, 'Error in powStrict: ');
        return base.pow(exp);
    };
    Ops.mul = function (a, b) {
        util.assertTypesMatch(a, b);
        var outShape = broadcast_util.assertAndGetBroadcastShape(a.shape, b.shape);
        var der = function (dy, y) {
            var derA = function () {
                var res = dy.mul(b.toFloat());
                var reduceAxes = broadcast_util.getReductionAxes(a.shape, outShape);
                if (reduceAxes.length > 0) {
                    return res.sum(reduceAxes).reshape(a.shape);
                }
                return res;
            };
            var derB = function () {
                var res = dy.mul(a.toFloat());
                var reduceAxes = broadcast_util.getReductionAxes(b.shape, outShape);
                if (reduceAxes.length > 0) {
                    return res.sum(reduceAxes).reshape(b.shape);
                }
                return res;
            };
            return { a: derA, b: derB };
        };
        return environment_1.ENV.engine.executeKernel('Mul', { inputs: { a: a, b: b } }, der);
    };
    Ops.mulStrict = function (a, b) {
        util.assertShapesMatch(a.shape, b.shape, 'Error in multiplyStrict: ');
        return a.mul(b);
    };
    Ops.div = function (a, b) {
        var outShape = broadcast_util.assertAndGetBroadcastShape(a.shape, b.shape);
        var der = function (dy, y) {
            var derA = function () {
                var res = dy.div(b.toFloat());
                var reduceAxes = broadcast_util.getReductionAxes(a.shape, outShape);
                if (reduceAxes.length > 0) {
                    return res.sum(reduceAxes).reshape(a.shape);
                }
                return res;
            };
            var derB = function () {
                var res = dy.mul(a.toFloat());
                var reduceAxes = broadcast_util.getReductionAxes(b.shape, outShape);
                if (reduceAxes.length > 0) {
                    res = res.sum(reduceAxes).reshape(b.shape);
                }
                var tmp = b.square();
                return res.div(tmp.toFloat()).neg();
            };
            return { a: derA, b: derB };
        };
        return environment_1.ENV.engine.executeKernel('Div', { inputs: { a: a, b: b } }, der);
    };
    Ops.divStrict = function (a, b) {
        util.assertShapesMatch(a.shape, b.shape, 'Error in divideStrict: ');
        return a.div(b);
    };
    Ops.minimum = function (a, b) {
        util.assertTypesMatch(a, b);
        broadcast_util.assertAndGetBroadcastShape(a.shape, b.shape);
        var der = function (dy, y) {
            var derA = function () { return dy.mul(a.lessEqual(b).toFloat()); };
            var derB = function () { return dy.mul(a.greater(b).toFloat()); };
            return { a: derA, b: derB };
        };
        return environment_1.ENV.engine.executeKernel('Minimum', { inputs: { a: a, b: b } }, der);
    };
    Ops.minimumStrict = function (a, b) {
        util.assertShapesMatch(a.shape, b.shape, 'Error in minimumStrict: ');
        return a.minimum(b);
    };
    Ops.maximum = function (a, b) {
        util.assertTypesMatch(a, b);
        broadcast_util.assertAndGetBroadcastShape(a.shape, b.shape);
        var der = function (dy, y) {
            var derA = function () { return dy.mul(a.greaterEqual(b).toFloat()); };
            var derB = function () { return dy.mul(a.less(b).toFloat()); };
            return { a: derA, b: derB };
        };
        return environment_1.ENV.engine.executeKernel('Maximum', { inputs: { a: a, b: b } }, der);
    };
    Ops.maximumStrict = function (a, b) {
        util.assertShapesMatch(a.shape, b.shape, 'Error in minimumStrict: ');
        return a.maximum(b);
    };
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Arithmetic' }),
        operation_1.operation
    ], Ops, "add", null);
    __decorate([
        operation_1.operation
    ], Ops, "addStrict", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Arithmetic' }),
        operation_1.operation
    ], Ops, "sub", null);
    __decorate([
        operation_1.operation
    ], Ops, "subStrict", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Arithmetic' }),
        operation_1.operation
    ], Ops, "pow", null);
    __decorate([
        operation_1.operation
    ], Ops, "powStrict", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Arithmetic' }),
        operation_1.operation
    ], Ops, "mul", null);
    __decorate([
        operation_1.operation
    ], Ops, "mulStrict", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Arithmetic' }),
        operation_1.operation
    ], Ops, "div", null);
    __decorate([
        operation_1.operation
    ], Ops, "divStrict", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Arithmetic' }),
        operation_1.operation
    ], Ops, "minimum", null);
    __decorate([
        operation_1.operation
    ], Ops, "minimumStrict", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Arithmetic' }),
        operation_1.operation
    ], Ops, "maximum", null);
    __decorate([
        operation_1.operation
    ], Ops, "maximumStrict", null);
    return Ops;
}());
exports.Ops = Ops;
