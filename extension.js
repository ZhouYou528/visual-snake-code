// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

var editor;
var direction = 90;
var oldTail;
var maxX;
var minX;
var maxY;
var minY;
var snake = [];
var endGame = false;
var line;
var points = [
	{
		x: 10,
		y: 31
	}, {
		x: 11,
		y: 31
	}, {
		x: 12,
		y: 31
	}, {
		x: 13,
		y: 31
	}
];
//21*30 area from [1,1] to [61, 61] 
var borders = [
	'╔══════════════════════════════════════════════════════════════╗\n',
    '║                                                              ║\n',
    '║                                                              ║\n',
    '║                                                              ║\n',
    '║                                                              ║\n',
    '║                                                              ║\n',
    '║                                                              ║\n',
    '║                                                              ║\n',
    '║                                                              ║ SCORE: 0000\n',
    '║                                                              ║\n',
    '║                                                              ║\n',
    '║                                                              ║\n',
    '║                                                              ║\n',
    '║                                                              ║\n',
    '║                                                              ║\n',
    '║                                                              ║\n',
    '║                                                              ║\n',
    '║                                                              ║\n',
    '║                                                              ║\n',
    '║                                                              ║\n',
    '║                                                              ║\n',
    '║                                                              ║\n',
    '╚══════════════════════════════════════════════════════════════╝\n'
];

function gameInit(ed) {
	for(var i = 0; i < borders.length; i++) {
		ed.insert(new vscode.Position(i, 0), borders[i]);
	}
	for(var x = 1; x <= 21; x++) {
		snake[x] = [];
		for(var y = 1; y <= 61; y = y + 2) {
			snake[x][y] = 0;
		}
	}
}

function keyInput(ed, doc) {
	line = doc.lineCount - 1;
	var command = doc.lineAt(line).text;
	var i = command.length - 1;
	if(direction != 270 && command[i] == 'w') direction = 90;
	else if(direction != 0 && command[i] == 'a') direction = 180;
	else if(direction != 90 && command[i] == 's') direction = 270;
	else if(direction != 180 && command[i] == 'd') direction = 0;

	ed.replace(
		new vscode.Range(
			new vscode.Position(line, 0),
			new vscode.Position(line, 99999)
		), ""
	);
}

function gameRender() {
	if(!endGame) {
		editor.edit((ed) => {
			keyInput(ed, editor.document);
			playerMove();
			screenRender(ed);
		}).then(() => setTimeout(gameRender, 200));
	} else {

	}
}

function screenRender(ed) {
	for(let point of points) {
		ed.replace(
			new vscode.Range(
				new vscode.Position(point.x, point.y),
				new vscode.Position(point.x, point.y + 2)
			),'██'
		);
		snake[point.x][point.y] = 1;
	}
	ed.replace(
		new vscode.Range(
			new vscode.Position(oldTail.x, oldTail.y),
			new vscode.Position(oldTail.x, oldTail.y + 2)
		),'  '
	)
	snake[oldTail.x][oldTail.y] = 0;
}

function playerMove() {
	if(direction == 0) {
		var head = {
			x: points[0].x,
			y: points[0].y + 2
		}
		if(validatePos(head)) {
			points.unshift(head);
			oldTail = points.pop();
		}
	} else if(direction == 90) {
		var head = {
			x: points[0].x - 1,
			y: points[0].y
		}
		if(validatePos(head)) {
			points.unshift(head);
			oldTail = points.pop();
		}
	} else if(direction == 180) {
		var head = {
			x: points[0].x,
			y: points[0].y - 2
		}
		if(validatePos(head)) {
			points.unshift(head);
			oldTail = points.pop();
		}
	} else if(direction == 270) {
		var head = {
			x: points[0].x + 1,
			y: points[0].y
		}
		if(validatePos(head)) {
			points.unshift(head);
			oldTail = points.pop();
		}
	}
}

function validatePos(head) {
	if(head.x < minX || head.x > maxX || head.y < minY || head.y > maxY) {
		endGame = true;
		return false;
	} 
	return true;
}







// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "visual-snake-code" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.vSnakeCode', function () {
		// The code you place here will be executed every time your command is executed
		minX = 1;
		minY = 1;
		maxX = 21;
		maxY = 61;
		editor = vscode.window.activeTextEditor;
		editor.edit((e) => gameInit(e)).then(gameRender);
		// Display a message box to the user
		vscode.window.showInformationMessage('Visual Snake Code!');
	});

	context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
