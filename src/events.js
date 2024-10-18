export function addEventListener(eventName,handler,el){
    el.addEventListener(eventName, handler)
    return handler

}

export function addEventListeners(listeners = {},el){

    Object.entries(listeners).forEach(([eventName, handler])=>{
        const listener = addEventListener(eventName, handler,el)
        addEventListeners[eventName] = listener
    })

    return listeners
}