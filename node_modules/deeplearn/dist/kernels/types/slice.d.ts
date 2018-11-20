import { KernelNode } from '../../tape_types';
import { Tensor1D, Tensor2D, Tensor3D, Tensor4D } from '../../tensor';
export interface Slice1DNode extends KernelNode {
    inputAndArgs: {
        inputs: {
            x: Tensor1D;
        };
        args: {
            begin: number;
            size: number;
        };
    };
    output: Tensor1D;
    gradient: (dy: Tensor1D, y: Tensor1D) => {
        x: () => Tensor1D;
    };
}
export interface Slice2DNode extends KernelNode {
    inputAndArgs: {
        inputs: {
            x: Tensor2D;
        };
        args: {
            begin: [number, number];
            size: [number, number];
        };
    };
    output: Tensor2D;
    gradient: (dy: Tensor2D, y: Tensor2D) => {
        x: () => Tensor2D;
    };
}
export interface Slice3DNode extends KernelNode {
    inputAndArgs: {
        inputs: {
            x: Tensor3D;
        };
        args: {
            begin: [number, number, number];
            size: [number, number, number];
        };
    };
    output: Tensor3D;
    gradient: (dy: Tensor3D, y: Tensor3D) => {
        x: () => Tensor3D;
    };
}
export interface Slice4DNode extends KernelNode {
    inputAndArgs: {
        inputs: {
            x: Tensor4D;
        };
        args: {
            begin: [number, number, number, number];
            size: [number, number, number, number];
        };
    };
    output: Tensor4D;
    gradient: (dy: Tensor4D, y: Tensor4D) => {
        x: () => Tensor4D;
    };
}
