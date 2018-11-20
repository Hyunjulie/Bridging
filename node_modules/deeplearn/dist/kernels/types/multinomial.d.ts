import { KernelNode } from '../../tape_types';
import { Tensor2D } from '../../tensor';
export interface MultinomialNode extends KernelNode {
    inputAndArgs: {
        inputs: {
            probs: Tensor2D;
        };
        args: {
            numSamples: number;
            seed: number;
        };
    };
    output: Tensor2D;
    gradient: (dy: Tensor2D, y: Tensor2D) => {
        probs: () => Tensor2D;
    };
}
