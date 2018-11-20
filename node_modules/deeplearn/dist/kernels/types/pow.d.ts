import { KernelNode } from '../../tape_types';
import { Tensor } from '../../tensor';
import { Rank } from '../../types';
export interface PowNode<R extends Rank, T extends Tensor<R> = Tensor<R>> extends KernelNode {
    inputAndArgs: {
        inputs: {
            base: T;
            exp: Tensor;
        };
    };
    output: T;
    gradient: (dy: Tensor<R>, y: T) => {
        base: () => Tensor<R>;
        exp: () => Tensor;
    };
}
