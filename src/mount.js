import { DOM_TYPES } from "./h";


export function mountDOM(vdom, parentE1){
    switch(vdom.type){
        case DOM_TYPES.TEXT : {
            createTextNode(vdom, parentE1)
            break
        }
        case DOM_TYPES.ELEMENT : {
            createElementNode(vdom, parentE1)
            break
        }
        case DOM_TYPES.FRAGMENT : {
            createFragmentNodes(vdom, parentE1)
            break
        }
        default:{
            throw new Error(`Can't mouunt DOM of type: ${vdom.type}`)
        }
    }
}

//createTextNode()
function createTextNode(vdom, parentE1){
    const {value} = vdom

    const textNode = document.createTextNode(value)
     vdom.el = textNode// reference for DOM node

    parentE1.append(textNode)
}

//create fragment Nodes
function createFragmentNodes(vdom,parentE1){
    const {children} = vdom
    vdom.el = parentE1

    children.forEach((child) => mountDOM(child, parentE1))
}
//create Element Nodes

function createElementNode(vdom, parentE1){
    const {tag, props, children} = vdom

    const element = document.createElement(tag)
    addProps(element,props, vdom)
    vdom.el = element

    children.forEach((child) => mountDOM(child,element))
    parentE1.append(element)
}

function addProps(el,props,vdom){
    const {on:events, ...attrs} = props
    vdom.listeners = addEventListeners(events, el)
    setAttributes(el, attrs)
}


export function destroyDOM(vdom){
    const {type} = vdom;

    switch(type){
        case DOM_TYPES.TEXT : {
            removeTextNode(vdom)
            break
        }

        case DOM_TYPES.ELEMENT : {
            removeElementNode(vdom)
            break
        }

        case DOM_TYPES.FRAGMENT : {
            removeFragmentNodes(vdom)
            break
        }

        default : {
            throw new Error(`cant destroy DOM of type: ${type}`)
        }
    }
}

function removeTextNode(vdom){
 const {el} = vdom
 el.remove()
}

function removeElementNode(vdom){
const {el,children,listeners} = vdom

el.remove()
children.forEach(destroyDOM)

if(listeners){
    removeEventListeners(listeners,el)
    delete vdom.listeners
}
}

function removeEventListeners(listeners = {}, el){
    Object.entries(listeners).forEach(([eventName, handler]) => {
        el.removeEventListener(eventName,handler)
    })
}


function removeFragmentNodes(vdom){
  const {children} = vdom
  children.forEach(destroyDOM)
}