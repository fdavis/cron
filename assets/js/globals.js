
// keep track of whether or not a mouse key is down
// stealing from this stack post http://stackoverflow.com/questions/322378/javascript-check-if-mouse-button-down
// my pageforward mouse button would only trigger mouseup events... so I set a min value of 0
// hopefully this would also protect against someone holding a mouse button down through page load, which may have triggered a mouseup accidentally

// another caveat...: if you press left mouse then right mouse, right brings up context menu which then hides the mouse up events from the document...
// so maybe this needs a reset of some kind? >.>
var mouseDown = 0;
$(document).mousedown( function() {
  ++mouseDown;
});
$(document).mouseup( function() {
  --mouseDown;
  if(mouseDown < 0) mouseDown = 0;
});


// should be loaded from weapons.json in the loader
var allTheWeapons = {};