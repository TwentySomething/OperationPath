import './polyfill';
import * as Events from './Events';
import Dispatcher from './Dispatcher';
import * as Utility from './Utility';
import NumberObject from './Number';

class Core {
  /**
   * @param target    {number}
   * @param numbers   {number[]}
   * @param operators {string[]}
   * @param limit     {number}
   */
  constructor(target, numbers, operators = '*+'.split(''), limit = 10) {
    this.target = target;
    this.operators = operators;
    this.limit = limit;
    this.numbers = {};
    numbers.forEach(n => this.numbers[n] = new NumberObject(n));

    this.dispatcher = new Dispatcher();
  }

  /**
   * Extend numbers with operators
   * O(N^3)
   */
  static extendNumbers(target, numbers, operators) {
    Utility.combinationOrderedObject(numbers).some(numberPair => {
      return operators.some(operator => {
        let process = Core.process(numberPair, operator);
        if (process.valid && !numbers[process.result]) {
          numbers[process.result] = process.result;
          if (process.result >= target)
            return true;
        }
      });
    });

    return numbers;
  }

  /**
   * Do process
   * @param numbers   {NumberObject[]}
   * @param operator  {string}
   * @param reverse   {boolean}
   * @returns {{numbers: NumberObject[], operator: string, result: NumberObject, valid: boolean}} Recipe
   */
  static process(numbers, operator, reverse = false) {
    let first, second;

    if (operator === '/' || operator === '-') {
      first = Math.max(...numbers);
      second = Math.min(...numbers);
    }
    else {
      first = numbers[0];
      second = numbers[1];
    }

    const result = eval(`${first} ${operator} ${second}`) * (reverse ? -1 : 1);

    let recipe = {
      numbers,
      operator,
      valid: (operator === '/' ? Number.isInteger(result) : true),
    };

    if (recipe.valid)
      recipe.result = new NumberObject(result, {numbers, operator});

    return recipe;
  }

  solve(isSolved) {
    let run = true, limit = this.limit, currentResult;
    while(run && limit > 0) {
      this.numbers = Core.extendNumbers(
        this.target,
        this.numbers,
        this.operators
      );

      currentResult = this.numbers[Utility.chooseClosest(Object.keys(this.numbers), this.target)];
      this.dispatcher.dispatch(Events.PROGRESS, currentResult);

      run = !isSolved(currentResult);
      limit--;
    }

    this.dispatcher.dispatch(Events.DONE, currentResult);
  }

  /**
   * Add event listener
   * @param listener {String|Events}
   * @param callback {Function}
   * @returns {Core}
   */
  on(listener, callback) {
    this.dispatcher.addListener(listener, callback);
    return this;
  }
}

if (typeof module === 'undefined')
  window.OperationPath = Core;

export default Core;