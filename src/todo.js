import {createApp,h,hfragment} from '../dist/soma-fwk'
//defining the state
const state = {
    currentTodo : '',
    edit:{
        idx:null,
        originial:null,
        edited:null,
    },
    todos : ['walk the dog']
}
//defining the actions
const reducers = {
    'update-current-todo' : (state, currentTodo) => ({
        ...state,
        currentTodo
    }),
    'add-todo' : (state) => ({
        ...state,
        currentTodo:'',
        todos:[...state.todos, state.currentTodo]
    })
}
//definig the view
function App(state, emit){
    return hfragment([h('h1',{},['MyTODOs']),CreateTodo(state,emit), TodoList(state,emit)])
}

//createTodo component
function createTodo({currentTodo},emit){
    return h('div',{},[h('label', {for:'todo-input'},['New Todo']),h('input',{})])
}

