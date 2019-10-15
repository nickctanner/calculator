const saved = document.querySelector('.saved');
const current = document.querySelector('.current');
const allClear = document.querySelector('.all-clear');
const clear = document.querySelector('.clear');
const enter = document.querySelector('.enter');
const enterBtn = document.querySelector('.enter');
const buttons = document.querySelector('.button-container');
const showCurrentEntry = document.querySelector('.current');
const showStoredMemory = document.querySelector('.saved');

const state = {
  operation: '',
  memory: '',
  evaluated: false,
};

const evaluate = ({ memory }) => {
  const evaluation = eval(memory);
  return evaluation;
};

// TODO: fix 'ENTER' bug from keyboard entry

const handleNumPadEntry = e => {
  if (e.keyCode === 13 || (e.keyCode < 60 && e.keyCode > 40)) {
    const keyValue = String.fromCharCode(e.keyCode);

    return handleEntry(keyValue);
  }
};

const handleClickedButtonEntry = e => {
  const button = e.target.value;
  if (!button) return;

  return handleEntry(button);
};

function handleEntry(entry) {
  switch (entry) {
    case 'enter':
      if (state.operation) {
        state.memory += state.operation;
        const evaluatedExp = evaluate(state) || state.operation;
        state.memory = '';
        state.operation = evaluatedExp;
        showCurrentEntry.textContent = state.operation;
        showStoredMemory.textContent = state.memory;
        state.evaluated = true;
      }
      break;

    case 'clear':
      state.operation = '';
      showCurrentEntry.textContent = state.operation;
      break;

    case 'allClear':
      state.memory = '';
      state.operation = '';
      showCurrentEntry.textContent = state.operation;
      showStoredMemory.textContent = state.memory;
      break;

    case '+':
    case '-':
    case '*':
    case '/':
      if (state.operation) {
        handleEntry('enter');
        state.memory = state.operation + entry;
        state.evaluated = false;
        state.operation = '';
        showCurrentEntry.textContent = '';
      } else {
        let lastChar = state.memory.slice(-1);
        state.memory = state.memory.replace(lastChar, entry);
      }

      const formatOperators = state.memory.replace(/[^0-9.]/g, operator =>
        operator === '*' ? ` x ` : ` ${operator} `
      );
      showStoredMemory.textContent = formatOperators;
      break;

    default:
      if (state.evaluated) {
        state.operation = '';
        state.evaluated = false;
      }
      state.operation += entry;

      showCurrentEntry.textContent = state.operation;
      break;
  }
}

window.addEventListener('keypress', handleNumPadEntry);
buttons.addEventListener('click', handleClickedButtonEntry);
