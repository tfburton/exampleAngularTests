import { Coin } from '../coins/coin';
import { Gumball } from './gumball';

export class GumballMachine {
    private currentTotalValue = 0;

    public acceptCoin(coin: Coin): void {
        this.currentTotalValue += coin.value;
    }

    public vendGumball(): Gumball {
        if (this.currentTotalValue >= 25) {
            return new Gumball();
        }
    }

    public displayCurrentValue(): string {
        return `$${(this.currentTotalValue / 100).toFixed(2)}`;
    }
}
