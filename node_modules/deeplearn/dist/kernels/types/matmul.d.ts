import { KernelNode } from '../../tape_types';
import { Tensor2D } from '../../tensor';
export interface MatMulNode extends KernelNode {
    inputAndArgs: {
        inputs: {
            a: Tensor2D;
            b: Tensor2D;
        };
        args: {
            transposeA: boolean;
            transposeB: boolean;
        };
    };
    output: Tensor2D;
    gradient: (dy: Tensor2D, y: Tensor2D) => {
        a: () => Tensor2D;
        b: () => Tensor2D;
    };
}
export declare enum MatrixOrientation {
    REGULAR = 0,
    TRANSPOSED = 1,
}
