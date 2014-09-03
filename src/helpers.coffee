getDoms = (selector)->
    if typeof selector is "string"
        doms = document.querySelectorAll selector
        if not doms then throw "#{selector} is empty"
        doms = [].slice.call doms, 0
    else if selector[0]
        doms = [selector[0]]
    doms

css = (dom, style)->
    if style.transformOrigin
        dom.style["webkitTransformOrigin"] = style.transformOrigin
    else
        dom.style["webkitTransformOrigin"] = ""
        dom.style["transformOrigin"] = ""

    for key, value of style
        if key in ["x", "y", "z", "rotationX", "rotationY", "rotationZ", "skewY", "skewX", "scaleX", "scaleY", "scaleZ"]
            setTransform dom, key, value
        else 
            key = camelize key
            if key of dom.style then dom.style[key] = value

camelize = (str)->
    str.replace /-+(.)?/g, (match, chr)->
        if chr then chr.toUpperCase() else ""

setTransform = (dom, key, value)->
    transformStr = dom.style.webkitTransform
    if key is "x"
        REG = /translateX\(.+?\)/
        if REG.test transformStr
            dom.style.webkitTransform = transformStr.replace REG, "translateX(#{value}px)"
        else
            dom.style.webkitTransform += " translateX(#{value}px)"
        return

    if key is "y"
        REG = /translateY\(.+?\)/
        if REG.test transformStr
            dom.style.webkitTransform = transformStr.replace REG, "translateY(#{value}px)"
        else
            dom.style.webkitTransform += " translateY(#{value}px)"
        return

    if key is "z"
        REG = /translateZ\(.+?\)/
        if REG.test transformStr
            dom.style.webkitTransform = transformStr.replace REG, "translateZ(#{value}px)"
        else
            dom.style.webkitTransform += " translateZ(#{value}px)"
        return

    if key is "rotationX"
        REG = /rotateX\(.+?\)/
        if REG.test transformStr
            dom.style.webkitTransform = transformStr.replace REG, "rotateX(#{value}deg)"
        else
            dom.style.webkitTransform += " rotateX(#{value}deg)"
        return

    if key is "rotationY"
        REG = /rotateY\(.+?\)/
        if REG.test transformStr
            dom.style.webkitTransform = transformStr.replace REG, "rotateY(#{value}deg)"
        else
            dom.style.webkitTransform += " rotateY(#{value}deg)"
        return

    if key is "rotationZ"
        REG = /rotateZ\(.+?\)/
        if REG.test transformStr
            dom.style.webkitTransform = transformStr.replace REG, "rotateZ(#{value}deg)"
        else
            dom.style.webkitTransform += " rotateZ(#{value}deg)"
        return

    if key is "scaleX"
        REG = /scaleX\(.+?\)/
        if REG.test transformStr
            dom.style.webkitTransform = transformStr.replace REG, "scaleX(#{value})"
        else
            dom.style.webkitTransform += " scaleX(#{value})"
        return

    if key is "scaleY"
        REG = /scaleY\(.+?\)/
        if REG.test transformStr
            dom.style.webkitTransform = transformStr.replace REG, "scaleY(#{value})"
        else
            dom.style.webkitTransform += " scaleY(#{value})"
        return

    if key is "scaleZ"
        REG = /scaleZ\(.+?\)/
        if REG.test transformStr
            dom.style.webkitTransform = transformStr.replace REG, "scaleZ(#{value})"
        else
            dom.style.webkitTransform += " scaleZ(#{value})"
        return

    if key is "skewX"
        REG = /skewX\(.+?\)/
        if REG.test transformStr
            dom.style.webkitTransform = transformStr.replace REG, "skewX(#{value}deg)"
        else
            dom.style.webkitTransform += " skewX(#{value}deg)"
        return

    if key is "skewY"
        REG = /skewY\(.+?\)/
        if REG.test transformStr
            dom.style.webkitTransform = transformStr.replace REG, "skewY(#{value}deg)"
        else
            dom.style.webkitTransform += " skewY(#{value}deg)"
        return

module.exports = {getDoms, setTransform, css, camelize}