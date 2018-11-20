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
var operation_1 = require("./operation");
var slice_util = require("./slice_util");
var Ops = (function () {
    function Ops() {
    }
    Ops.slice1d = function (x, begin, size) {
        slice_util.assertParamsValid(x, [begin], [size]);
        return environment_1.ENV.engine.executeKernel('Slice1D', { inputs: { x: x }, args: { begin: begin, size: size } });
    };
    Ops.slice2d = function (x, begin, size) {
        slice_util.assertParamsValid(x, begin, size);
        return environment_1.ENV.engine.executeKernel('Slice2D', { inputs: { x: x }, args: { begin: begin, size: size } });
    };
    Ops.slice3d = function (x, begin, size) {
        slice_util.assertParamsValid(x, begin, size);
        return environment_1.ENV.engine.executeKernel('Slice3D', { inputs: { x: x }, args: { begin: begin, size: size } });
    };
    Ops.slice4d = function (x, begin, size) {
        slice_util.assertParamsValid(x, begin, size);
        return environment_1.ENV.engine.executeKernel('Slice4D', { inputs: { x: x }, args: { begin: begin, size: size } });
    };
    Ops.slice = function (x, begin, size) {
        if (x.rank === 0) {
            throw new Error('Slicing scalar is not possible');
        }
        else if (x.rank === 1) {
            return Ops.slice1d(x, begin[0], size[0]);
        }
        else if (x.rank === 2) {
            return Ops.slice2d(x, begin, size);
        }
        else if (x.rank === 3) {
            return Ops.slice3d(x, begin, size);
        }
        else if (x.rank === 4) {
            return Ops.slice4d(x, begin, size);
        }
        else {
            throw new Error("Slicing for rank " + x.rank + " not implemented yet");
        }
    };
    __decorate([
        operation_1.operation
    ], Ops, "slice1d", null);
    __decorate([
        operation_1.operation
    ], Ops, "slice2d", null);
    __decorate([
        operation_1.operation
    ], Ops, "slice3d", null);
    __decorate([
        operation_1.operation
    ], Ops, "slice4d", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Slicing and Joining' }),
        operation_1.operation
    ], Ops, "slice", null);
    return Ops;
}());
exports.Ops = Ops;
