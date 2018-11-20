import { KernelNode } from '../../tape_types';
import { Tensor } from '../../tensor';
import { Rank } from '../../types';
export interface PReLUNode<R extends Rank, T extends Tensor<R> = Tensor<R>> extends KernelNode {
    inputAndArgs: {
        inputs: {
            x: T;
            alpha: T;
        };
    };
    output: T;
    gradient: (dy: Tensor<R>, y: T) => {
        x: () => Tensor<R>;
        alpha: () => Tensor<R>;
    };
}
