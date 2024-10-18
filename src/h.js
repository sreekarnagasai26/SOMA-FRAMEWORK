import { mountDOM } from "./mount"

export const DOM_TYPES = {
    TEXT:'text',
    ELEMENT:'element',
    FRAGMENT:'fragment'
}

export function h(tag,props={},children=[]){
return {
    tag,
    props,
    children: mapTextNodes(withoutNulls(children)),
    type:DOM_TYPES.ELEMENT
}
}

//rendering nodes only when a condition is met
function withoutNulls(arr){
    return arr.filter((item) => item != null)
}
// != instead of !== to remove both null and undefined

function mapTextNodes(){
    return children.map((child) => 
    typeof child === 'string' ? hString(child) : child)
}

export function hString(str){
    return {
        type:DOM_TYPES.TEXT,
        value:str
    }
}

export function hfragment(vNodes){
    return {
        type: DOM_TYPES.FRAGMENT,
        children: mapTextNodes(withoutNulls(vNodes))
    }
}

//Test
const vdom = h('form',{class:'login-form',action:'login'},
            [h('input',{type:'text',name:'user'}),h('input',{type:'password',name:'pass'}),h('button',{on:{click:login}},['Login'])])

mountDOM(vdom, document.body)