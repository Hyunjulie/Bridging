import { TimingInfo } from './engine';
import { ScopeFn, ScopeResult } from './tape_util';
import { Tensor } from './tensor';
export declare class Tracking {
    static tidy<T extends ScopeResult>(nameOrFn: string | ScopeFn<T>, fn?: ScopeFn<T>, gradMode?: boolean): T;
    static keep<T extends Tensor>(result: T): T;
    static time(f: () => void): Promise<TimingInfo>;
}
