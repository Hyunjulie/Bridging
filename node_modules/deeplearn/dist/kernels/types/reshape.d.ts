import { KernelNode } from '../../tape_types';
import { Tensor } from '../../tensor';
export interface ReshapeNode extends KernelNode {
    inputAndArgs: {
        inputs: {
            x: Tensor;
        };
        args: {
            newShape: number[];
        };
    };
    output: Tensor;
    gradient: (dy: Tensor, y: Tensor) => {
        x: () => Tensor;
    };
}
