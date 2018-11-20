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
var types = require("../types");
var util = require("../util");
var broadcast_util = require("./broadcast_util");
var operation_1 = require("./operation");
var Ops = (function () {
    function Ops() {
    }
    Ops.logicalNot = function (x) {
        util.assert(x.dtype === 'bool', 'Error Array must be of type bool.');
        return environment_1.ENV.engine.executeKernel('LogicalNot', { inputs: { x: x } });
    };
    Ops.logicalAnd = function (a, b) {
        util.assert(a.dtype === 'bool' && b.dtype === 'bool', 'Error Array must be of type bool.');
        broadcast_util.assertAndGetBroadcastShape(a.shape, b.shape);
        return environment_1.ENV.engine.executeKernel('LogicalAnd', { inputs: { a: a, b: b } });
    };
    Ops.logicalOr = function (a, b) {
        util.assert(a.dtype === 'bool' && b.dtype === 'bool', 'Error Array must be of type bool.');
        broadcast_util.assertAndGetBroadcastShape(a.shape, b.shape);
        return environment_1.ENV.engine.executeKernel('LogicalOr', { inputs: { a: a, b: b } });
    };
    Ops.logicalXor = function (a, b) {
        util.assert(a.dtype === 'bool' && b.dtype === 'bool', 'Error Array must be of type bool.');
        broadcast_util.assertAndGetBroadcastShape(a.shape, b.shape);
        return environment_1.ENV.engine.executeKernel('LogicalXor', { inputs: { a: a, b: b } });
    };
    Ops.where = function (condition, a, b) {
        util.assert(condition.dtype === 'bool' || a.dtype === 'bool' || b.dtype === 'bool', 'Error Array must be of type bool.');
        util.assertShapesMatch(a.shape, b.shape, 'Error in where: ');
        if (condition.rank === 1) {
            util.assert(condition.shape[0] === a.shape[0], 'The first dimension of `a` must match the size of `condition`.');
        }
        else {
            util.assertShapesMatch(condition.shape, b.shape, 'Error in where: ');
        }
        var dtype = types.upcastType(a.dtype, b.dtype);
        return environment_1.ENV.engine.executeKernel('Where', { inputs: { condition: condition, a: a, b: b }, args: { dtype: dtype } });
    };
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Logical' }),
        operation_1.operation
    ], Ops, "logicalNot", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Logical' }),
        operation_1.operation
    ], Ops, "logicalAnd", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Logical' }),
        operation_1.operation
    ], Ops, "logicalOr", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Logical' }),
        operation_1.operation
    ], Ops, "logicalXor", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Logical' }),
        operation_1.operation
    ], Ops, "where", null);
    return Ops;
}());
exports.Ops = Ops;
