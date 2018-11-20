import { KernelNode } from '../../tape_types';
import { Tensor4D } from '../../tensor';
export interface LRN4DNode extends KernelNode {
    inputAndArgs: {
        inputs: {
            x: Tensor4D;
        };
        args: {
            radius: number;
            bias: number;
            alpha: number;
            beta: number;
            normRegion: 'acrossChannels' | 'withinChannel';
        };
    };
    output: Tensor4D;
    gradient: (dy: Tensor4D, y: Tensor4D) => {
        x: () => Tensor4D;
    };
}
