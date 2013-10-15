var board = null;
var boardnodes = null;
var seed = [ [ 1, 3 ], [ 2, 3 ], [ 2, 4 ], [ 3, 3 ], [ 4, 5 ], [ 6, 7 ] ];
var looper = null;
var tmpboard = null;
var loopinterval = 200;

function init() {
	board = initboard(320, 320, 20);
	boardnodes = creategrid($("#grid-main"), board, boardnodes);
	setseed(board, seed);
	updategrid(boardnodes, board);
}

function reset() {
	if (looper !== null) {
		$("#btn-ctrl").text("run");
		clearInterval(looper);
		looper = null;
	}

	board = initboard(320, 320, 20);
	setseed(board, seed);
	updategrid(boardnodes, board);
}

function setsteady() {
	if (looper !== null) {
		clearInterval(looper);
		looper = null;
	}

	$("#btn-ctrl").text("steady");
}

function initboard(w, h, cellsize) {
	var board = {
		'w' : w,
		'h' : h,
		'cellsize' : cellsize,
		'rows' : 0,
		'cols' : 0,
		'arr' : null
	};
	board.rows = Math.floor(h / cellsize);
	board.cols = Math.floor(w / cellsize);
	board.arr = new Array(board.rows * board.cols);
	tmpboard = new Array(board.rows * board.cols);
	for (var i = 0; i < board.arr.length; i++) {
		board.arr[i] = 0;
		tmpboard[i] = 0;
	}
	return board;
}

function creategrid(gridmain, board, boardnodes) {
	var rows = board.rows;
	var cols = board.cols;
	var cellsize = board.cellsize;

	var standard = document.createElement('div');
	standard.className = 'grid';
	standard.style.width = (rows * cellsize) + 'px';
	standard.style.height = (cols * cellsize) + 'px';

	var boardnodes = new Array(rows * cols);
	for (var i = 0; i < rows; i++) {
		for (var p = 0; p < cols; p++) {
			var cell = document.createElement('div');
			cell.id = i * cols + p;
			cell.style.height = (cellsize - 1) + 'px';
			cell.style.width = (cellsize - 1) + 'px';
			cell.style.zIndex = '10';
			cell.style.position = 'relative';
			cell.onmousedown = cellonclick;

			standard.appendChild(cell);
			boardnodes[i * cols + p] = cell;
		}
	}

	gridmain.append(standard);
	return boardnodes;
}

function cellonclick() {
	if ($("#btn-ctrl").text() == "steady") {
		$("#btn-ctrl").text("run");
	}

	var cols = board.cols;
	for (var i = 0; i < boardnodes.length; i++) {
		if (this == boardnodes[i]) {
			var t = getcell(board, Math.floor(i / cols), Math.floor(i % cols));
			t = t ? 0 : 1;
			setcell(board, Math.floor(i / cols), Math.floor(i % cols), t);
			break;
		}
	}
	updategrid(boardnodes, board);
}

function setseed(board, seed) {
	var cols = board.cols;
	for (var i = 0; i < seed.length; i++) {
		var r = seed[i][0];
		var c = seed[i][1];
		setcell(board, r, c, 1);
		// board.arr[r*cols+c] = 1;
		// var cell = board.arr[r*size+c];
		// cell.style.backgroundColor = "#000000";
	}
}

function getseed(board) {
    var seed = new Array();
    var cols = board.cols;
	for (var i = 0; i < board.arr.length; i++) {
		var r = Math.floor(i/cols);
		var c = Math.floor(i%cols);
        seed.push([r, c]);
    }
    return seed;
}

function seedtojson(seed) {
    var val = JSON.stringify(seed);
    return val;
}

function jsontoseed(val) {
    var seed = JSON.parse(val);
    return seed;
}

function updategrid(boardnodes, board) {
	for (var i = 0; i < board.arr.length; i++) {
		var t = board.arr[i];
		var cell = boardnodes[i];
		if (t) {
			cell.style.backgroundColor = "#000000";
		} else {
			cell.style.backgroundColor = "#FFFFFF";
		}
	}
}

function seedctrl() {
	if (looper === null) {
		$("#btn-ctrl").text("stop");
		looper = setInterval(nextgen, loopinterval);
	} else {
		$("#btn-ctrl").text("run");
		clearInterval(looper);
		looper = null;
	}
}

function getcell(board, r, c) {
	var rows = board.rows;
	var cols = board.cols;
	if (r < 0 || c < 0 || r >= rows || c >= cols)
		return 0;
	return board.arr[r * cols + c];
}

function setcell(board, r, c, val) {
	var rows = board.rows;
	var cols = board.cols;
	if (r < 0 || c < 0 || r >= rows || c >= cols)
		return 0;
	board.arr[r * cols + c] = val;
}

function liveordie(board, r, c) {
	var nei = 0;
	nei += getcell(board, r - 1, c - 1);
	nei += getcell(board, r - 1, c);
	nei += getcell(board, r - 1, c + 1);
	nei += getcell(board, r, c - 1);
	nei += getcell(board, r, c + 1);
	nei += getcell(board, r + 1, c - 1);
	nei += getcell(board, r + 1, c);
	nei += getcell(board, r + 1, c + 1);

	var cell = getcell(board, r, c);
	if (cell && (nei == 2 || nei == 3))
		return 1;
	else if (!cell && nei == 3)
		return 1;

	return 0;
}

function nextgen() {
	var rows = board.rows;
	var cols = board.cols;
	for (var r = 0; r < rows; r++) {
		for (var c = 0; c < cols; c++) {
			tmpboard[r * cols + c] = liveordie(board, r, c);
		}
	}

	var steady = true;
	for (var i = 0; i < board.arr.length; i++) {
		if (board.arr[i] != tmpboard[i]) {
			steady = false;
			break;
		}
	}

	if (steady) {
		setsteady();
		return;
	}

	for (var i = 0; i < board.arr.length; i++) {
		board.arr[i] = tmpboard[i];
	}

	updategrid(boardnodes, board);
}
