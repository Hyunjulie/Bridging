import { KernelNode } from '../../tape_types';
import { Tensor } from '../../tensor';
export interface SumNode extends KernelNode {
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
