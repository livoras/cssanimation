{getDoms, setTransform, css, camelize} = require "./helpers.coffee"

clear = (selector)->
    for dom in getDoms selector
        dom.style.cssText = ""

set = (selector, style)->
    doms = getDoms selector
    for dom in doms
        css dom, style

class CSSAmination
    constructor: ->
        @seq = []
        @labels = {}
        @allSelectors = []
    to: (selector, secs, style, label)->
        @_addSelector selector
        animationObj = {selector, secs, style}
        if label
            if @labels[label] then @labels[label].push animationObj
            else 
                @labels[label] = [animationObj]
                @seq.push label
        else
            @seq.push animationObj
        @
    set: (selector, style, label)->
        @_addSelector selector
        cssObj = {selector, style}
        if label
            if @labels[label] then @labels[label].push cssObj
            else 
                @labels[label] = [cssObj]
                @seq.push label
        else
            @seq.push cssObj
        @
    delay: (secs)->
        @seq.push secs
        @
    call: (fn)->
        @seq.push fn
        @
    start: ->
        if @isRunning then return
        @isRunning = yes
        @currentProgress = 0
        @_loop()
        @
    _loop:  ->
        if @currentProgress is @seq.length or @forceStop
            @isRunning = no
            @forceStop = no
            return
        if @isPause then return
        state = @seq[@currentProgress]
        @currentProgress++
        type = typeof state
        _loop = => @_loop()
        if type is "number"
            setTimeout _loop, state * 1000
        else if type is "function"
            state()
            _loop()
        else if type is "string"
            max = 0
            delay_max = 0
            for state in @labels[state]
                max = if state.secs > max then state.secs else max 
                delay_max = if state.style.delay > delay_max then state.style.delay else delay_max 
                setOrAnimate state
            console.log delay_max + max
            setTimeout _loop, (delay_max + max) * 1000
        else if type is "object"
            setOrAnimate state, _loop

    pause: ->
        @isPause = yes
        @

    resume: ->
        if not @isPause then return
        @isPause = no
        @_loop()
        @

    stop: (isReset)->
        @forceStop = yes
        @isRunning = no
        @reset()
        @

    reset: ->
        selector = @allSelectors.join ", "
        clear selector
        @

    _addSelector: (selector)->
        if selector not in @allSelectors
            @allSelectors.push selector

setOrAnimate = (state, cb)->
    _animate = -> animate state, cb
    if not state.secs
        set state.selector, state.style
        cb?()
    else
        if not state.style.delay then _animate()
        else setTimeout _animate, state.style.delay * 1000

animate = (state, cb)->
    doms = getDoms state.selector
    for dom in doms
        enableAnimation dom, state.secs, state.style.ease
        style = processStateToStyle state.style
        css dom, style
    setTimeout ->
        for dom in doms
            disableAnimation dom
        cb?()
        state.style.onComplete?()
    , state.secs * 1000

enableAnimation = (dom, duration, ease)->
    ease = ease or "ease"
    if not /translateZ\(.+?\)/.test dom.style.webkitTransfom
        dom.style.webkitTransfom += " translateZ(0px)"
    dom.style.webkitBackfaceVisibility = "hidden"
    dom.style.webkitPerspective = "1000"
    dom.style.webkitTransition = "all #{duration}s #{ease}"

disableAnimation = (dom)->
    dom.style.webkitTransition = ""
    dom.style.transition = ""

processStateToStyle = (style)->
    style

CSSAmination.set = set
module.exports = CSSAmination
