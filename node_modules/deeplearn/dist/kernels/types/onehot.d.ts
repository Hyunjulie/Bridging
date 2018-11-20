import { KernelNode } from '../../tape_types';
import { Tensor1D, Tensor2D } from '../../tensor';
export interface OneHotNode extends KernelNode {
    inputAndArgs: {
        inputs: {
            indices: Tensor1D;
        };
        args: {
            depth: number;
            onValue: number;
            offValue: number;
        };
    };
    output: Tensor2D;
    gradient: (dy: Tensor2D, y: Tensor2D) => {
        indices: () => Tensor1D;
    };
}
