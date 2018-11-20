import { Tensor3D, Tensor4D } from '../tensor';
export declare class LRN {
    static localResponseNormalization<T extends Tensor3D | Tensor4D>(x: T, radius?: number, bias?: number, alpha?: number, beta?: number, normRegion?: 'acrossChannels' | 'withinChannel'): T;
}
