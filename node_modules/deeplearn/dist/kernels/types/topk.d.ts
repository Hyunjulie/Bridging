import { KernelNode } from '../../tape_types';
import { Tensor, Tensor1D } from '../../tensor';
import { Rank } from '../../types';
export interface TopKValuesNode<R extends Rank, T extends Tensor<R> = Tensor<R>> extends KernelNode {
    inputAndArgs: {
        inputs: {
            x: T;
        };
        args: {
            k: number;
        };
    };
    output: Tensor1D;
    gradient: (dy: Tensor1D, y: Tensor1D) => {
        x: () => T;
    };
}
export interface TopKIndicesNode extends KernelNode {
    inputAndArgs: {
        inputs: {
            x: Tensor;
        };
        args: {
            k: number;
        };
    };
    output: Tensor1D;
    gradient: (dy: Tensor1D, y: Tensor1D) => {
        x: () => Tensor;
    };
}
