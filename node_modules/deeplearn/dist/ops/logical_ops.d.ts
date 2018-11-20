import { Tensor } from '../tensor';
export declare class Ops {
    static logicalNot<T extends Tensor>(x: Tensor): T;
    static logicalAnd<T extends Tensor>(a: Tensor, b: Tensor): T;
    static logicalOr<T extends Tensor>(a: Tensor, b: Tensor): T;
    static logicalXor<T extends Tensor>(a: Tensor, b: Tensor): T;
    static where<T extends Tensor>(condition: Tensor, a: T, b: T): T;
}
