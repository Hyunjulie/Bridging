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
var axis_util = require("./axis_util");
var operation_1 = require("./operation");
var Ops = (function () {
    function Ops() {
    }
    Ops.reverse1d = function (x) {
        util.assert(x.rank === 1, "Error in reverse1D: x must be rank 1 but got\n             rank " + x.rank + ".");
        return Ops.reverse(x, 0);
    };
    Ops.reverse2d = function (x, axis) {
        util.assert(x.rank === 2, "Error in reverse2D: x must be rank 2 but got\n             rank " + x.rank + ".");
        return Ops.reverse(x, axis);
    };
    Ops.reverse3d = function (x, axis) {
        util.assert(x.rank === 3, "Error in reverse3D: x must be rank 3 but got\n             rank " + x.rank + ".");
        return Ops.reverse(x, axis);
    };
    Ops.reverse4d = function (x, axis) {
        util.assert(x.rank === 4, "Error in reverse4D: x must be rank 4 but got\n             rank " + x.rank + ".");
        return Ops.reverse(x, axis);
    };
    Ops.reverse = function (x, axis) {
        var x4d;
        var axisCleaned = axis_util.parseAxisParam(axis, x.shape).map(function (a) { return a + 4 - x.rank; });
        if (x.rank === 0) {
            return x.clone();
        }
        else if (x.rank === 1) {
            x4d = x.as4D(1, 1, 1, x.shape[0]);
        }
        else if (x.rank === 2) {
            x4d = x.as4D(1, 1, x.shape[0], x.shape[1]);
        }
        else if (x.rank === 3) {
            x4d = x.as4D(1, x.shape[0], x.shape[1], x.shape[2]);
        }
        else if (x.rank === 4) {
            x4d = x;
        }
        else {
            throw new Error("Reverse for rank " + x.rank + " is not yet implemented");
        }
        var res = environment_1.ENV.engine.executeKernel('Reverse4D', { inputs: { x: x4d }, args: { axis: axisCleaned } });
        return res.reshapeAs(x);
    };
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Slicing and Joining' }),
        operation_1.operation
    ], Ops, "reverse", null);
    return Ops;
}());
exports.Ops = Ops;
