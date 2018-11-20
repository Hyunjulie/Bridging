import { KernelNode } from '../../tape_types';
import { Tensor4D } from '../../tensor';
export interface Reverse4DNode extends KernelNode {
    inputAndArgs: {
        inputs: {
            x: Tensor4D;
        };
        args: {
            axis: number[];
        };
    };
    output: Tensor4D;
    gradient: (dy: Tensor4D, y: Tensor4D) => {
        x: () => Tensor4D;
    };
}
