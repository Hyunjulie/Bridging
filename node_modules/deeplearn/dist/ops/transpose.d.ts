import { Tensor } from '../tensor';
import { Rank } from '../types';
export declare class Ops {
    static transpose<R extends Rank>(x: Tensor<R>, perm?: number[]): Tensor<R>;
}
