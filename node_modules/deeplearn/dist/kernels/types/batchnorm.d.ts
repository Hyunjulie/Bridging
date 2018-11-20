import { KernelNode } from '../../tape_types';
import { Tensor1D, Tensor4D } from '../../tensor';
export interface BatchNorm4DNode extends KernelNode {
    inputAndArgs: {
        inputs: {
            x: Tensor4D;
            mean: Tensor4D | Tensor1D;
            variance: Tensor4D | Tensor1D;
            scale?: Tensor4D | Tensor1D;
            offset?: Tensor4D | Tensor1D;
        };
        args: {
            varianceEpsilon: number;
        };
    };
    output: Tensor4D;
    gradient: (dy: Tensor4D, y: Tensor4D) => {
        x: () => Tensor4D;
        mean: () => Tensor4D | Tensor1D;
        variance: () => Tensor4D | Tensor1D;
        scale?: () => Tensor4D | Tensor1D;
        offset?: () => Tensor4D | Tensor1D;
    };
}
