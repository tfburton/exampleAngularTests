import { GumballMachine } from './gumball-machine';
import { Quarter } from '../coins/quarter';
import { Coin } from '../coins/coin';
import { Mock } from 'typemoq';
import { mock, when, instance } from 'ts-mockito';
import { Substitute } from '@fluffy-spoon/substitute';
import { Dime } from '../coins/dime';
import { Chance } from 'chance';
const chance = new Chance();

describe('GumballMachine', () => {
    let classUnderTest: GumballMachine;

    beforeEach(() => {
        classUnderTest = new GumballMachine();
    });

    describe('Vending Gumballs', () => {
        describe('Using a coin', () => {
            it('should accept coinage', () => {
                classUnderTest.acceptCoin(new Quarter());

                expect(classUnderTest.displayCurrentValue()).toBe('$0.25');
            });
        });

        describe('Stubbing a coin', () => {
            it('should accept coinage', () => {
                classUnderTest.acceptCoin({ value: 12 });
                // classUnderTest.acceptCoin({} as Coin);  This works, but the cast causes a loss of integrity

                expect(classUnderTest.displayCurrentValue()).toBe('$0.12');
            });
        });

        describe('Mocking a coin', () => {
            describe('mockito mock', () => {
                it('should accept coinage', () => {
                    const coin = mock<Coin>();
                    when(coin.value).thenReturn(11); // requires es6
                    classUnderTest.acceptCoin(instance(coin));

                    expect(classUnderTest.displayCurrentValue()).toBe('$0.11');
                });
            });

            describe('moq mock', () => {
                it('should accept coinage', () => {
                    const coin = Mock.ofType<Coin>();
                    coin.setup(x => x.value).returns(() => 44);
                    classUnderTest.acceptCoin(coin.object);

                    expect(classUnderTest.displayCurrentValue()).toBe('$0.44');
                });
            });

            describe('substitute mock', () => {
                it('should accept coinage', () => {
                    const coin = Substitute.for<Coin>();
                    coin.value.returns(34);
                    classUnderTest.acceptCoin(coin);

                    expect(classUnderTest.displayCurrentValue()).toBe('$0.34');
                });
            });
        });

        describe('randomizing values', () => {
            it('should accept coinage', () => {
                const coin = Substitute.for<Coin>();
                const coinValue = chance.integer({ max: 99, min: 1 });
                coin.value.returns(coinValue);
                classUnderTest.acceptCoin(coin);

                const asCents = coinValue / 100;
                const withDecimal = asCents.toFixed(2);
                const expected = `$${withDecimal}`;
                expect(classUnderTest.displayCurrentValue()).toBe(expected);
            });
        });

        describe('anti-patterns', () => {
            describe('mocking our unit', () => {
                it('should accept coinage', () => {
                    classUnderTest.displayCurrentValue = () => '$0.46';
                    classUnderTest.acceptCoin(new Dime());

                    expect(classUnderTest.displayCurrentValue()).toBe('$0.46');
                });
            });

            describe('jasmine spies', () => {
                it('should accept coinage', () => {
                    spyOn(classUnderTest, 'displayCurrentValue'); // access property by index BLEH!!!
                    classUnderTest.displayCurrentValue();

                    expect(classUnderTest.displayCurrentValue).toHaveBeenCalled(); // it is kind of nice to have assertions tied to the mock
                });
            });
        });

        describe('Vending', () => {
            describe('given exactly 25 cents of value', () => {
                beforeEach(() => {
                    classUnderTest.acceptCoin(new Quarter());
                });

                it('should dispense a gumball', () => {
                    const actual = classUnderTest.vendGumball();

                    expect(actual).toBeDefined();
                });

                it('should subtract from the totalValue', () => {
                    classUnderTest.acceptCoin(new Quarter());
                    classUnderTest.acceptCoin(new Quarter());
                    expect(classUnderTest.displayCurrentValue()).toBe('$0.75'); // assertion as part of arrangement

                    classUnderTest.vendGumball();

                    expect(classUnderTest.displayCurrentValue()).toBe('$0.50');
                });
            });

            describe('given more than 25 cents of value', () => {
                let value: number;

                beforeEach(() => {
                    value = chance.integer({ min: 26 });
                    classUnderTest.acceptCoin({ value });
                });

                it('should dispense a gumball', () => {
                    const actual = classUnderTest.vendGumball();

                    expect(actual).toBeDefined();
                });
            });

            describe('given less than 25 cents of value', () => {
                let value: number;

                beforeEach(() => {
                    value = chance.integer({ max: 24, min: 0 });
                    classUnderTest.acceptCoin({ value });
                });

                it('should dispense a gumball', () => {
                    const actual = classUnderTest.vendGumball();

                    expect(actual).toBeUndefined();
                });
            });
        });
    });
});

describe('FIX THE BUG', () => { });
