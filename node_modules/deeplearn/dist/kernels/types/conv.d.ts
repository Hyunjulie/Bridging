import { Conv2DInfo } from '../../ops/conv_util';
import { KernelNode } from '../../tape_types';
import { Tensor4D } from '../../tensor';
export interface Conv2DNode extends KernelNode {
    inputAndArgs: {
        inputs: {
            x: Tensor4D;
            filter: Tensor4D;
        };
        args: {
            convInfo: Conv2DInfo;
        };
    };
    output: Tensor4D;
    gradient: (dy: Tensor4D, y: Tensor4D) => {
        x: () => Tensor4D;
        filter: () => Tensor4D;
    };
}
export interface Conv2DDerInputNode extends KernelNode {
    inputAndArgs: {
        inputs: {
            dy: Tensor4D;
            filter: Tensor4D;
        };
        args: {
            convInfo: Conv2DInfo;
        };
    };
    output: Tensor4D;
    gradient: (dy: Tensor4D, y: Tensor4D) => {
        dy: () => Tensor4D;
        filter: () => Tensor4D;
    };
}
export interface Conv2DDerFilterNode extends KernelNode {
    inputAndArgs: {
        inputs: {
            x: Tensor4D;
            dy: Tensor4D;
        };
        args: {
            convInfo: Conv2DInfo;
        };
    };
    output: Tensor4D;
    gradient: (dy: Tensor4D, y: Tensor4D) => {
        x: () => Tensor4D;
        dy: () => Tensor4D;
    };
}
export interface DepthwiseConv2DNode extends KernelNode {
    inputAndArgs: {
        inputs: {
            x: Tensor4D;
            filter: Tensor4D;
        };
        args: {
            convInfo: Conv2DInfo;
        };
    };
    output: Tensor4D;
    gradient: (dy: Tensor4D, y: Tensor4D) => {
        x: () => Tensor4D;
        filter: () => Tensor4D;
    };
}
