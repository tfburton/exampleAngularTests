import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Advertisement } from './advertisement';
import { IntervalService } from './interval-service';
import { FreeVacation } from './free-vacation';

export class TimeShareParty {
    private suckersInTheWorld = 0;
    public constructor(
        private readonly intervalService: IntervalService,
    ) { }

    public attend(): Observable<Advertisement> {
        return this.intervalService.get10Seconds().pipe(switchMap(() => {
            return of(new Advertisement());
        }));
    }

    public howManySuckersInTheWorld(): number {
        return this.suckersInTheWorld;
    }

    public countTheWorldsSuckers(): void {
        this.intervalService.get1Minute().subscribe(() => {
            this.suckersInTheWorld++;
        });
    }

    public getFreeGift(): Promise<FreeVacation> {
        return this.intervalService.getSomeTime().then(() => {
            return new FreeVacation();
        });
    }
}
