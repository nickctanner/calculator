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
  operation: '',
  memory: '',
  evaluated: false,
  prevAnswer: '',
};

const combineEntryMethods = method => processEntry(method);

const handleNumberPadEntry = e => {
  e.preventDefault();
  clickedButtonDown(e.target);

  if (/[0-9-.\/+*]|Enter|Backspace|Delete/g.test(e.key)) {
    const key = e.key;
    combineEntryMethods(key);
  }
};

const clickedButtonDown = button => {
  button.classList.add('clicked-down');
};

const clickedButtonUp = e => {
  const button = e.target;
  button.classList.remove('clicked-down');
};

const handleClickedButtonEntry = e => {
  const button = e.target.value;
  if (button) {
    clickedButtonDown(e.target);
    combineEntryMethods(button);
  }
};

const formatDisplayedOperatorsInMemory = ({ memory }) => {
  const formattedMemory = memory.replace(/[^0-9.]/g, operator =>
    operator === '*' ? ` x ` : ` ${operator} `
  );
  return formattedMemory;
};

const formatCurrentDisplayedNumber = ({ operation }) => {
  const formattedNumber = operation.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  return formattedNumber;
};

const evaluate = ({ memory }) => {
  const evaluation = eval(memory);
  return evaluation;
};

function processEntry(entry) {
  if (typeof entry === 'string') {
    switch (entry) {
      case 'Enter':
      case 'opEnter':
        if (state.operation && !state.evaluated) {
          state.memory += state.operation;
          const evaluatedExpression = evaluate(state) || 0;
          state.operation = evaluatedExpression.toString();
          state.prevAnswer = formatCurrentDisplayedNumber(state);
          showCurrentEntry.textContent = state.prevAnswer;

          if (entry === 'Enter') {
            state.memory = '';
            state.evaluated = true;
          }

          let memory = formatDisplayedOperatorsInMemory(state);
          if (memory.length > 40) {
            showStoredMemory.style.fontSize = `1.3rem`;
          } else {
            showStoredMemory.style.fontSize = `1.8rem`;
          }

          showStoredMemory.textContent = memory;
        }
        break;

      case 'Backspace':
        state.operation = state.operation.slice(0, state.operation.length - 1);
        showCurrentEntry.textContent = formatCurrentDisplayedNumber(state);
        break;

      case 'Delete':
      case 'Clear':
        state.operation = '';
        showCurrentEntry.textContent = state.operation;
        break;

      case 'Clearall':
        state.memory = '';
        state.operation = '';
        showCurrentEntry.textContent = state.operation;
        showStoredMemory.textContent = state.memory;
        break;

      case '+':
      case '-':
      case '*':
      case '/':
        processEntry('opEnter');
        showCurrentEntry.textContent = state.prevAnswer;

        if (state.evaluated) {
          state.memory = state.operation + entry;
        }

        if (/[+-/*]/g.test(state.memory.slice(-1))) {
          state.memory = state.memory.slice(0, -1);
        }

        state.memory += entry;
        state.evaluated = false;
        state.operation = '';
        showStoredMemory.textContent = formatDisplayedOperatorsInMemory(state);
        break;

      default:
        if (state.evaluated) {
          state.operation = '';
          state.evaluated = false;
        }

        state.operation += entry;
        showCurrentEntry.textContent = formatCurrentDisplayedNumber(state);
        break;
    }
  }
}

window.addEventListener('keydown', handleNumberPadEntry);
window.addEventListener('keydown', clickedButtonUp);

buttons.addEventListener('mousedown', handleClickedButtonEntry);
buttons.addEventListener('mouseup', clickedButtonUp);
