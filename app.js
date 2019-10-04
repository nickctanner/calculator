const saved = document.querySelector('.saved');
const current = document.querySelector('.current');
const allClear = document.querySelector('.all-clear');
const clear = document.querySelector('.clear');
const enter = document.querySelector('.enter');
const enterBtn = document.querySelector('.enter');
const buttons = document.querySelector('.button-container');

 const state = {
     operation: '',
     memory: ''
 }

const evaluate = ({ operation, memory })=> {
  const evaluation = eval(operation);
  memory += evaluation;
  console.log(memory)
  return evaluation + memory;
}


buttons.addEventListener('click', e => {
    const button = e.target.value;
    switch(button) {
       case 'enter':
            console.log(evaluate(state))
            break;
       case 'clear':
          console.log('fuck');
          break;
        case 'all-clear':
            state.memory = '';
            break;
        default:
            state.operation += button;
            console.log(state.operation);
           break;
    }

    return state;
})
