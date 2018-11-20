import { Tensor } from './tensor';
import { RegularArray } from './types';
import { Tape, TapeNodeInputConfig } from './tape_types';
export declare function getFilteredNodesXToY(tape: Tape, xs: Tensor[], y: Tensor): Tape;
export declare function backpropagateGradients(tensorAccumulatedGradientMap: {
    [tensorId: number]: Tensor;
}, filteredTape: Tape): void;
export declare type ScopeResultImmediate = void | Tensor | RegularArray<Tensor> | {
    [key: string]: Tensor | Tensor[];
};
export declare type ScopeResult = ScopeResultImmediate | Promise<ScopeResultImmediate>;
export declare type ScopeFn<T extends ScopeResult> = () => T;
export declare function extractTensorsFromScopeResult(result: ScopeResultImmediate): Tensor[];
export declare function stripUndefinedInputsFromInputConfig(config: TapeNodeInputConfig): TapeNodeInputConfig;
