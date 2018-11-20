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
var tensor_1 = require("../tensor");
var util = require("../util");
var concat_1 = require("./concat");
var operation_1 = require("./operation");
var rand_1 = require("./rand");
var Ops = (function () {
    function Ops() {
    }
    Ops.tensor = function (values, shape, dtype) {
        if (dtype === void 0) { dtype = 'float32'; }
        var inferredShape = util.inferShape(values);
        if (shape != null && inferredShape.length !== 1) {
            util.assertShapesMatch(shape, inferredShape, "Error creating a new Tensor. " +
                ("Inferred shape (" + inferredShape + ") does not match the ") +
                ("provided shape (" + shape + "). "));
        }
        if (!util.isTypedArray(values) && !Array.isArray(values)) {
            values = [values];
        }
        shape = shape || inferredShape;
        return tensor_1.Tensor.make(shape, { values: toTypedArray(values, dtype) }, dtype);
    };
    Ops.scalar = function (value, dtype) {
        if (dtype === void 0) { dtype = 'float32'; }
        if (util.isTypedArray(value) || Array.isArray(value)) {
            throw new Error('Error creating a new Scalar: value must be a primitive ' +
                '(number|boolean)');
        }
        return Ops.tensor(value, [], dtype);
    };
    Ops.tensor1d = function (values, dtype) {
        if (dtype === void 0) { dtype = 'float32'; }
        var inferredShape = util.inferShape(values);
        if (inferredShape.length !== 1) {
            throw new Error('Error creating a new Tensor1D: values must be a flat/TypedArray');
        }
        return Ops.tensor(values, inferredShape, dtype);
    };
    Ops.tensor2d = function (values, shape, dtype) {
        if (dtype === void 0) { dtype = 'float32'; }
        var inferredShape = util.inferShape(values);
        if (inferredShape.length !== 2 && inferredShape.length !== 1) {
            throw new Error('Error creating a new Tensor2D: values must be number[][] ' +
                'or flat/TypedArray');
        }
        shape = shape || inferredShape;
        return Ops.tensor(values, shape, dtype);
    };
    Ops.tensor3d = function (values, shape, dtype) {
        if (dtype === void 0) { dtype = 'float32'; }
        var inferredShape = util.inferShape(values);
        if (inferredShape.length !== 3 && inferredShape.length !== 1) {
            throw new Error('Error creating a new Tensor3D: values must be number[][][]' +
                'or flat/TypedArray');
        }
        shape = shape || inferredShape;
        return Ops.tensor(values, shape, dtype);
    };
    Ops.tensor4d = function (values, shape, dtype) {
        if (dtype === void 0) { dtype = 'float32'; }
        var inferredShape = util.inferShape(values);
        if (inferredShape.length !== 4 && inferredShape.length !== 1) {
            throw new Error('Error creating a new Tensor4D: values must be number[][][][]' +
                'or flat/TypedArray');
        }
        shape = shape || inferredShape;
        return Ops.tensor(values, shape, dtype);
    };
    Ops.ones = function (shape, dtype) {
        if (dtype === void 0) { dtype = 'float32'; }
        var values = makeOnesTypedArray(util.sizeFromShape(shape), dtype);
        return tensor_1.Tensor.make(shape, { values: values }, dtype);
    };
    Ops.zeros = function (shape, dtype) {
        if (dtype === void 0) { dtype = 'float32'; }
        var values = makeZerosTypedArray(util.sizeFromShape(shape), dtype);
        return tensor_1.Tensor.make(shape, { values: values }, dtype);
    };
    Ops.fill = function (shape, value, dtype) {
        if (dtype === void 0) { dtype = 'float32'; }
        var values = util.getTypedArrayFromDType(dtype, util.sizeFromShape(shape));
        values.fill(value);
        return tensor_1.Tensor.make(shape, { values: values }, dtype);
    };
    Ops.onesLike = function (x) {
        return Ops.ones(x.shape, x.dtype);
    };
    Ops.zerosLike = function (x) {
        return Ops.zeros(x.shape, x.dtype);
    };
    Ops.clone = function (x) {
        return tensor_1.Tensor.make(x.shape, { dataId: x.dataId }, x.dtype);
    };
    Ops.randomNormal = function (shape, mean, stdDev, dtype, seed) {
        if (mean === void 0) { mean = 0; }
        if (stdDev === void 0) { stdDev = 1; }
        if (dtype != null && dtype === 'bool') {
            throw new Error("Unsupported data type " + dtype);
        }
        var randGauss = new rand_1.MPRandGauss(mean, stdDev, dtype, false, seed);
        return tensor_1.Tensor.rand(shape, function () { return randGauss.nextValue(); }, dtype);
    };
    Ops.truncatedNormal = function (shape, mean, stdDev, dtype, seed) {
        if (mean === void 0) { mean = 0; }
        if (stdDev === void 0) { stdDev = 1; }
        if (dtype != null && dtype === 'bool') {
            throw new Error("Unsupported data type " + dtype);
        }
        var randGauss = new rand_1.MPRandGauss(mean, stdDev, dtype, true, seed);
        return tensor_1.Tensor.rand(shape, function () { return randGauss.nextValue(); }, dtype);
    };
    Ops.randomUniform = function (shape, minval, maxval, dtype) {
        if (minval === void 0) { minval = 0; }
        if (maxval === void 0) { maxval = 1; }
        if (dtype === void 0) { dtype = 'float32'; }
        return tensor_1.Tensor.rand(shape, function () { return util.randUniform(minval, maxval); }, dtype);
    };
    Ops.rand = function (shape, randFunction, dtype) {
        var size = util.sizeFromShape(shape);
        var values = null;
        if (dtype == null || dtype === 'float32') {
            values = new Float32Array(size);
        }
        else if (dtype === 'int32') {
            values = new Int32Array(size);
        }
        else if (dtype === 'bool') {
            values = new Uint8Array(size);
        }
        else {
            throw new Error("Unknown data type " + dtype);
        }
        for (var i = 0; i < size; i++) {
            values[i] = randFunction();
        }
        return tensor_1.Tensor.make(shape, { values: values }, dtype);
    };
    Ops.multinomial = function (probabilities, numSamples, seed) {
        var numOutcomes = probabilities.size;
        if (numOutcomes < 2) {
            throw new Error("Error in multinomial: you need at least 2 outcomes, but got " +
                (numOutcomes + "."));
        }
        if (probabilities.rank > 2) {
            throw new Error("Rank of probabilities must be 1 or 2, but is " + probabilities.rank);
        }
        seed = seed || Math.random();
        var origRank = probabilities.rank;
        if (probabilities.rank === 1) {
            probabilities = probabilities.as2D(1, -1);
        }
        var res = environment_1.ENV.engine.executeKernel('Multinomial', {
            inputs: { probs: probabilities },
            args: { numSamples: numSamples, seed: seed }
        });
        if (origRank === 1) {
            return res.as1D();
        }
        return res;
    };
    Ops.oneHot = function (indices, depth, onValue, offValue) {
        if (onValue === void 0) { onValue = 1; }
        if (offValue === void 0) { offValue = 0; }
        if (depth < 2) {
            throw new Error("Error in oneHot: depth must be >=2, but it is " + depth);
        }
        return environment_1.ENV.engine.executeKernel('OneHot', { inputs: { indices: indices }, args: { depth: depth, onValue: onValue, offValue: offValue } });
    };
    Ops.fromPixels = function (pixels, numChannels) {
        if (numChannels === void 0) { numChannels = 3; }
        if (numChannels > 4) {
            throw new Error('Cannot construct Tensor with more than 4 channels from pixels.');
        }
        return environment_1.ENV.engine.fromPixels(pixels, numChannels);
    };
    Ops.reshape = function (x, shape) {
        shape = util.inferFromImplicitShape(shape, x.size);
        util.assert(x.size === util.sizeFromShape(shape), 'new shape and old shape must have the same number of elements.');
        var grad = function (dy, y) {
            return { x: function () { return dy.reshape(x.shape); } };
        };
        return environment_1.ENV.engine.executeKernel('Reshape', { inputs: { x: x }, args: { newShape: shape } }, grad);
    };
    Ops.squeeze = function (x, axis) {
        return Ops.reshape(x, util.squeezeShape(x.shape, axis).newShape);
    };
    Ops.cast = function (x, dtype) {
        var grad = function (dy, y) {
            return { x: function () { return dy.reshape(dy.shape); } };
        };
        return environment_1.ENV.engine.executeKernel('Cast', { inputs: { x: x }, args: { newDType: dtype } }, grad);
    };
    Ops.tile = function (x, reps) {
        util.assert(x.rank === reps.length, "Error in transpose: rank of input " + x.rank + " " +
            ("must match length of reps " + reps + "."));
        return environment_1.ENV.engine.executeKernel('Tile', { inputs: { x: x }, args: { reps: reps } });
    };
    Ops.gather = function (x, indices, axis) {
        if (axis === void 0) { axis = 0; }
        return environment_1.ENV.engine.executeKernel('Gather', { inputs: { x: x, indices: indices }, args: { axis: axis } });
    };
    Ops.pad1d = function (x, paddings, constantValue) {
        if (constantValue === void 0) { constantValue = 0; }
        util.assert(paddings.length === 2, 'Invalid number of paddings. Must be length of 2.');
        return environment_1.ENV.engine.executeKernel('Pad1D', { inputs: { x: x }, args: { paddings: paddings, constantValue: constantValue } });
    };
    Ops.pad2d = function (x, paddings, constantValue) {
        if (constantValue === void 0) { constantValue = 0; }
        util.assert(paddings.length === 2 && paddings[0].length === 2 &&
            paddings[1].length === 2, 'Invalid number of paddings. Must be length of 2 each.');
        return environment_1.ENV.engine.executeKernel('Pad2D', { inputs: { x: x }, args: { paddings: paddings, constantValue: constantValue } });
    };
    Ops.pad = function (x, paddings, constantValue) {
        if (constantValue === void 0) { constantValue = 0; }
        if (x.rank === 0) {
            throw new Error('pad(scalar) is not defined. Pass non-scalar to pad');
        }
        else if (x.rank === 1) {
            return Ops.pad1d(x, paddings[0], constantValue);
        }
        else if (x.rank === 2) {
            return Ops.pad2d(x, paddings, constantValue);
        }
        else {
            throw new Error("pad of rank-" + x.rank + " tensor is not yet supported");
        }
    };
    Ops.stack = function (tensors, axis) {
        if (axis === void 0) { axis = 0; }
        util.assert(tensors.length >= 2, 'Pass at least two tensors to dl.stack');
        var rank = tensors[0].rank;
        var shape = tensors[0].shape;
        var dtype = tensors[0].dtype;
        util.assert(axis <= rank, 'Axis must be <= rank of the tensor');
        tensors.forEach(function (t) {
            util.assertShapesMatch(shape, t.shape, 'All tensors passed to stack must have matching shapes');
        });
        tensors.forEach(function (t) {
            util.assert(dtype === t.dtype, 'All tensors passed to stack must have matching dtypes');
        });
        var expandedTensors = tensors.map(function (t) { return t.expandDims(axis); });
        return concat_1.Concat.concat(expandedTensors, axis);
    };
    Ops.expandDims = function (x, axis) {
        if (axis === void 0) { axis = 0; }
        util.assert(axis <= x.rank, 'Axis must be <= rank of the tensor');
        var newShape = x.shape.slice();
        newShape.splice(axis, 0, 1);
        return Ops.reshape(x, newShape);
    };
    Ops.linspace = function (start, stop, num) {
        if (num === 0) {
            throw new Error('Cannot request zero samples');
        }
        var step = (stop - start) / (num - 1);
        var values = makeZerosTypedArray(num, 'float32');
        values[0] = start;
        for (var i = 1; i < values.length; i++) {
            values[i] = values[i - 1] + step;
        }
        return tensor_1.Tensor1D.new(values, 'float32');
    };
    Ops.range = function (start, stop, step, dtype) {
        if (step === void 0) { step = 1; }
        if (dtype === void 0) { dtype = 'float32'; }
        if (step === 0) {
            throw new Error('Cannot have a step of zero');
        }
        var sameStartStop = start === stop;
        var increasingRangeNegativeStep = start < stop && step < 0;
        var decreasingRangePositiveStep = stop < start && step > 1;
        if (sameStartStop || increasingRangeNegativeStep ||
            decreasingRangePositiveStep) {
            return Ops.zeros([0], dtype);
        }
        var numElements = Math.abs(Math.ceil((stop - start) / step));
        var values = makeZerosTypedArray(numElements, dtype);
        if (stop < start && step === 1) {
            step = -1;
        }
        values[0] = start;
        for (var i = 1; i < values.length; i++) {
            values[i] = values[i - 1] + step;
        }
        return Ops.tensor1d(values, dtype);
    };
    Ops.buffer = function (shape, dtype, values) {
        if (dtype === void 0) { dtype = 'float32'; }
        return new tensor_1.TensorBuffer(shape, dtype, values);
    };
    Ops.print = function (x, verbose) {
        if (verbose === void 0) { verbose = false; }
        var C = (function () {
            function Tensor() {
            }
            return Tensor;
        }());
        var displayTensor = new C();
        displayTensor.shape = x.shape;
        displayTensor.values = Array.from(x.dataSync());
        displayTensor.toString = function () {
            var fields = [
                "values: [" + this.values.join(', ') + "]", "shape: [" + x.shape.join(', ') + "]",
                "rank: " + x.rank
            ];
            if (verbose) {
                fields.push("dtype: '" + this.dtype + "'");
                fields.push("size: " + this.size);
            }
            for (var i = 0; i < fields.length; i++) {
                fields[i] = '  ' + fields[i];
            }
            return 'TensorInfo {\n' + fields.join(',\n') + '\n}';
        };
        if (verbose) {
            displayTensor.dtype = x.dtype;
            displayTensor.size = x.size;
        }
        console.log(displayTensor);
    };
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' })
    ], Ops, "tensor", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' })
    ], Ops, "scalar", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' })
    ], Ops, "tensor1d", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' })
    ], Ops, "tensor2d", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' })
    ], Ops, "tensor3d", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' })
    ], Ops, "tensor4d", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' }),
        operation_1.operation
    ], Ops, "ones", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' }),
        operation_1.operation
    ], Ops, "zeros", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' }),
        operation_1.operation
    ], Ops, "fill", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' }),
        operation_1.operation
    ], Ops, "onesLike", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' }),
        operation_1.operation
    ], Ops, "zerosLike", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' }),
        operation_1.operation
    ], Ops, "clone", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' }),
        operation_1.operation
    ], Ops, "randomNormal", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' }),
        operation_1.operation
    ], Ops, "truncatedNormal", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' }),
        operation_1.operation
    ], Ops, "randomUniform", null);
    __decorate([
        operation_1.operation
    ], Ops, "rand", null);
    __decorate([
        operation_1.operation
    ], Ops, "multinomial", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' }),
        operation_1.operation
    ], Ops, "oneHot", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' }),
        operation_1.operation
    ], Ops, "fromPixels", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Transformations' }),
        operation_1.operation
    ], Ops, "reshape", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Transformations' })
    ], Ops, "squeeze", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Transformations' }),
        operation_1.operation
    ], Ops, "cast", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Slicing and Joining' }),
        operation_1.operation
    ], Ops, "tile", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Slicing and Joining' }),
        operation_1.operation
    ], Ops, "gather", null);
    __decorate([
        operation_1.operation
    ], Ops, "pad1d", null);
    __decorate([
        operation_1.operation
    ], Ops, "pad2d", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Transformations' }),
        operation_1.operation
    ], Ops, "pad", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Slicing and Joining' }),
        operation_1.operation
    ], Ops, "stack", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Transformations' }),
        operation_1.operation
    ], Ops, "expandDims", null);
    __decorate([
        operation_1.operation,
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' })
    ], Ops, "linspace", null);
    __decorate([
        operation_1.operation,
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' })
    ], Ops, "range", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' })
    ], Ops, "buffer", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' })
    ], Ops, "print", null);
    return Ops;
}());
exports.Ops = Ops;
function makeZerosTypedArray(size, dtype) {
    if (dtype == null || dtype === 'float32') {
        return new Float32Array(size);
    }
    else if (dtype === 'int32') {
        return new Int32Array(size);
    }
    else if (dtype === 'bool') {
        return new Uint8Array(size);
    }
    else {
        throw new Error("Unknown data type $ {dtype}");
    }
}
function makeOnesTypedArray(size, dtype) {
    var array = makeZerosTypedArray(size, dtype);
    for (var i = 0; i < array.length; i++) {
        array[i] = 1;
    }
    return array;
}
function toTypedArray(a, dtype) {
    if (noConversionNeeded(a, dtype)) {
        return a;
    }
    if (Array.isArray(a)) {
        a = util.flatten(a);
    }
    return util.copyTypedArray(a, dtype);
}
function noConversionNeeded(a, dtype) {
    return (a instanceof Float32Array && dtype === 'float32') ||
        (a instanceof Int32Array && dtype === 'int32') ||
        (a instanceof Uint8Array && dtype === 'bool');
}
