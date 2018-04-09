class NumberObject {
  /**
   * @param number {number}
   * @param source {{numbers: [NumberObject], operator: string}}}
   */
  constructor(number, source = null) {
    this.number = parseInt(number);
    this.source = source;
    this.generated = !!source;
  }
}

NumberObject.prototype.toString = function() {
  return this.number;
};

NumberObject.prototype.toInt = function() {
  return this.number;
};

export default NumberObject;