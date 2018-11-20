import { KernelNode } from '../../tape_types';
import { Tensor2D } from '../../tensor';
export interface ConcatNode extends KernelNode {
    inputAndArgs: {
        inputs: {
            a: Tensor2D;
            b: Tensor2D;
        };
    };
    output: Tensor2D;
    gradient: (dy: Tensor2D, y: Tensor2D) => {
        a: () => Tensor2D;
        b: () => Tensor2D;
    };
}
