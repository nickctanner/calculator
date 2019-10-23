const saved = document.querySelector('.saved');
const current = document.querySelector('.current');
const allClear = document.querySelector('.all-clear');
const clear = document.querySelector('.clear');
const enter = document.querySelector('.enter');
const enterBtn = document.querySelector('.enter');
const buttons = document.querySelector('.op-container');
const showCurrentEntry = document.querySelector('.current');
const showStoredMemory = document.querySelector('.saved');

const state = {
  currOperation: '',
  operator: '',
  memory: '',
  prevAnswer: '',
  hasBeenEvaluated: false,
};

const combineEntryMethods = method => processEntry(method);

const handleNumberPadEntry = e => {
  e.preventDefault();

  if (/[0-9-.\/+*%]|Enter|Backspace|Delete|Percent/g.test(e.key)) {
    const key = e.key;
    buttons.childNodes.forEach(node => {
      if (node.value === key) {
        addClickedButtonClass(node);
      }
    });
    combineEntryMethods(key);
  }
};

const handleClickedButtonEntry = e => {
  const button = e.target.value;
  if (button) {
    addClickedButtonClass(e.target);
    combineEntryMethods(button);
  }
};

const handleRemoveClickedButtonClass = e => {
  if (e.type === 'mouseup') {
    const button = e.target;
    removeClickedButtonClass(button);
  } else {
    const key = e.key;
    buttons.childNodes.forEach(node => {
      if (node.value === key) {
        removeClickedButtonClass(node);
      }
    });
  }
};

const addClickedButtonClass = button => button.classList.add('clicked');

const removeClickedButtonClass = button => {
  button.classList.remove('clicked');
};

const formatDisplayedMemory = ({ memory }) => {
  const formattedMemory = memory.replace(/[^0-9.]/g, operator =>
    operator === '*' ? ` x ` : ` ${operator} `
  );
  const maxCharacters = 40;
  const isSmallScreen = window.screen.width < 481;

  if (formattedMemory.length > maxCharacters || isSmallScreen) {
    showStoredMemory.style.fontSize = `1.3rem`;
  } else {
    showStoredMemory.style.fontSize = `1.8rem`;
  }

  return formattedMemory;
};

const formatCurrentDisplayedNumber = ({ currOperation }) => {
  const formattedNumber = currOperation.replace(
    /(\d)(?=(\d{3})+(?!\d))/g,
    '$1,'
  );

  const maxCharacters = 16;
  const isSmallScreen = window.screen.width < 481;
  if (formattedNumber.length > maxCharacters || isSmallScreen) {
    showCurrentEntry.style.fontSize = `2.7rem`;
  } else {
    showCurrentEntry.style.fontSize = `3.3rem`;
  }

  return formattedNumber;
};

const convertPercent = ({ currOperation, prevAnswer }) => {
  const percentValue = +currOperation / 100;
  const percentage = prevAnswer ? prevAnswer * percentValue : percentValue;
  return percentage;
};

const evaluateExpression = ({ prevAnswer, currOperation, operator }) => {
  prevAnswer = +prevAnswer;
  currOperation = +currOperation;

  switch (operator) {
    case '+':
      return prevAnswer + currOperation;
    case '-':
      return prevAnswer - currOperation;
    case '*':
      return prevAnswer * currOperation;
    case '/':
      return prevAnswer / currOperation;
  }
};

function processEntry(entry) {
  if (typeof entry === 'string') {
    switch (entry) {
      case 'Enter':
      case 'opEnter':
        if (state.currOperation && !state.hasBeenEvaluated) {
          const evaluatedResult = evaluateExpression(state);
          state.currOperation = evaluatedResult.toString();
          state.prevAnswer = state.currOperation;
          showCurrentEntry.textContent = formatCurrentDisplayedNumber(state);

          if (entry === 'Enter') {
            state.memory = '';
            state.prevAnswer = '';
          }

          state.hasBeenEvaluated = true;
          showStoredMemory.textContent = state.memory;
        }
        break;

      case 'Backspace':
        state.currOperation = state.currOperation.slice(
          0,
          state.currOperation.length - 1
        );

        if (!state.memory) state.operator = '';

        showCurrentEntry.textContent = formatCurrentDisplayedNumber(state);
        break;

      case 'Delete':
      case 'Clear':
        state.currOperation = '';

        if (!state.memory) state.operator = '';

        showCurrentEntry.textContent = state.currOperation;
        break;

      case 'Clearall':
        state.memory = '';
        state.currOperation = '';
        state.operator = '';
        state.prevAnswer = '';
        state.hasBeenEvaluated = false;
        showCurrentEntry.textContent = state.currOperation;
        showStoredMemory.textContent = state.memory;
        break;

      case '%':
        state.currOperation = convertPercent(state).toString();
        showCurrentEntry.textContent = formatCurrentDisplayedNumber(state);
        break;

      case '+':
      case '-':
      case '*':
      case '/':
        if (!state.memory && !state.currOperation && !state.prevAnswer) return;

        if (state.currOperation) state.memory += state.currOperation + entry;

        const lastCharInMemoryIsOperator = /[+-/*]/g.test(
          state.memory.slice(-1)
        );

        if (lastCharInMemoryIsOperator) {
          state.memory = state.memory.slice(0, state.memory.length - 1) + entry;
        }

        if (state.operator) {
          combineEntryMethods('opEnter');
        }

        state.operator = entry;
        state.prevAnswer = state.currOperation || state.prevAnswer;
        state.currOperation = '';
        showStoredMemory.textContent = formatDisplayedMemory(state);
        break;

      default:
        state.currOperation += entry;
        state.hasBeenEvaluated = false;
        showCurrentEntry.textContent = formatCurrentDisplayedNumber(state);
        break;
    }
  }
}

window.addEventListener('keydown', handleNumberPadEntry);
window.addEventListener('keyup', handleRemoveClickedButtonClass);

buttons.addEventListener('mousedown', handleClickedButtonEntry);
buttons.addEventListener('mouseup', handleRemoveClickedButtonClass);
