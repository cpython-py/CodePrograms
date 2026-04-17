import { useState } from 'react';
import './Calculator.css';

function Calculator() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDot = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const toggleSign = () => {
    setDisplay(String(-parseFloat(display)));
  };

  const inputPercent = () => {
    setDisplay(String(parseFloat(display) / 100));
  };

  const performOperation = (nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operator) {
      const currentValue = previousValue;
      let result: number;

      switch (operator) {
        case '+':
          result = currentValue + inputValue;
          break;
        case '-':
          result = currentValue - inputValue;
          break;
        case '×':
          result = currentValue * inputValue;
          break;
        case '÷':
          result = currentValue / inputValue;
          break;
        default:
          result = inputValue;
      }

      setDisplay(String(result));
      setPreviousValue(result);
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  };

  const calculate = () => {
    if (!operator || previousValue === null) return;

    const inputValue = parseFloat(display);
    let result: number;

    switch (operator) {
      case '+':
        result = previousValue + inputValue;
        break;
      case '-':
        result = previousValue - inputValue;
        break;
      case '×':
        result = previousValue * inputValue;
        break;
      case '÷':
        result = previousValue / inputValue;
        break;
      default:
        result = inputValue;
    }

    setDisplay(String(result));
    setPreviousValue(null);
    setOperator(null);
    setWaitingForOperand(true);
  };

  const buttons = [
    { label: 'AC', action: clear, className: 'function' },
    { label: '±', action: toggleSign, className: 'function' },
    { label: '%', action: inputPercent, className: 'function' },
    { label: '÷', action: () => performOperation('÷'), className: 'operator' },
    { label: '7', action: () => inputDigit('7') },
    { label: '8', action: () => inputDigit('8') },
    { label: '9', action: () => inputDigit('9') },
    { label: '×', action: () => performOperation('×'), className: 'operator' },
    { label: '4', action: () => inputDigit('4') },
    { label: '5', action: () => inputDigit('5') },
    { label: '6', action: () => inputDigit('6') },
    { label: '-', action: () => performOperation('-'), className: 'operator' },
    { label: '1', action: () => inputDigit('1') },
    { label: '2', action: () => inputDigit('2') },
    { label: '3', action: () => inputDigit('3') },
    { label: '+', action: () => performOperation('+'), className: 'operator' },
    { label: '0', action: () => inputDigit('0'), className: 'zero' },
    { label: '.', action: inputDot },
    { label: '=', action: calculate, className: 'operator' },
  ];

  return (
    <div className="calculator">
      <div className="calc-display">
        <span className="calc-value">{display}</span>
      </div>
      <div className="calc-buttons">
        {buttons.map((btn, i) => (
          <button
            key={i}
            className={`calc-btn ${btn.className || ''}`}
            onClick={btn.action}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Calculator;