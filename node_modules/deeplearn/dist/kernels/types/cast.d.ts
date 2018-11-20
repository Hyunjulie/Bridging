import { KernelNode } from '../../tape_types';
import { Tensor } from '../../tensor';
import { DataType } from '../../types';
export interface CastNode extends KernelNode {
    inputAndArgs: {
        inputs: {
            x: Tensor;
        };
        args: {
            newDType: DataType;
        };
    };
    output: Tensor;
    gradient: (dy: Tensor, y: Tensor) => {
        x: () => Tensor;
    };
}
