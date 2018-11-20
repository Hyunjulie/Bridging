import { KernelNode } from '../../tape_types';
import { Tensor } from '../../tensor';
export interface MinNode extends KernelNode {
    inputAndArgs: {
        inputs: {
            x: Tensor;
        };
        args: {
            axes: number[];
        };
    };
    output: Tensor;
    gradient: (dy: Tensor, y: Tensor) => {
        x: () => Tensor;
    };
}
export interface MinimumNode extends KernelNode {
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
export interface MaxNode extends KernelNode {
    inputAndArgs: {
        inputs: {
            x: Tensor;
        };
        args: {
            axes: number[];
        };
    };
    output: Tensor;
    gradient: (dy: Tensor, y: Tensor) => {
        x: () => Tensor;
    };
}
export interface MaximumNode extends KernelNode {
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
