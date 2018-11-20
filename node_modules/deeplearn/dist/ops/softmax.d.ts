import { Tensor } from '../tensor';
export declare class Ops {
    static softmax<T extends Tensor>(logits: T, dim?: number): T;
    static softmaxCrossEntropy<T extends Tensor, O extends Tensor>(labels: T, logits: T, dim?: number): O;
}
