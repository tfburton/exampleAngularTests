import { interval, Observable } from 'rxjs';

export class IntervalService {
    public get10Seconds(): Observable<number> {
        return interval(10000);
    }

    public get1Minute(): Observable<number> {
        return interval(1000 * 60);
    }

    public getSomeTime(): Promise<void> {
        return interval(1000 * 60 * 60 * 24 * 365 * 62).toPromise().then(() => { });
    }
}
