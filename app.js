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
  memory: ""
};

const evaluate = ({ operation }) => {
  const evaluation = eval(operation);
  return evaluation;
};

const handleNumPadEntry = e => {
  const keyValue = e.keyCode === 13 ? "enter" : String.fromCharCode(e.keyCode);
  if (!keyValue) return;

  return handleEntry(keyValue);
};

const handleClickedButtonEntry = e => {
  const button = e.target.value;
  if (!button) return;

  return handleEntry(button);
};

function handleEntry(entry) {
  switch (entry) {
    case "enter":
      const evaluatedExp = evaluate(state);
      showCurrentEntry.textContent = "";
      showStoredMemory.textContent = evaluatedExp;
      state.memory = evaluatedExp;
      state.operation = "";
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

    default:
      if (state.memory && /[^0-9]/g.test(entry) && !state.operation) {
        state.operation = state.memory;
      }
      state.operation += entry;
      const changeMultiplicationSignDisplay = state.operation.replace(
        /[*]/g,
        "x"
      );
      showCurrentEntry.textContent = changeMultiplicationSignDisplay;
      break;
  }
}

window.addEventListener("keypress", handleNumPadEntry);

buttons.addEventListener("click", handleClickedButtonEntry);
