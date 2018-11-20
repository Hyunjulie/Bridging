import { KernelNode } from '../../tape_types';
import { Tensor } from '../../tensor';
export interface ArgMaxNode extends KernelNode {
    inputAndArgs: {
        inputs: {
            x: Tensor;
        };
        args: {
            axes: number[];
        };
    };
    output: Tensor;
    gradient: (dy: Tensor, y: Tensor) => {
        x: () => Tensor;
    };
}
export interface ArgMinNode extends KernelNode {
    inputAndArgs: {
        inputs: {
            x: Tensor;
        };
        args: {
            axes: number[];
        };
    };
    output: Tensor;
    gradient: (dy: Tensor, y: Tensor) => {
        x: () => Tensor;
    };
}
