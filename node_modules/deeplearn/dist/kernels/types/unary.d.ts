import { KernelNode } from '../../tape_types';
import { Tensor } from '../../tensor';
import { Rank } from '../../types';
export interface UnaryNode<R extends Rank, T extends Tensor<R> = Tensor<R>> extends KernelNode {
    inputAndArgs: {
        inputs: {
            x: T;
        };
    };
    output: T;
    gradient: (dy: T, y: T) => {
        x: () => T;
    };
}
export interface LeakyReluNode<R extends Rank, T extends Tensor<R> = Tensor<R>> extends KernelNode {
    inputAndArgs: {
        inputs: {
            x: T;
        };
        args: {
            alpha: number;
        };
    };
    output: T;
    gradient: (dy: T, y: T) => {
        x: () => T;
    };
}
export interface StepNode<R extends Rank, T extends Tensor<R> = Tensor<R>> extends KernelNode {
    inputAndArgs: {
        inputs: {
            x: T;
        };
        args: {
            alpha: number;
        };
    };
    output: T;
    gradient: (dy: T, y: T) => {
        x: () => T;
    };
}
export interface ClipNode<R extends Rank, T extends Tensor<R> = Tensor<R>> extends KernelNode {
    inputAndArgs: {
        inputs: {
            x: T;
        };
        args: {
            min: number;
            max: number;
        };
    };
    output: T;
    gradient: (dy: T, y: T) => {
        x: () => T;
    };
}
export interface TransposeNode<R extends Rank, T extends Tensor<R> = Tensor<R>> extends KernelNode {
    inputAndArgs: {
        inputs: {
            x: T;
        };
        args: {
            perm: number[];
        };
    };
    output: T;
    gradient: (dy: T, y: T) => {
        x: () => T;
    };
}
export interface TileNode<R extends Rank, T extends Tensor<R> = Tensor<R>> extends KernelNode {
    inputAndArgs: {
        inputs: {
            x: T;
        };
        args: {
            reps: number[];
        };
    };
    output: T;
    gradient: (dy: T, y: T) => {
        x: () => T;
    };
}
