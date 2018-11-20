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
var operation_1 = require("./operation");
var ops = require("./ops");
var ops_1 = require("./ops");
var selu_util = require("./selu_util");
var Ops = (function () {
    function Ops() {
    }
    Ops.neg = function (x) {
        return environment_1.ENV.engine.executeKernel('Neg', { inputs: { x: x } }, function (dy, y) {
            return { x: function () { return dy.neg(); } };
        });
    };
    Ops.ceil = function (x) {
        var gradient = function (dy, y) {
            return { x: function () { return ops.zeros(y.shape); } };
        };
        return environment_1.ENV.engine.executeKernel('Ceil', { inputs: { x: x } }, gradient);
    };
    Ops.floor = function (x) {
        var gradient = function (dy, y) {
            return { x: function () { return ops.zeros(y.shape); } };
        };
        return environment_1.ENV.engine.executeKernel('Floor', { inputs: { x: x } }, gradient);
    };
    Ops.exp = function (x) {
        return environment_1.ENV.engine.executeKernel('Exp', { inputs: { x: x } }, function (dy, y) {
            return { x: function () { return dy.mul(y); } };
        });
    };
    Ops.log = function (x) {
        return environment_1.ENV.engine.executeKernel('Log', { inputs: { x: x } }, function (dy, y) {
            return { x: function () { return dy.div(x.toFloat()); } };
        });
    };
    Ops.sqrt = function (x) {
        return environment_1.ENV.engine.executeKernel('Sqrt', { inputs: { x: x } }, function (dy, y) {
            return { x: function () { return dy.div(x.toFloat().sqrt().mul(ops.scalar(2))); } };
        });
    };
    Ops.square = function (x) {
        return environment_1.ENV.engine.executeKernel('Square', { inputs: { x: x } }, function (dy, y) {
            return { x: function () { return dy.mul(x.toFloat().mul(ops.scalar(2))); } };
        });
    };
    Ops.abs = function (x) {
        return environment_1.ENV.engine.executeKernel('Abs', { inputs: { x: x } }, function (dy, y) {
            return { x: function () { return dy.mul(x.toFloat().step(-1)); } };
        });
    };
    Ops.clipByValue = function (x, clipValueMin, clipValueMax) {
        util.assert((clipValueMin <= clipValueMax), "Error in clip: min (" + clipValueMin + ") must be" +
            ("less than or equal to max (" + clipValueMax + ")."));
        return environment_1.ENV.engine.executeKernel('Clip', { inputs: { x: x }, args: { min: clipValueMin, max: clipValueMax } }, function (dy, y) {
            return {
                x: function () { return dy.where(x.greater(ops.scalar(clipValueMin))
                    .logicalAnd(x.less(ops.scalar(clipValueMax))), ops_1.zerosLike(dy)); },
            };
        });
    };
    Ops.relu = function (x) {
        return environment_1.ENV.engine.executeKernel('Relu', { inputs: { x: x } }, function (dy, y) {
            var stepRes = x.step();
            return { x: function () { return dy.mul(stepRes.toFloat()); } };
        });
    };
    Ops.elu = function (x) {
        var der = function (dy) {
            return {
                x: function () { return dy.mul(eluDer(x)); },
                alpha: function () {
                    throw new Error('Derivative of prelu with respect to alpha is ' +
                        'not implemented yet');
                }
            };
        };
        return environment_1.ENV.engine.executeKernel('Elu', { inputs: { x: x } }, der);
    };
    Ops.selu = function (x) {
        var gradient = function (dy, y) {
            return {
                x: function () {
                    var mask = x.greater(ops.scalar(0));
                    var scaleAlpha = ops.scalar(selu_util.SELU_SCALEALPHA);
                    var scale = ops.scalar(selu_util.SELU_SCALE);
                    var greaterThanZeroDer = dy.mul(scale);
                    var lessEqualZeroDer = dy.mul(scaleAlpha).mul(x.toFloat().exp());
                    var res = ops.where(mask, greaterThanZeroDer, lessEqualZeroDer);
                    return res;
                }
            };
        };
        return environment_1.ENV.engine.executeKernel('Selu', { inputs: { x: x } }, gradient);
    };
    Ops.leakyRelu = function (x, alpha) {
        if (alpha === void 0) { alpha = 0.2; }
        var gradient = function (dy, y) {
            return { x: function () { return dy.mul(x.step(alpha)); } };
        };
        return environment_1.ENV.engine.executeKernel('LeakyRelu', { inputs: { x: x }, args: { alpha: alpha } }, gradient);
    };
    Ops.prelu = function (x, alpha) {
        var der = function (dy) {
            return {
                x: function () { return dy.mul(preluDer(x, alpha)); },
                alpha: function () {
                    throw new Error('Derivative of prelu with respect to alpha is ' +
                        'not implemented yet');
                }
            };
        };
        return environment_1.ENV.engine.executeKernel('PReLU', { inputs: { x: x, alpha: alpha } }, der);
    };
    Ops.sigmoid = function (x) {
        return environment_1.ENV.engine.executeKernel('Sigmoid', { inputs: { x: x } }, function (dy, y) {
            return { x: function () { return dy.mul(y.mul(ops.scalar(1).sub(y))); } };
        });
    };
    Ops.sin = function (x) {
        return environment_1.ENV.engine.executeKernel('Sin', { inputs: { x: x } }, function (dy, y) {
            return { x: function () { return x.toFloat().cos().mul(dy); } };
        });
    };
    Ops.cos = function (x) {
        return environment_1.ENV.engine.executeKernel('Cos', { inputs: { x: x } }, function (dy, y) {
            return { x: function () { return x.toFloat().sin().neg().mul(dy); } };
        });
    };
    Ops.tan = function (x) {
        return environment_1.ENV.engine.executeKernel('Tan', { inputs: { x: x } }, function (dy, y) {
            return { x: function () { return dy.div(x.cos().square()); } };
        });
    };
    Ops.asin = function (x) {
        return environment_1.ENV.engine.executeKernel('Asin', { inputs: { x: x } }, function (dy, y) {
            return {
                x: function () { return dy.div(Ops.sqrt(ops.scalar(1).sub(x.toFloat().square()))); }
            };
        });
    };
    Ops.acos = function (x) {
        return environment_1.ENV.engine.executeKernel('Acos', { inputs: { x: x } }, function (dy, y) {
            return {
                x: function () { return dy.div(Ops.sqrt(ops.scalar(1).sub(x.toFloat().square()))).neg(); }
            };
        });
    };
    Ops.atan = function (x) {
        return environment_1.ENV.engine.executeKernel('Atan', { inputs: { x: x } }, function (dy, y) {
            return { x: function () { return dy.div(ops.scalar(1).add(x.toFloat().square())); } };
        });
    };
    Ops.sinh = function (x) {
        return environment_1.ENV.engine.executeKernel('Sinh', { inputs: { x: x } }, function (dy, y) {
            return { x: function () { return x.toFloat().cosh().mul(dy); } };
        });
    };
    Ops.cosh = function (x) {
        return environment_1.ENV.engine.executeKernel('Cosh', { inputs: { x: x } }, function (dy, y) {
            return { x: function () { return x.toFloat().sinh().mul(dy); } };
        });
    };
    Ops.tanh = function (x) {
        return environment_1.ENV.engine.executeKernel('Tanh', { inputs: { x: x } }, function (dy, y) {
            return { x: function () { return ops.scalar(1).sub(y.square()).mul(dy); } };
        });
    };
    Ops.step = function (x, alpha) {
        if (alpha === void 0) { alpha = 0.0; }
        return environment_1.ENV.engine.executeKernel('Step', { inputs: { x: x }, args: { alpha: alpha } }, function (dy, y) {
            return { x: function () { return ops.zeros(y.shape); } };
        });
    };
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation_1.operation
    ], Ops, "neg", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation_1.operation
    ], Ops, "ceil", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation_1.operation
    ], Ops, "floor", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation_1.operation
    ], Ops, "exp", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation_1.operation
    ], Ops, "log", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation_1.operation
    ], Ops, "sqrt", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation_1.operation
    ], Ops, "square", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation_1.operation
    ], Ops, "abs", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation_1.operation
    ], Ops, "clipByValue", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation_1.operation
    ], Ops, "relu", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation_1.operation
    ], Ops, "elu", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation_1.operation
    ], Ops, "selu", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation_1.operation
    ], Ops, "leakyRelu", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation_1.operation
    ], Ops, "prelu", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation_1.operation
    ], Ops, "sigmoid", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation_1.operation
    ], Ops, "sin", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation_1.operation
    ], Ops, "cos", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation_1.operation
    ], Ops, "tan", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation_1.operation
    ], Ops, "asin", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation_1.operation
    ], Ops, "acos", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation_1.operation
    ], Ops, "atan", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation_1.operation
    ], Ops, "sinh", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation_1.operation
    ], Ops, "cosh", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation_1.operation
    ], Ops, "tanh", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation_1.operation
    ], Ops, "step", null);
    return Ops;
}());
exports.Ops = Ops;
function preluDer(x, alpha) {
    return environment_1.ENV.engine.executeKernel('PReLUDer', { inputs: { x: x, alpha: alpha } });
}
function eluDer(x) {
    return environment_1.ENV.engine.executeKernel('EluDer', { inputs: { x: x } });
}
