import { BackendTimingInfo, KernelBackend } from './kernels/backend';
import { KernelConfigRegistry } from './kernels/kernel_registry';
import { ScopeResultImmediate } from './tape_util';
import { DataId, Tensor, Tensor3D, Variable } from './tensor';
import { NamedVariableMap, TypedArray } from './types';
import { Rank } from './types';
export declare type CustomGradientFunc<T extends Tensor> = (...args: Tensor[]) => {
    value: T;
    gradFunc: (dy: T) => Tensor | Tensor[];
};
export interface TensorManager {
    registerTensor(a: Tensor): void;
    registerVariable(v: Variable): void;
    disposeTensor(a: Tensor): void;
    memory(): {
        numDataBuffers: number;
        numBytes: number;
    };
}
export declare type MemoryInfo = {
    numTensors: number;
    numDataBuffers: number;
    numBytes: number;
    unreliable?: boolean;
};
export interface TimingInfo extends BackendTimingInfo {
    wallMs: number;
}
export declare class Engine implements TensorManager {
    backend: KernelBackend;
    private customBackend;
    safeMode: boolean;
    registeredVariables: NamedVariableMap;
    private refCounter;
    private nextTapeNodeId;
    private numBytes;
    private numTensors;
    private numDataBuffers;
    private activeTape;
    private gradientScopeCount;
    private customGradientDepth;
    private activeScope;
    private scopeStack;
    private profiler;
    constructor(backend: KernelBackend, customBackend: boolean, safeMode: boolean);
    executeKernel<R extends Rank, K extends keyof KernelConfigRegistry<R>, C extends KernelConfigRegistry<R>[K]['inputAndArgs']>(kernelName: K, config: C, grad?: KernelConfigRegistry<R>[K]['gradient']): KernelConfigRegistry<R>[K]['output'];
    registerTensor(a: Tensor | Variable): void;
    registerVariable(v: Variable): void;
    disposeTensor(a: Tensor): void;
    memory(): MemoryInfo;
    private shouldRecord();
    private addTapeNode(inputs, result, gradientsFunc);
    keep<T extends Tensor>(result: T): T;
    startScope(gradientsMode?: boolean): void;
    endScope(result: ScopeResultImmediate, gradientsMode?: boolean): void;
    dispose(): void;
    gradients<T extends Tensor>(f: () => T, xs: Tensor[], dy?: T, allowNoGradients?: boolean): {
        value: T;
        grads: Tensor[];
    };
    customGrad<T extends Tensor>(f: CustomGradientFunc<T>): (...args: Tensor[]) => T;
    write(dataId: DataId, values: TypedArray): void;
    readSync(dataId: DataId): TypedArray;
    read(dataId: DataId): Promise<TypedArray>;
    fromPixels(pixels: ImageData | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement, numChannels: number): Tensor3D;
    time(query: () => void): Promise<TimingInfo>;
    private track<T>(result);
}
