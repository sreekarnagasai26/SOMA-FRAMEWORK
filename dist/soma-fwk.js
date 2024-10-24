function addEventListener(eventName,handler,el){
    el.addEventListener(eventName, handler);
    return handler
}
function addEventListeners(listeners = {},el){
    Object.entries(listeners).forEach(([eventName, handler])=>{
        const listener = addEventListener(eventName, handler,el);
        addEventListeners[eventName] = listener;
    });
    return listeners
}

function setAttributes(el, attrs){
    const {class:className, style, ...otherAttrs} = attrs;
    if(className){
        setClass(el,className);
    }
    if(style){
        Object.entries(style).forEach(([prop,value]) => {
            setStyle(el,prop,value);
        });
    }
    for(const [name,value] of Object.entries(otherAttrs)){
        setAttribute(el,name,value);
    }
}
function setClass(el, className){
 el.className = '';
 if(typeof className === 'string'){
    el.className = className;
 }
 if(Array.isArray(className)){
    el.classList.add(...className);
 }
}
function setStyle(el,name,value){
 el.style[name] = value;
}
function setAttribute(el,name,value){
if(value == null){
    removeAttribute(el,name);
}
else if(name.startsWith('data-')){
    el.setAttribute(name, value);
}
else {
    el[name] = value;
}
}

function mountDOM(vdom, parentE1){
    switch(vdom.type){
        case DOM_TYPES.TEXT : {
            createTextNode(vdom, parentE1);
            break
        }
        case DOM_TYPES.ELEMENT : {
            createElementNode(vdom, parentE1);
            break
        }
        case DOM_TYPES.FRAGMENT : {
            createFragmentNodes(vdom, parentE1);
            break
        }
        default:{
            throw new Error(`Can't mouunt DOM of type: ${vdom.type}`)
        }
    }
}
function createTextNode(vdom, parentE1){
    const {value} = vdom;
    const textNode = document.createTextNode(value);
     vdom.el = textNode;
    parentE1.append(textNode);
}
function createFragmentNodes(vdom,parentE1){
    const {children} = vdom;
    vdom.el = parentE1;
    children.forEach((child) => mountDOM(child, parentE1));
}
function createElementNode(vdom, parentE1){
    const {tag, props, children} = vdom;
    const element = document.createElement(tag);
    addProps(element,props, vdom);
    vdom.el = element;
    children.forEach((child) => mountDOM(child,element));
    parentE1.append(element);
}
function addProps(el,props,vdom){
    const {on:events, ...attrs} = props;
    vdom.listeners = addEventListeners(events, el);
    setAttributes(el, attrs);
}

const DOM_TYPES = {
    TEXT:'text',
    ELEMENT:'element',
    FRAGMENT:'fragment'
};
function h(tag,props={},children=[]){
return {
    tag,
    props,
    children: mapTextNodes(withoutNulls(children)),
    type:DOM_TYPES.ELEMENT
}
}
function withoutNulls(arr){
    return arr.filter((item) => item != null)
}
function mapTextNodes(children){
    return children.map((child) =>
    typeof child === 'string' ? hString(child) : child)
}
function hString(str){
    return {
        type:DOM_TYPES.TEXT,
        value:str
    }
}
function hfragment(vNodes){
    return {
        type: DOM_TYPES.FRAGMENT,
        children: mapTextNodes(withoutNulls(vNodes))
    }
}
const vdom = h('form',{class:'login-form',action:'login'},
            [h('input',{type:'text',name:'user'}),h('input',{type:'password',name:'pass'}),h('button',{on:{click:login}},['Login'])]);
mountDOM(vdom, document.body);

export { DOM_TYPES, h, hString, hfragment, mountDOM };
