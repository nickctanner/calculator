const saved = document.querySelector(".saved");
const current = document.querySelector(".current");
const allClear = document.querySelector(".all-clear");
const clear = document.querySelector(".clear");
const enter = document.querySelector(".enter");
const enterBtn = document.querySelector(".enter");
const buttons = document.querySelector(".button-container");
const showCurrentEntry = document.querySelector(".current");
const showStoredMemory = document.querySelector(".saved");

const state = {
  operation: "",
  memory: "",
  evaluated: false
};

const evaluate = ({ memory }) => {
  const evaluation = eval(memory);
  return evaluation;
};

const combineEntryMethods = method => handleEntry(method);

const handleNumberPadEntry = e => {
  if (/[0-9-./+*]|Enter/g.test(e.key)) {
    const key = e.key === "Enter" ? "enter" : e.key;
    return combineEntryMethods(key);
  }
};

const handleClickedButtonEntry = e => {
  const button = e.target.value;
  if (button) return combineEntryMethods(button);
};

const formatDisplayedOperatorsInMemory = ({ memory }) => {
  const formattedMemory = memory.replace(/[^0-9.]/g, operator =>
    operator === "*" ? ` x ` : ` ${operator} `
  );
  return formattedMemory;
};

const formatCurrentDisplayedNumber = ({ operation }) => {
  const formattedNumber = operation
    .toString()
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  return formattedNumber;
};

function handleEntry(entry) {
  // console.log(entry);
  switch (entry) {
    case "enter":
    case "opEnter":
      if (state.operation && !state.evaluated) {
        state.memory += state.operation;
        const evaluatedExpression = evaluate(state) || state.operation;
        state.operation = evaluatedExpression;
        showCurrentEntry.textContent = formatCurrentDisplayedNumber(state);

        if (entry === "enter") {
          state.memory = "";
          state.evaluated = true;
        }

        showStoredMemory.textContent = formatDisplayedOperatorsInMemory(state);
      }
      break;

    case "clear":
      state.operation = "";
      showCurrentEntry.textContent = state.operation;
      break;

    case "allClear":
      state.memory = "";
      state.operation = "";
      showCurrentEntry.textContent = state.operation;
      showStoredMemory.textContent = state.memory;
      break;

    case "+":
    case "-":
    case "*":
    case "/":
      handleEntry("opEnter");

      showCurrentEntry.textContent = formatCurrentDisplayedNumber(state);
      console.log(state.operation);
      if (state.evaluated) {
        state.memory = state.operation + entry;
      }

      if (/[+-/*]/g.test(state.memory.slice(-1))) {
        state.memory = state.memory.slice(0, -1);
      }

      state.memory += entry;
      state.evaluated = false;
      state.operation = "";
      showStoredMemory.textContent = formatDisplayedOperatorsInMemory(state);
      break;

    default:
      if (state.evaluated) {
        state.operation = "";
        state.evaluated = false;
      }

      state.operation += entry;
      showCurrentEntry.textContent = formatCurrentDisplayedNumber(state);
      break;
  }
}

window.addEventListener("keypress", handleNumberPadEntry);
buttons.addEventListener("click", handleClickedButtonEntry);
