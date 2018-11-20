import { BackendTimer } from './kernels/backend';
import { Kernel } from './kernels/kernel_registry';
import { Tensor } from './tensor';
import { TypedArray } from './types';
export declare class Profiler {
    private backendTimer;
    private logger;
    constructor(backendTimer: BackendTimer, logger?: Logger);
    profileKernel<T extends Tensor>(kernelName: Kernel, f: () => T): T;
}
export declare class Logger {
    logKernelProfile(kernelName: Kernel, result: Tensor, vals: TypedArray, timeMs: number): void;
}
