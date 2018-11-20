import { Conv2DInfo } from '../../ops/conv_util';
import { KernelNode } from '../../tape_types';
import { Tensor4D } from '../../tensor';
export interface PoolNode extends KernelNode {
    inputAndArgs: {
        inputs: {
            x: Tensor4D;
        };
        args: {
            convInfo: Conv2DInfo;
        };
    };
    output: Tensor4D;
    gradient: (dy: Tensor4D, y: Tensor4D) => {
        x: () => Tensor4D;
    };
}
export interface PoolBackpropNode extends KernelNode {
    inputAndArgs: {
        inputs: {
            dy: Tensor4D;
            x: Tensor4D;
        };
        args: {
            convInfo: Conv2DInfo;
        };
    };
    output: Tensor4D;
    gradient: (dy: Tensor4D, y: Tensor4D) => {
        dy: () => Tensor4D;
        x: () => Tensor4D;
    };
}
