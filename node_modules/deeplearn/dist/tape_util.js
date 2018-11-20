"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util = require("./util");
var tensor_1 = require("./tensor");
function getFilteredNodesXToY(tape, xs, y) {
    var tensorsFromX = {};
    var nodesFromX = {};
    for (var i = 0; i < xs.length; i++) {
        tensorsFromX[xs[i].id] = true;
    }
    for (var i = 0; i < tape.length; i++) {
        var node = tape[i];
        var nodeInputs = node.inputAndArgs.inputs;
        for (var inputName in nodeInputs) {
            var input = nodeInputs[inputName];
            var anyInputFromX = false;
            for (var j = 0; j < xs.length; j++) {
                if (tensorsFromX[input.id]) {
                    if (node.output instanceof tensor_1.Tensor) {
                        tensorsFromX[node.output.id] = true;
                    }
                    else {
                        var keys = Object.keys(node.output);
                        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                            var key = keys_1[_i];
                            tensorsFromX[node.output[key].id] = true;
                        }
                    }
                    anyInputFromX = true;
                    nodesFromX[node.id] = true;
                    break;
                }
            }
            if (anyInputFromX) {
                break;
            }
        }
    }
    var tensorsLeadToY = {};
    tensorsLeadToY[y.id] = true;
    var nodesToY = {};
    for (var i = tape.length - 1; i >= 0; i--) {
        var node = tape[i];
        var nodeInputs = node.inputAndArgs.inputs;
        var outputs = [];
        if (node.output instanceof tensor_1.Tensor) {
            outputs.push(node.output);
        }
        else {
            var keys = Object.keys(node.output);
            for (var _a = 0, keys_2 = keys; _a < keys_2.length; _a++) {
                var key = keys_2[_a];
                outputs.push(node.output[key]);
            }
        }
        for (var j = 0; j < outputs.length; j++) {
            if (tensorsLeadToY[outputs[j].id]) {
                for (var inputName in nodeInputs) {
                    tensorsLeadToY[nodeInputs[inputName].id] = true;
                    nodesToY[node.id] = true;
                }
                break;
            }
        }
    }
    var filteredTape = [];
    for (var i = 0; i < tape.length; i++) {
        var node = tape[i];
        if (nodesFromX[node.id] && nodesToY[node.id]) {
            var prunedInputs = {};
            for (var inputName in node.inputAndArgs.inputs) {
                var nodeInput = node.inputAndArgs.inputs[inputName];
                if (tensorsFromX[nodeInput.id]) {
                    prunedInputs[inputName] = nodeInput;
                }
            }
            var prunedOutputs = void 0;
            if (node.output instanceof tensor_1.Tensor) {
                prunedOutputs = node.output;
            }
            else {
                prunedOutputs = {};
                for (var outputName in node.output) {
                    var output = node.output[outputName];
                    if (tensorsLeadToY[output.id]) {
                        prunedOutputs[outputName] = node.output[outputName];
                    }
                }
            }
            var prunedNode = Object.assign({}, node);
            prunedNode.inputAndArgs = { inputs: prunedInputs };
            prunedNode.output = prunedOutputs;
            filteredTape.push(prunedNode);
        }
    }
    return filteredTape;
}
exports.getFilteredNodesXToY = getFilteredNodesXToY;
function backpropagateGradients(tensorAccumulatedGradientMap, filteredTape) {
    for (var i = filteredTape.length - 1; i >= 0; i--) {
        var node = filteredTape[i];
        var dy = void 0;
        if (node.output instanceof tensor_1.Tensor) {
            dy = tensorAccumulatedGradientMap[node.output.id];
        }
        else {
            dy = {};
            var keys = Object.keys(node.output);
            for (var _i = 0, keys_3 = keys; _i < keys_3.length; _i++) {
                var key = keys_3[_i];
                dy[key] = tensorAccumulatedGradientMap[node.output[key].id];
            }
        }
        if (node.gradient == null) {
            throw new Error("Cannot compute gradient: gradient function not found " +
                ("for " + node.name + "."));
        }
        var inputGradients = node.gradient(dy, node.output);
        for (var inputName in node.inputAndArgs.inputs) {
            if (!(inputName in inputGradients)) {
                throw new Error("Cannot backprop through input " + inputName + ". " +
                    ("Available gradients found: " + Object.keys(inputGradients) + "."));
            }
            var dx = inputGradients[inputName]();
            var x = node.inputAndArgs.inputs[inputName];
            if (!util.arraysEqual(dx.shape, x.shape)) {
                throw new Error("Error in gradient for op " + node.name + ". The gradient of input " +
                    ("'" + inputName + "' has shape '" + dx.shape + "', which does not match ") +
                    ("the shape of the input '" + x.shape + "'"));
            }
            if (tensorAccumulatedGradientMap[x.id] == null) {
                tensorAccumulatedGradientMap[x.id] = dx;
            }
            else {
                var curGradient = tensorAccumulatedGradientMap[x.id];
                tensorAccumulatedGradientMap[x.id] = curGradient.add(dx);
                curGradient.dispose();
            }
        }
    }
}
exports.backpropagateGradients = backpropagateGradients;
function extractTensorsFromScopeResult(result) {
    if (result == null) {
        return [];
    }
    if (result instanceof tensor_1.Tensor) {
        return [result];
    }
    var list = [];
    var resultObj = result;
    for (var k in resultObj) {
        var sublist = util.flatten(resultObj[k]).filter(function (x) { return x instanceof tensor_1.Tensor; });
        list.push.apply(list, sublist);
    }
    return list;
}
exports.extractTensorsFromScopeResult = extractTensorsFromScopeResult;
function stripUndefinedInputsFromInputConfig(config) {
    var keys = Object.keys(config.inputs);
    keys.forEach(function (key) {
        if (config.inputs[key] == null) {
            delete config.inputs[key];
        }
    });
    return config;
}
exports.stripUndefinedInputsFromInputConfig = stripUndefinedInputsFromInputConfig;
