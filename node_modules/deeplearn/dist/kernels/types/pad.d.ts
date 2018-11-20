import { KernelNode } from '../../tape_types';
import { Tensor1D, Tensor2D } from '../../tensor';
export interface Pad1DNode extends KernelNode {
    inputAndArgs: {
        inputs: {
            x: Tensor1D;
        };
        args: {
            paddings: [number, number];
            constantValue: number;
        };
    };
    output: Tensor1D;
    gradient: (dy: Tensor1D, y: Tensor1D) => {
        x: () => Tensor1D;
    };
}
export interface Pad2DNode extends KernelNode {
    inputAndArgs: {
        inputs: {
            x: Tensor2D;
        };
        args: {
            paddings: [[number, number], [number, number]];
            constantValue: number;
        };
    };
    output: Tensor2D;
    gradient: (dy: Tensor2D, y: Tensor2D) => {
        x: () => Tensor2D;
    };
}
