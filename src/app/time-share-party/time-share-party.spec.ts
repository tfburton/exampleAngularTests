import { TimeShareParty } from './time-share-party';
import { IntervalService } from './interval-service';
import { cold } from 'jasmine-marbles';
import { Mock, IMock } from 'typemoq';
import { Advertisement } from './advertisement';
import { fakeAsync, flushMicrotasks } from '@angular/core/testing';
import { of, interval } from 'rxjs';

describe('A Time Share Party', () => {
    let classUnderTest: TimeShareParty;

    let mockIntervalService: IMock<IntervalService>;

    beforeEach(() => {
        mockIntervalService = Mock.ofType<IntervalService>();
        classUnderTest = new TimeShareParty(mockIntervalService.object);
    });

    describe('subscriptions', () => {
        describe('without accounting for async', () => {
            it('should run the assertion before the callbacks', () => {
                const threeMinutes = cold('-a-b-c-|', { a: 0, b: 1, c: 2 });
                mockIntervalService.setup(x => x.get1Minute()).returns(() => threeMinutes);

                classUnderTest.countTheWorldsSuckers();

                expect(classUnderTest.howManySuckersInTheWorld()).toBe(0);
            });
        });

        it('should add a sucker every minute', fakeAsync(() => {
            mockIntervalService.setup(x => x.get1Minute()).returns(() => of(1, 2, 3));

            classUnderTest.countTheWorldsSuckers();
            flushMicrotasks();

            expect(classUnderTest.howManySuckersInTheWorld()).toBe(3);
        }));
    });

    describe('Attend', () => {
        describe('with marbles', () => {
            it('should return a constant stream of advertisements', () => {
                const tenSecondInterval = cold('-a-b-c-|', { a: 0, b: 1, c: 2 });
                mockIntervalService.setup(x => x.get10Seconds()).returns(() => tenSecondInterval);

                const actual = classUnderTest.attend();
                expect(actual).toBeObservable(cold('-a-b-c-|', { a: new Advertisement(), b: new Advertisement(), c: new Advertisement() }));
            });
        });
    });

    describe('Getting a Free Vacation', () => {
        it('should eventually get me a free vacation', () => {
            mockIntervalService.setup(x => x.getSomeTime()).returns(() => Promise.resolve());

            classUnderTest.getFreeGift().then(vacation => {
                expect(vacation).toBeDefined();
            });
        });
    });
});
