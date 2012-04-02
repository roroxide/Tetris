(function($){
  jQuery.fn.tetrisSetup = function(options) {
    var myOptions = jQuery.extend({
	  boardWidth: 15,
	  boardHeight: 20,
	  boardColor: '#aaf',
	  boardBorder: '1px solid green',
	  fallSpeed: 0,
	  cellWidth: 12,
	},options);
	jQuery.fn.myOptions = myOptions;
	$('<div id="tetrisBoard" style="position:absolute;display:none;left:0;top:0;"></div>')
	.css("width", (myOptions.cellWidth*myOptions.boardWidth)+"px")
	.css("height", (myOptions.cellWidth*myOptions.boardHeight)+"px")
	.css("background-color", myOptions.boardColor)
	.css("border", myOptions.boardColor)
	.css("overflow", "hidden")
	.appendTo($(this));
	for(var y=0; y<myOptions.boardHeight; y++) {
	  for (var x=0; x<myOptions.boardWidth; x++) {
	    $('<div class="tetrisbox" id="tetrisbox'+(y*myOptions.boardWidth+x)+'" style="position:absolute;display:none;"></div>')
	    .css("left", (x*myOptions.cellWidth)+"px")
	    .css("top", (y*myOptions.cellWidth)+"px")
	    .css({"border": "1px solid #000", "background-color": "yellow"})
	    .css("width", (myOptions.cellWidth-2)+"px")
	    .css("height",(myOptions.cellWidth-2)+"px")
		.appendTo("#tetrisBoard");
	  }
	}
	$('<div id="tetrisScore" style="font-weight:bold;font-family:arial;position:absolute;left:0;height:20px;text-align:center;">Score : 0</div>')
	.css("width", (myOptions.cellWidth*myOptions.boardWidth)+"px")
	.css("background-color", "#ddd")
	.css("top", ((myOptions.cellWidth+1)*myOptions.boardHeight)+"px").appendTo($(this));
	$('<div id="tetrisNext" style="position:absolute;top:0;"></div>')
	.css("left", (myOptions.cellWidth*myOptions.boardWidth+10)+"px")
	.css("width", (myOptions.cellWidth*4)+"px")
	.css("height", (myOptions.cellWidth*4)+"px")
	.css("background-color", "#faf")
	.appendTo($(this))
	for(var y=0; y<4; y++) {
	  for (var x=0; x<4; x++) {
	    $('<div class="tetrisnext" id="tetrisnext'+(y*4+x)+'" style="position:absolute;display:none;"></div>')
	    .css("left", (x*myOptions.cellWidth)+"px")
	    .css("top", (y*myOptions.cellWidth)+"px")
	    .css({"border": "1px solid #000", "background-color": "yellow"})
	    .css("width", (myOptions.cellWidth-2)+"px")
	    .css("height",(myOptions.cellWidth-2)+"px")
		.appendTo("#tetrisNext");
	  }
	}
	$('<div id="tetrisHelp" style="position:absolute; text-align:left; padding:2px; background-color:#ffa">'+
	  'use :<br/>'+
	  ' &nbsp; <b>arrows</b> to move and rotate<br />'+
	  ' &nbsp; <b>enter</b>/<b>space</b> to fall down,<br />'+
	  ' &nbsp; <b>t</b> to try again,<br />'+
	  ' &nbsp; <b>p</b> to pause and continue.'+
	  '</div>')
	.css("left", (myOptions.cellWidth*myOptions.boardWidth+10)+"px")
	.css("top", (myOptions.cellWidth*4+10)+"px").appendTo($(this));
	
	// start render indexes
  var shapeMap = [];
  for (var i=0; i<jQuery.fn.tetrisShapes.length; i++) {
    shapeMap = jQuery.fn.tetrisShapes[i].map.split("\n");
    for (var y=0; y<shapeMap.length; y++) {
      r = -1;
      for (var x=0; x<shapeMap[y].length; x++) {
         if (shapeMap[y].substr(x,1) == 'o') {
		  if (r==-1) {
		    jQuery.fn.tetrisShapes[i].lIndexes[jQuery.fn.tetrisShapes[i].lIndexes.length]=y*myOptions.boardWidth +x-1;
		  }
		  r = x;
		  jQuery.fn.tetrisShapes[i].indexes[jQuery.fn.tetrisShapes[i].indexes.length] = y*myOptions.boardWidth + x;
		  if (y == shapeMap.length-1 ) {
		    jQuery.fn.tetrisShapes[i].dIndexes[jQuery.fn.tetrisShapes[i].dIndexes.length]=(y+1)*myOptions.boardWidth + x;
		  } else if ( x >= shapeMap[y+1].length ) {
			jQuery.fn.tetrisShapes[i].dIndexes[jQuery.fn.tetrisShapes[i].dIndexes.length]=(y+1)*myOptions.boardWidth + x;
		  } else if (shapeMap[y+1].substr(x,1) == ' ') {
			jQuery.fn.tetrisShapes[i].dIndexes[jQuery.fn.tetrisShapes[i].dIndexes.length]=(y+1)*myOptions.boardWidth + x;
		  }
		}
	  }
      jQuery.fn.tetrisShapes[i].rIndexes[jQuery.fn.tetrisShapes[i].rIndexes.length] = y*myOptions.boardWidth + r+1;
	}
  }
	
	// end render indexes
	jQuery.fn.gameNo = 0;
	$("#tetrisBoard").show();
  }
  jQuery.fn.updateScore = function(score) {
	$("#tetrisScore").html("Score : "+score);
  }
  jQuery.fn.tetrisNewgame = function() {
	jQuery.fn.shape = null;
	jQuery.fn.nextshape = jQuery.fn.tetrisShapes[Math.floor(Math.random()*jQuery.fn.tetrisShapes.length)];
	jQuery.fn.shapeX = 0;
	jQuery.fn.shapeY = 0;
	jQuery.fn.shapeNo = 0;
	jQuery.fn.shapeIndex = 0;
	jQuery.fn.tetrisScore = 0;
	jQuery.fn.tetrisHalt = false;
	jQuery.fn.tetrisPause = false;
	jQuery.fn.updateScore(0);
    $('.popupBoard').remove();
    $(".tetrisbox").hide();
	$(".tetrisnext").hide();
	jQuery.fn.gameNo++;
	jQuery.fn.popupCountDown();
  }
  jQuery.fn.tetrisStart = function(options) {
    $("body").tetrisSetup(options);

    $(document).keydown(function(e){
	  if (e.keyCode == 84) {
	    jQuery.fn.tetrisPause = true;
	    jQuery.fn.popupAbortGame();
	  }
	  if (e.keyCode == 80) {
	    jQuery.fn.tetrisPause = !jQuery.fn.tetrisPause;
	  }
	  if (e.keyCode == 32 || e.keyCode == 13) {
	    $("#tetrisBoard").tetrisFallDown();
	  }
      if (e.keyCode == 38) {
        $("#tetrisBoard").tetrisRotate();
      }
      if (e.keyCode == 37) {
        $("#tetrisBoard").tetrisMoveLeft();
      }
      if (e.keyCode == 39) {
        $("#tetrisBoard").tetrisMoveRight();
      }
      if (e.keyCode == 40) {
        $("#tetrisBoard").tetrisMoveDown();
      }
    });
	jQuery.fn.popupStartGame();
  }
  jQuery.fn.tetrisShape = function() {
    jQuery.fn.shape  = jQuery.fn.nextshape;
    jQuery.fn.shapeX = Math.floor(Math.random()*(jQuery.fn.myOptions.boardWidth-jQuery.fn.shape.width));
    jQuery.fn.shapeY = 0-jQuery.fn.shape.map.split("\n").length;
    jQuery.fn.shapeIndex = jQuery.fn.shapeY*jQuery.fn.myOptions.boardWidth + jQuery.fn.shapeX;
	jQuery.fn.nextshape = jQuery.fn.tetrisShapes[Math.floor(Math.random()*jQuery.fn.tetrisShapes.length)];
	jQuery.fn.tetrisRenderNext();
	jQuery.fn.shapeNo++;
	return this;
  }
  jQuery.fn.tetrisDown = function(gameNo) {
    if (jQuery.fn.tetrisHalt || gameNo < jQuery.fn.gameNo) {
	  return true;
	}
    var result = jQuery.fn.tetrisMoveDown();
	if (result == false ) {
	  if (jQuery.fn.shapeY < 0) {
	    jQuery.fn.tetrisPause = true;
		jQuery.fn.tetrisHalt = true;
		jQuery.fn.popupGameOver();
	  }
	  // clear lines
	  var filledFlag = true;
	  var filledLine = 0;
	  for ( var y = jQuery.fn.shapeY+jQuery.fn.shape.map.split("\n").length-1; y>=0; y--) {
	    if (y < jQuery.fn.shapeY && filledLine == 0) {
			break;
		}
		filledFlag = false;
		if (jQuery.fn.shapeY <= y) {
	      filledFlag = true;
	      for ( var x = 0; x<jQuery.fn.myOptions.boardWidth; x++) {
            if ($("#tetrisbox"+(y*jQuery.fn.myOptions.boardWidth+x)).filter(':visible').length == 0) {
		      filledFlag = false;
		    }
		  }
		  if (filledFlag == true) {
		    filledLine++;
			jQuery.fn.tetrisScore++;
			jQuery.fn.updateScore(jQuery.fn.tetrisScore);
			jQuery.fn.myOptions.fallSpeed += 1;
		  }
		}
		if (filledFlag == false && filledLine > 0) {
		  if (y < filledLine) {
		    $("#tetrisbox"+(y*jQuery.fn.myOptions.boardWidth+x)).hide();
		  } else {
	        for ( var x = 0; x<jQuery.fn.myOptions.boardWidth; x++) {
              if ($("#tetrisbox"+(y*jQuery.fn.myOptions.boardWidth+x)).filter(':visible').length == 0) {
		        $("#tetrisbox"+((y+filledLine)*jQuery.fn.myOptions.boardWidth+x)).hide();
		      } else {
				$("#tetrisbox"+((y+filledLine)*jQuery.fn.myOptions.boardWidth+x)).show();
			  }
		    }
		  }
		}
	  }
	  // next shape
	  $("#tetrisBoard").tetrisShape().tetrisDown(gameNo);
	} else {
	  setTimeout('jQuery.fn.tetrisDown('+gameNo+')',1000-(10*jQuery.fn.myOptions.fallSpeed));
	}
  }
  jQuery.fn.tetrisFallDown = function() {
    if (jQuery.fn.tetrisPause) {
	  return true;
	}
    var y = jQuery.fn.shapeY;
	var shapeIndex = 0;
	jQuery.fn.clearShape();
    while (y < jQuery.fn.myOptions.boardHeight-jQuery.fn.shape.map.split("\n").length) {
	  shapeIndex = (y*jQuery.fn.myOptions.boardWidth)+jQuery.fn.shapeX;
	  if ($(this).tetrisCheck(jQuery.fn.shape.dIndexes, shapeIndex) == false) {
		break;
	  }
	  y++;
	}
	jQuery.fn.shapeY = y;
	jQuery.fn.shapeIndex = jQuery.fn.shapeY*jQuery.fn.myOptions.boardWidth + jQuery.fn.shapeX;
	$(this).tetrisRender();
  }
  jQuery.fn.tetrisRenderNext = function() {
    $(".tetrisnext").hide();
	var nextMap = jQuery.fn.nextshape.map.split("\n");
	var index = 0;
    for (var y=0; y<nextMap.length; y++) {
	  for (var x=0; x<nextMap[y].length; x++) {
	    if (nextMap[y].substr(x,1) == 'o') {
		  index = y*4+x;
		  $("#tetrisnext"+index).show();
		}
	  }
	}
  }
  jQuery.fn.tetrisRender = function() {
    for (var i=0; i<jQuery.fn.shape.indexes.length; i++) {
	  var index = jQuery.fn.shapeIndex+jQuery.fn.shape.indexes[i];
	  if (index >= 0) {
	    $("#tetrisbox"+index).show();
	  }
	}
  }
  jQuery.fn.clearShape = function() {
    for (var i=0; i<jQuery.fn.shape.indexes.length; i++) {
	  var index = jQuery.fn.shapeIndex+jQuery.fn.shape.indexes[i];
	  if (index >= 0) {
	    $("#tetrisbox"+index).hide();
      }
	}
  }
  jQuery.fn.tetrisCheck = function(indexes, shapeIndex) {
    var index = 0;
	var lastIndex = (jQuery.fn.myOptions.boardHeight+1)*jQuery.fn.myOptions.boardWidth;
    for (var i=0; i<indexes.length; i++) {
	  index = shapeIndex+indexes[i];
	  if ( index >= 0 ) {
	    
	    if ( $("#tetrisbox"+index).filter(':visible').length == 1 || $("#tetrisbox"+index).length == 0 ) {
	      return false;
		}
	  }
	}
	return true;
  }
  jQuery.fn.tetrisMoveRight = function() {
    if (jQuery.fn.tetrisPause) {
	  return true;
	}
    if (jQuery.fn.shapeX < jQuery.fn.myOptions.boardWidth-jQuery.fn.shape.width) {
	  if ($(this).tetrisCheck(jQuery.fn.shape.rIndexes,jQuery.fn.shapeIndex)) {
	    jQuery.fn.clearShape();
		jQuery.fn.shapeX++;
		jQuery.fn.shapeIndex++;
		$(this).tetrisRender();
	  }
	}
  }
  jQuery.fn.tetrisMoveLeft = function() {
    if (jQuery.fn.tetrisPause) {
	  return true;
	}
    if (jQuery.fn.shapeX > 0) {
	  if ($(this).tetrisCheck(jQuery.fn.shape.lIndexes,jQuery.fn.shapeIndex)) {
	    $(this).clearShape();
		jQuery.fn.shapeX--;
		jQuery.fn.shapeIndex--;
		$(this).tetrisRender();
	  }
	}
  }
  jQuery.fn.tetrisRotate = function() {
    if (jQuery.fn.tetrisPause) {
	  return true;
	}
	$(this).clearShape();
	var rotatedShape = jQuery.fn.tetrisShapes[jQuery.fn.shape.rotate];
	if ($(this).tetrisCheck(rotatedShape.indexes, jQuery.fn.shapeIndex) &&
	    jQuery.fn.shapeX+rotatedShape.width <= jQuery.fn.myOptions.boardWidth) {
	  jQuery.fn.shape = rotatedShape;
	}
    $(this).tetrisRender();
  }
  jQuery.fn.tetrisMoveDown = function() {
    if (jQuery.fn.tetrisPause) {
	  return true;
	}
    if (jQuery.fn.shapeY < jQuery.fn.myOptions.boardHeight-jQuery.fn.shape.map.split("\n").length) {
	  if ($(this).tetrisCheck(jQuery.fn.shape.dIndexes, jQuery.fn.shapeIndex)) {
	    $(this).clearShape();
		jQuery.fn.shapeY++;
		jQuery.fn.shapeIndex = jQuery.fn.shapeY*jQuery.fn.myOptions.boardWidth + jQuery.fn.shapeX;
		$(this).tetrisRender();
		return true;
	  }
	}
	return false;
  }
  jQuery.fn.popupGameOver = function() {
	$('<div class="popupBoard" style="z-index:10000;position:absolute;"></div>').css("background-color","gray")
	.css("width", $("#tetrisBoard").css("width"))
	.css("height", $("#tetrisBoard").css("height"))
	.append('<div id="gameover" style="font-size: 22px; color:orange; padding-top:50px;'+
	  ' font-family: arial; direction:ltr;">Game Over!</div>')
	.append('<div id="newgame" style="font-size: 22px; height:40px; cursor: pointer;'+
	  'color:orange; padding-top:50px; text-decoration:underline;'+
	  ' font-family: arial">Try Again</div>')
	.appendTo("#tetrisBoard");
	$("#newgame").click(function(){
	  jQuery.fn.tetrisNewgame();
	});
  }
  jQuery.fn.popupAbortGame = function() {
	$('<div class="popupBoard" style="z-index:10000;position:absolute;"></div>').css("background-color","gray")
	.css("width", $("#tetrisBoard").css("width"))
	.css("height", $("#tetrisBoard").css("height"))
	.append('<div id="continue" style="font-size: 22px; color:orange; padding-top:50px; cursor: pointer;'+
	  ' font-family: arial; direction:ltr; text-decoration:underline;">Continue >></div>')
	.append('<div id="newgame" style="font-size: 22px; height:40px; cursor: pointer;'+
	  'color:orange; padding-top:50px; text-decoration:underline;'+
	  ' font-family: arial">Try Again</div>')
	.appendTo("#tetrisBoard");
	$("#newgame").click(function(){
	  jQuery.fn.tetrisHalt = true;
	  jQuery.fn.tetrisNewgame();
	});
	$("#continue").click(function(){
	  $(".popupBoard").remove();
	  jQuery.fn.tetrisPause = false;
	});
  }
  jQuery.fn.popupStartGame = function() {
	$('<div class="popupBoard" style="z-index:10000;position:absolute;"></div>').css("background-color","gray")
	.css("width", $("#tetrisBoard").css("width"))
	.css("height", $("#tetrisBoard").css("height"))
	.append('<div id="startgame" style="font-size: 22px; color:orange; padding-top:100px; cursor: pointer;'+
	  ' font-family: arial; direction:ltr; text-decoration:underline;">Start Game</div>')
	.appendTo("#tetrisBoard");
	$("#startgame").click(function(){
	  jQuery.fn.tetrisNewgame();
	});
  }
  jQuery.fn.popupCountDown = function() {
	$('<div class="popupBoard" style="z-index:10000;position:absolute;"></div>').css("background-color","gray")
	.css("width", $("#tetrisBoard").css("width"))
	.css("height", $("#tetrisBoard").css("height"))
	.append('<div id="countdown" style="font-size: 22px; color:orange; padding-top:100px; cursor: pointer;'+
	  ' font-family: arial; direction:ltr;"></div>')
	.appendTo("#tetrisBoard");
	$("#countdown").countDown(3);
  }
  jQuery.fn.countDown = function(number) {
    if (number == 0) {
	  $('.popupBoard').remove();
      $("#tetrisBoard").tetrisShape().tetrisDown(jQuery.fn.gameNo);
	} else {
	  $(this).html(number);
	  number--;
	  setTimeout('$("#countdown").countDown('+number+')', 1000);
	}
  }
  jQuery.fn.tetrisShapes = [
	{"rotate": 1,  "width":4, "map":"oooo"      , "indexes":[], "lIndexes":[], "rIndexes":[], "dIndexes":[]},//#0
	{"rotate": 0,  "width":1, "map":"o\no\no\no", "indexes":[], "lIndexes":[], "rIndexes":[], "dIndexes":[]},//#1
    {"rotate": 3,  "width":3, "map":"oo\n oo"   , "indexes":[], "lIndexes":[], "rIndexes":[], "dIndexes":[]},//#2
	{"rotate": 2,  "width":2, "map":" o\noo\no" , "indexes":[], "lIndexes":[], "rIndexes":[], "dIndexes":[]},//#3
	{"rotate": 5,  "width":3, "map":" oo\noo"   , "indexes":[], "lIndexes":[], "rIndexes":[], "dIndexes":[]},//#4
	{"rotate": 4,  "width":2, "map":"o\noo\n o" , "indexes":[], "lIndexes":[], "rIndexes":[], "dIndexes":[]},//#5
    {"rotate": 6,  "width":2, "map":"oo\noo"    , "indexes":[], "lIndexes":[], "rIndexes":[], "dIndexes":[]},//#6
    {"rotate": 11, "width":3, "map":"o\nooo"    , "indexes":[], "lIndexes":[], "rIndexes":[], "dIndexes":[]},//#7
    {"rotate": 12, "width":3, "map":"  o\nooo"  , "indexes":[], "lIndexes":[], "rIndexes":[], "dIndexes":[]},//#8
    {"rotate": 13, "width":3, "map":"ooo\no"    , "indexes":[], "lIndexes":[], "rIndexes":[], "dIndexes":[]},//#9
    {"rotate": 14, "width":3, "map":"ooo\n  o"  , "indexes":[], "lIndexes":[], "rIndexes":[], "dIndexes":[]},//#10
    {"rotate": 10, "width":2, "map":" o\n o\noo", "indexes":[], "lIndexes":[], "rIndexes":[], "dIndexes":[]},//#11
    {"rotate": 9,  "width":2, "map":"o\no\noo"  , "indexes":[], "lIndexes":[], "rIndexes":[], "dIndexes":[]},//#12
    {"rotate": 8,  "width":2, "map":"oo\n o\n o", "indexes":[], "lIndexes":[], "rIndexes":[], "dIndexes":[]},//#13
    {"rotate": 7,  "width":2, "map":"oo\no\no"  , "indexes":[], "lIndexes":[], "rIndexes":[], "dIndexes":[]},//#14
    {"rotate": 16, "width":3, "map":" o\nooo"   , "indexes":[], "lIndexes":[], "rIndexes":[], "dIndexes":[]},//#15
    {"rotate": 17, "width":2, "map":" o\noo\n o", "indexes":[], "lIndexes":[], "rIndexes":[], "dIndexes":[]},//#16
    {"rotate": 18, "width":3, "map":"ooo\n o"   , "indexes":[], "lIndexes":[], "rIndexes":[], "dIndexes":[]},//#17
    {"rotate": 15, "width":2, "map":"o\noo\no"  , "indexes":[], "lIndexes":[], "rIndexes":[], "dIndexes":[]},//#18
    {"rotate": 22, "width":2, "map":"oo\no\noo" , "indexes":[], "lIndexes":[], "rIndexes":[], "dIndexes":[]},//#19
    {"rotate": 19, "width":3, "map":"ooo\no o"  , "indexes":[], "lIndexes":[], "rIndexes":[], "dIndexes":[]},//#20
    {"rotate": 20, "width":2, "map":"oo\n o\noo", "indexes":[], "lIndexes":[], "rIndexes":[], "dIndexes":[]},//#21
    {"rotate": 21, "width":3, "map":"o o\nooo"  , "indexes":[], "lIndexes":[], "rIndexes":[], "dIndexes":[]}, //#22
    {"rotate": 24, "width":3, "map":"oo\n o\n oo", "indexes":[], "lIndexes":[], "rIndexes":[], "dIndexes":[]}, //#23
    {"rotate": 23, "width":3, "map":"  o\nooo\no", "indexes":[], "lIndexes":[], "rIndexes":[], "dIndexes":[]}, //#24
    {"rotate": 26, "width":3, "map":" oo\n o\noo"   , "indexes":[], "lIndexes":[], "rIndexes":[], "dIndexes":[]}, //#25
    {"rotate": 25, "width":3, "map":"o\nooo\n  o"   , "indexes":[], "lIndexes":[], "rIndexes":[], "dIndexes":[]}, //#26
    {"rotate": 27, "width":3, "map":" o\nooo\n o"   , "indexes":[], "lIndexes":[], "rIndexes":[], "dIndexes":[]}, //#27
  ];
})(jQuery);