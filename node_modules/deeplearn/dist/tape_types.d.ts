import { NamedTensorMap } from './types';
import { Tensor } from './tensor';
import { Rank } from './types';
import { KernelConfigRegistry } from './kernels/kernel_registry';
export declare type Tape = Array<TapeNode<TapeNodeOutput>>;
export declare type TapeNodeOutput = Tensor | NamedTensorMap;
export declare type TapeNodeType = 'kernel' | 'customGradient';
export interface TapeNode<T extends TapeNodeOutput> {
    id: number;
    type: TapeNodeType;
    name: string;
    inputAndArgs: TapeNodeInputConfig;
    output: T;
    gradient: (dy: Tensor | NamedTensorMap, y: T) => TapeNodeInputGradientTensors;
}
export interface TapeNodeInputConfig {
    inputs: NamedTensorMap;
}
export declare type TapeNodeInputGradientTensors = {
    [inputName: string]: () => Tensor;
};
export interface KernelNode extends TapeNode<Tensor> {
    kernel: keyof KernelConfigRegistry<Rank>;
    inputAndArgs: KernelInputConfig;
    output: Tensor;
}
export interface KernelInputConfig extends TapeNodeInputConfig {
    inputs: NamedTensorMap;
    args?: {
        [argName: string]: any;
    };
}
