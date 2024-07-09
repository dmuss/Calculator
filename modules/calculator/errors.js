export class DivByZeroError extends TypeError {
  constructor(message) {
    super(message);
    this.name = "DivByZeroError";
  }
}

export class DisplayParseError extends RangeError {
  constructor(message, invalidValue) {
    super(message);
    this.name = "DisplayParseError";
    this.invalidValue = invalidValue;
  }
}
