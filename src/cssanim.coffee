{getDoms, setTransform, css, camelize} = require "./helpers.coffee"

clear = (selector)->
    for dom in getDoms selector
        dom.style.cssText = ""

set = (selector, style, isNoMove)->
    doms = getDoms selector
    for dom in doms
        if isNoMove
            disableAnimation dom
            addDefaultTransform dom
            css dom, style
        else
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
        @forceStop = no
        @reset()
        @_loop()
        @
    _loop:  ->
        if @currentProgress is @seq.length or @forceStop
            @isRunning = no
            @forceStop = no
            doms = getDoms (@allSelectors.join ",")
            for dom in doms
                disableAnimation dom
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
        @isPause = no
        setTimeout => @reset()
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
        set state.selector, state.style, yes
        setTimeout cb
    else
        if not state.style.delay then _animate()
        else setTimeout _animate, state.style.delay * 1000

animate = (state, cb)->
    doms = getDoms state.selector
    for dom in doms
        enableAnimation dom, state.secs, state.style.ease
        css dom, state.style
    setTimeout ->
        cb?()
        state.style.onComplete?()
    , state.secs * 1000

enableAnimation = (dom, duration, ease)->
    ease = ease or "ease"
    addDefaultTransform dom
    dom.style.webkitBackfaceisibility = "hidden"
    dom.style.webkitPerspective = "1000"
    dom.style.webkitTransition = "all #{duration}s #{ease}"

addDefaultTransform = (dom)->
    if not /translateZ\(.+?\)/.test dom.style.webkitTransform
        dom.style.webkitTransform = "translateX(0) translateY(0) translateZ(0) rotateX(0deg) rotateY(0deg) rotateZ(0deg) scaleX(1) scaleY(1) scaleZ(1) skewX(0deg) skewY(0deg)"

disableAnimation = (dom)->
    dom.style.webkitTransition = ""
    dom.style.transition = ""

CSSAmination.set = set
CSSAmination.set = clear
module.exports = CSSAmination
