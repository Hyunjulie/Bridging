import { KernelNode } from '../../tape_types';
import { Tensor4D } from '../../tensor';
export interface ResizeBilinearNode extends KernelNode {
    inputAndArgs: {
        inputs: {
            x: Tensor4D;
        };
        args: {
            newHeight: number;
            newWidth: number;
            alignCorners: boolean;
        };
    };
    output: Tensor4D;
    gradient: (dy: Tensor4D, y: Tensor4D) => {
        x: () => Tensor4D;
    };
}
