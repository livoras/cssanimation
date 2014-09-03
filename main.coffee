CSSAmination = require "./src/cssanim.coffee"
tl = new CSSAmination
# CSSAmination.set ".box", {
#     "width": "50px",
#     "height": "50px",
#     "border": "1px solid #ccc"
#     "position": "fixed" 
#     "top": "0px"
#     "left": "0px"
# }

tl = new CSSAmination 
tl.to ".box", 0.5, {x: 50, y: 200, scaleX: 1, scaleY: 1, "background-color": "red", "rotationZ": 360} 
  .to ".box", 0.5, {"opacity": "0", x: 50, "background-color": "blue"}
  .call => console.log "FUCK"
  .to ".box", 1, {"opacity": "1", x: 100, y: 0}
  .to ".box1", 0.5, {y: 200, "background-color": "yellow", scaleX: 1.5, scaleY: 1.5}, "fuck"
  .to ".box2", 0.3, {y: 400, "background-color": "green", scaleX: 2, scaleY: 2, delay: 0.1}, "fuck"
  .to ".box", 1, {x: 200}
  .delay 2
  .to ".box2", 1, {x: 150, rotationZ: -720, "border-radius": "100px"}
  .set ".box2", {"border": "10px solid #ccc"}
  .delay 2
  .to ".box1", 1, {x: 100, skewX: 30}
  .delay 2
  .to ".box3", 1, {x: 50, onComplete: -> console.log "fuck--"}
  .to ".box", 1, {skewX: -30, scaleY: 0, scaleX:0, x: 0, y: 0}
  .call => setTimeout -> tl.start()
# tl.set ".box2", {x: 200, y: 200}
#   .to ".box2", 0.5, {opacity: 1}
#   .to ".box2", 0.5, {opacity: 1, rotationz: 720, scaleY: 3, scaleX: 3, "background-color": "red", "border-radius": "100px"}
#   .to ".box2", 0.3, {scaleX: 1, scaleY: 1}
#   .to ".box2", 0.2, {scaleX: 1.5, scaleY: 1.5}
#   .to ".box2", 0.3, {scaleX: 0.7, scaleY: 0.7}
#   .to ".box2", 0.2, {scaleX: 1, scaleY: 1, x: 0, y: 0}

tl.start()

document.getElementById("start").addEventListener "click", -> tl.start()
document.getElementById("stop").addEventListener "click", -> tl.stop()
document.getElementById("pause").addEventListener "click", -> tl.pause()
document.getElementById("resume").addEventListener "click", -> tl.resume()

