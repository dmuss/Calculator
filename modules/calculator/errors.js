export class DivideByZeroError extends TypeError {
  constructor(message) {
    super(message);
    this.name = "DivByZeroError";
  }
}

export class DisplayParseError extends RangeError {
  constructor(message) {
    super(message);
    this.name = "DisplayParseError";
  }
}
