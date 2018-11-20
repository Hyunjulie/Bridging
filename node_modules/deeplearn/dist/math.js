"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var environment_1 = require("./environment");
var array_ops = require("./ops/array_ops");
var batchnorm = require("./ops/batchnorm");
var binary_ops = require("./ops/binary_ops");
var compare = require("./ops/compare");
var conv = require("./ops/conv");
var image_ops = require("./ops/image_ops");
var logical = require("./ops/logical_ops");
var lrn_ops = require("./ops/lrn");
var lstm_ops = require("./ops/lstm");
var matmul = require("./ops/matmul");
var norm = require("./ops/norm");
var ops = require("./ops/ops");
var pool = require("./ops/pool");
var reduction_ops = require("./ops/reduction_ops");
var reverse = require("./ops/reverse");
var slice = require("./ops/slice");
var softmax_ops = require("./ops/softmax");
var transpose = require("./ops/transpose");
var unary_ops = require("./ops/unary_ops");
var tracking_1 = require("./tracking");
var util = require("./util");
var tidy = tracking_1.Tracking.tidy;
var keep = tracking_1.Tracking.keep;
var NDArrayMath = (function () {
    function NDArrayMath(backend, safeMode) {
        this.matMul = matmul.Ops.matMul;
        this.vectorTimesMatrix = matmul.Ops.vectorTimesMatrix;
        this.outerProduct = matmul.Ops.outerProduct;
        this.matrixTimesVector = matmul.Ops.matrixTimesVector;
        this.dotProduct = matmul.Ops.dotProduct;
        this.slice = slice.Ops.slice;
        this.slice1D = slice.Ops.slice1d;
        this.slice2D = slice.Ops.slice2d;
        this.slice3D = slice.Ops.slice3d;
        this.slice4D = slice.Ops.slice4d;
        this.reverse = reverse.Ops.reverse;
        this.reverse1D = reverse.Ops.reverse1d;
        this.reverse2D = reverse.Ops.reverse2d;
        this.reverse3D = reverse.Ops.reverse3d;
        this.reverse4D = reverse.Ops.reverse4d;
        this.batchNormalization = batchnorm.Ops.batchNormalization;
        this.batchNormalization2D = batchnorm.Ops.batchNormalization2d;
        this.batchNormalization3D = batchnorm.Ops.batchNormalization3d;
        this.batchNormalization4D = batchnorm.Ops.batchNormalization4d;
        this.avgPool = pool.Ops.avgPool;
        this.maxPool = pool.Ops.maxPool;
        this.minPool = pool.Ops.minPool;
        this.maxPoolBackprop = pool.Ops.maxPoolBackprop;
        this.conv2dTranspose = conv.Ops.conv2dTranspose;
        this.depthwiseConv2D = conv.Ops.depthwiseConv2d;
        this.conv2dDerFilter = conv.Ops.conv2dDerFilter;
        this.conv2dDerInput = conv.Ops.conv2dDerInput;
        this.argMax = reduction_ops.Ops.argMax;
        this.argMin = reduction_ops.Ops.argMin;
        this.logSumExp = reduction_ops.Ops.logSumExp;
        this.max = reduction_ops.Ops.max;
        this.mean = reduction_ops.Ops.mean;
        this.min = reduction_ops.Ops.min;
        this.moments = reduction_ops.Ops.moments;
        this.sum = reduction_ops.Ops.sum;
        this.add = binary_ops.Ops.add;
        this.addStrict = binary_ops.Ops.addStrict;
        this.div = binary_ops.Ops.div;
        this.divide = this.div;
        this.divStrict = binary_ops.Ops.divStrict;
        this.divideStrict = this.divStrict;
        this.maximum = binary_ops.Ops.maximum;
        this.maximumStrict = binary_ops.Ops.maximumStrict;
        this.minimum = binary_ops.Ops.minimum;
        this.minimumStrict = binary_ops.Ops.minimumStrict;
        this.mul = binary_ops.Ops.mul;
        this.multiply = this.mul;
        this.mulStrict = binary_ops.Ops.mulStrict;
        this.multiplyStrict = this.mulStrict;
        this.pow = binary_ops.Ops.pow;
        this.powStrict = binary_ops.Ops.powStrict;
        this.sub = binary_ops.Ops.sub;
        this.subtract = this.sub;
        this.subStrict = binary_ops.Ops.subStrict;
        this.logicalNot = logical.Ops.logicalNot;
        this.logicalAnd = logical.Ops.logicalAnd;
        this.logicalOr = logical.Ops.logicalOr;
        this.logicalXor = logical.Ops.logicalXor;
        this.where = logical.Ops.where;
        this.transpose = transpose.Ops.transpose;
        this.equal = compare.Ops.equal;
        this.equalStrict = compare.Ops.equalStrict;
        this.greater = compare.Ops.greater;
        this.greaterStrict = compare.Ops.greaterStrict;
        this.greaterEqual = compare.Ops.greaterEqual;
        this.greaterEqualStrict = compare.Ops.greaterEqualStrict;
        this.less = compare.Ops.less;
        this.lessStrict = compare.Ops.lessStrict;
        this.lessEqual = compare.Ops.lessEqual;
        this.lessEqualStrict = compare.Ops.lessEqualStrict;
        this.notEqual = compare.Ops.notEqual;
        this.notEqualStrict = compare.Ops.notEqualStrict;
        this.abs = unary_ops.Ops.abs;
        this.acos = unary_ops.Ops.acos;
        this.asin = unary_ops.Ops.asin;
        this.atan = unary_ops.Ops.atan;
        this.ceil = unary_ops.Ops.ceil;
        this.clip = unary_ops.Ops.clipByValue;
        this.cos = unary_ops.Ops.cos;
        this.cosh = unary_ops.Ops.cosh;
        this.elu = unary_ops.Ops.elu;
        this.exp = unary_ops.Ops.exp;
        this.floor = unary_ops.Ops.floor;
        this.leakyRelu = unary_ops.Ops.leakyRelu;
        this.log = unary_ops.Ops.log;
        this.neg = unary_ops.Ops.neg;
        this.prelu = unary_ops.Ops.prelu;
        this.relu = unary_ops.Ops.relu;
        this.selu = unary_ops.Ops.selu;
        this.sigmoid = unary_ops.Ops.sigmoid;
        this.sin = unary_ops.Ops.sin;
        this.sinh = unary_ops.Ops.sinh;
        this.sqrt = unary_ops.Ops.sqrt;
        this.square = unary_ops.Ops.square;
        this.step = unary_ops.Ops.step;
        this.tan = unary_ops.Ops.tan;
        this.tanh = unary_ops.Ops.tanh;
        this.norm = norm.Ops.norm;
        this.basicLSTMCell = lstm_ops.Ops.basicLSTMCell;
        this.multiRNNCell = lstm_ops.Ops.multiRNNCell;
        this.softmax = softmax_ops.Ops.softmax;
        this.softmaxCrossEntropy = softmax_ops.Ops.softmaxCrossEntropy;
        this.cast = array_ops.Ops.cast;
        this.clone = array_ops.Ops.clone;
        this.gather = array_ops.Ops.gather;
        this.reshape = array_ops.Ops.reshape;
        this.tile = array_ops.Ops.tile;
        this.oneHot = array_ops.Ops.oneHot;
        this.multinomial = array_ops.Ops.multinomial;
        this.pad1D = array_ops.Ops.pad1d;
        this.pad2D = array_ops.Ops.pad2d;
        this.resizeBilinear3D = image_ops.Ops.resizeBilinear;
        this.localResponseNormalization3D = lrn_ops.LRN.localResponseNormalization;
        this.localResponseNormalization4D = lrn_ops.LRN.localResponseNormalization;
        this.keep = tracking_1.Tracking.keep;
        environment_1.ENV.setMath(this, backend, safeMode);
        this.engine = environment_1.ENV.engine;
        this.dispose = environment_1.ENV.engine.dispose.bind(environment_1.ENV.engine);
        this.registeredVariables = environment_1.ENV.engine.registeredVariables;
        this.startScope = environment_1.ENV.engine.startScope.bind(environment_1.ENV.engine);
        this.endScope = environment_1.ENV.engine.endScope.bind(environment_1.ENV.engine);
    }
    NDArrayMath.prototype.scope = function (scopeFn) {
        var keepFn = function (tensor) { return keep(tensor); };
        var trackFn = function (tensor) { return tensor; };
        return tidy(function () { return scopeFn(keepFn, trackFn); });
    };
    NDArrayMath.prototype.track = function (result) {
        return result;
    };
    NDArrayMath.prototype.topK = function (x, k) {
        util.assert(k <= x.size, "Error in topK: k value (" + k + ") must be less than size of input " +
            ("tensor, got shape " + x.shape + "."));
        var values;
        var indices;
        tidy('topK', function () {
            values = environment_1.ENV.engine.executeKernel('TopKValues', { inputs: { x: x }, args: { k: k } });
            indices =
                environment_1.ENV.engine.executeKernel('TopKIndices', { inputs: { x: x }, args: { k: k } });
            return values;
        });
        var result = { values: values, indices: indices };
        return result;
    };
    NDArrayMath.prototype.elementWiseMul = function (a, b) {
        return a.mulStrict(b);
    };
    NDArrayMath.prototype.scalarDividedByArray = function (c, a) {
        util.assert(c.size === 1, "Error in scalarDividedByArray: first argument must be rank 0, but " +
            ("got Tensor of rank " + c.rank + "."));
        return c.div(a);
    };
    NDArrayMath.prototype.arrayDividedByScalar = function (a, c) {
        util.assert(c.size === 1, "Error in arrayDividedByScalar: second argument must be rank 0, " +
            ("but got Tensor of rank " + c.rank + "."));
        return a.div(c);
    };
    NDArrayMath.prototype.switchDim = function (x, perm) {
        return ops.transpose(x, perm);
    };
    NDArrayMath.prototype.scalarPlusArray = function (c, a) {
        util.assert(c.size === 1, "Error in scalarPlusArray: first argument must be rank 0, but got " +
            ("rank " + c.rank + "."));
        return this.add(c, a);
    };
    NDArrayMath.prototype.scalarMinusArray = function (c, a) {
        util.assert(c.size === 1, "Error in scalarMinusArray: first argument must be rank 0, but got " +
            ("rank " + c.rank + "."));
        return this.subtract(c, a);
    };
    NDArrayMath.prototype.arrayMinusScalar = function (a, c) {
        util.assert(c.size === 1, "Error in arrayMinusScalar: second argument must be rank 0, but " +
            ("got rank " + c.rank + "."));
        return this.subtract(a, c);
    };
    NDArrayMath.prototype.scaledArrayAdd = function (c1, a, c2, b) {
        var _this = this;
        util.assert(c1.size === 1, "Error in scaledArrayAdd: first argument must rank 0, but got " +
            (" rank " + c1.rank + "."));
        util.assert(c2.size === 1, "Error in scaledArrayAdd: third argument must be rank 0, but got " +
            ("Tensor of rank " + c2.rank + "."));
        util.assertShapesMatch(a.shape, b.shape, 'Error in scaledArrayAdd: ');
        return tidy('scaledArrayAdd', function () {
            return _this.add(_this.multiply(c1, a), _this.multiply(c2, b));
        });
    };
    NDArrayMath.prototype.scalarTimesArray = function (c, a) {
        util.assert(c.size === 1, "Error in arrayDividedByScalar: first argument must be rank 0, but " +
            ("got rank " + c.rank + "."));
        return this.multiply(c, a);
    };
    NDArrayMath.prototype.concat = function (a, b, axis) {
        return ops.concat([a, b], axis);
    };
    NDArrayMath.prototype.concat1D = function (a, b) {
        return ops.concat1d([a, b]);
    };
    NDArrayMath.prototype.concat2D = function (a, b, axis) {
        return ops.concat2d([a, b], axis);
    };
    NDArrayMath.prototype.concat3D = function (a, b, axis) {
        return ops.concat3d([a, b], axis);
    };
    NDArrayMath.prototype.concat4D = function (a, b, axis) {
        return ops.concat4d([a, b], axis);
    };
    NDArrayMath.prototype.conv1d = function (input, filter, bias, stride, pad, dimRoundingMode) {
        if (bias != null) {
            util.assert(bias.rank === 1, "Error in conv1d: bias must be rank 1, but got rank " +
                (bias.rank + "."));
        }
        var res = ops.conv1d(input, filter, stride, pad, dimRoundingMode);
        return res.add(bias);
    };
    NDArrayMath.prototype.conv2d = function (x, filter, bias, strides, pad, dimRoundingMode) {
        if (bias != null) {
            util.assert(bias.rank === 1, "Error in conv2d: bias must be rank 1, but got rank " +
                (bias.rank + "."));
        }
        var res = ops.conv2d(x, filter, strides, pad, dimRoundingMode);
        return res.add(bias);
    };
    NDArrayMath.prototype.argMaxEquals = function (x1, x2) {
        util.assertShapesMatch(x1.shape, x2.shape, 'Error in argMaxEquals: ');
        return x1.argMax().equal(x2.argMax());
    };
    return NDArrayMath;
}());
exports.NDArrayMath = NDArrayMath;
