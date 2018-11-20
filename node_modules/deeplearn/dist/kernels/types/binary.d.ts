import { KernelNode } from '../../tape_types';
import { Tensor } from '../../tensor';
export interface BinaryNode extends KernelNode {
    inputAndArgs: {
        inputs: {
            a: Tensor;
            b: Tensor;
        };
    };
    output: Tensor;
    gradient: (dy: Tensor, y: Tensor) => {
        a: () => Tensor;
        b: () => Tensor;
    };
}
