import { KernelNode } from '../../tape_types';
import { Tensor, Tensor1D } from '../../tensor';
import { Rank } from '../../types';
export interface GatherNode<R extends Rank, T extends Tensor<R> = Tensor<R>> extends KernelNode {
    inputAndArgs: {
        inputs: {
            x: T;
            indices: Tensor1D;
        };
        args: {
            axis: number;
        };
    };
    output: T;
    gradient: (dy: Tensor<R>, y: T) => {
        x: () => Tensor<R>;
        indices: () => Tensor1D;
    };
}
