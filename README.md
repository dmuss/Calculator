# CALCULATOR

A solution to the [Odin Project's](https://www.theodinproject.com) calculator [assignment](https://www.theodinproject.com/lessons/foundations-calculator).

Try it here: https://dmuss.github.io/Calculator

## Note

- This assignment is meant to demonstrate some knowledge of JavaScript, HTML, and CSS. It is not fully mathematically accurate. When values will not fit the visual display of the calculator, they will be roughly rounded and trimmed to fit.
- The calculator is not responsive and is unlikely to render well on mobile devices.

## How to Use

The calculator has basic keyboard support and its buttons can be clicked.

### Keyboard Hotkeys

| Key(s)                  | Function                                      |
|:------------------------|:----------------------------------------------|
| `0` through `9`         | Presses a number button                       |
| `+` `-` `*` `/`         | Presses an operator button                    | 
| `.` or `,`              | Presses the decimal button                    |
| `=` or `Enter`          | Presses the equals button                     |
| `Escape`                | Presses `AC` and resets the calculator        |
| `Delete`                | Presses `C` and clears the current display    |
| `Backspace`             | Removes the last-entered digit on the display |
| `s` or `S`              | Changes the sign of the current display       |
| `t` or `T`              | Toggles the colour theme                      |

## Assignment Requirements and Notes

- [X] Contains functions for four basic math arithmetic operations (add, subtract, multiply, divide).
- [X] Calculator operation consists of two operands and an operator (e.g., 3 + 5).
- [X] An `operate` function takes those operands and operator and calls one the appropriate arithmetic functions.
- [X] HTML calculator contains buttons for each digit, operators, and an equals key.
- [X] Functions that populate display when you click buttons.
- [X] Calculator should not evaluate more than a single pair of numbers at a time. For example, if you enter a number (`12`) followed by an operator button (`+`), a second number (`7`), and finally a second operator (`-`), the calculator evaluates `12 + 7 = 19` and displays the result of that calculation as the first operand of the next calculation (`19 -`).
    - This behaviour felt awkward and sometimes intrusive when the second number was `0`. Inadvertently dividing by zero causes an error, multiplying by zero just returns zero, and the plus and minus operators don't do anything. Instead, the calculator will only execute evaluation in this scenario when the display contains a non-zero number. Otherwise, it just updates the current operator.
- [X] Answers that don't fit the calculator's display are rounded to avoid overflow.
    - Numbers that don't fit the display are converted to [E notation](https://en.wikipedia.org/wiki/Scientific_notation#E_notation) for display but still stored as complete numbers, where possible. 
- [X] Pressing `=` before entering all the numbers should not cause problems.
    - Pressing `=` will not execute evaluation unless the first operand and operator are set and the display currently holds a non-zero number.
- [X] Pressing "clear" should wipe out any existing data stored in the calculator.
    - `AC` button wips out existing data, while `C` button just clears current display.
- [X] Displays an error if user tries to divide by zero and doesn't crash.
    - An error dialog modal shows users errors.

### Extra Credit
- [X] Add a `.` button to allow users to input decimals.
- [X] Users can't enter more than one decimal point.
- [X] Style the calculator with CSS.
    - Calculator can be toggled between two colour themes that remain persistent between sessions.
- [X] Add a "backspace" button.
- [X] Add keyboard support.
