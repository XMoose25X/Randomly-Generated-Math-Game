var score = 0;
var plays = 10;
var active = false;
var opt1, opt2, num1, num2, num3, options, result, answer, final, mainTimer;

function checkScores() {
	plays--;
	active = false;
	clearTimeout(mainTimer);
	setTimeout(function () {
		$('#correct').tooltip('hide');
		$('#wrong').tooltip('hide');
		document.getElementById("correct").classList.remove("glow-green");
		document.getElementById("wrong").classList.remove("glow-red");
		if (plays == 0) {
			//Display final Score
			$('#equation').tooltip('show');
			document.getElementById("equation").innerHTML = ("Final Score: " + score + "/10");
		} else {
			// Play More Rounds
			gameCountDown();
		}
	}, 2000)
}

function gameCountDown() {
	// Reset All Variables
	document.getElementById("equals").innerText = "?";
	getNewEquation();
	document.getElementById("timer").classList.add("timer");
	mainTimer = setTimeout(function() {showAnswer(false)}, 10000);
}

function showAnswer(isCorrect) {
	document.getElementById("timer").classList.remove("timer");
	document.getElementById("equals").innerText = final;
	if (isCorrect) {
		document.getElementById("correct").classList.add("glow-green");
		$('#correct').tooltip('show');
		score++;
	} else {
		document.getElementById("wrong").classList.add("glow-red");
		$('#wrong').tooltip('show');
	}
	checkScores();
}

function pressButton(buttonPressed) {
	if (active) {
		showAnswer(final == buttonPressed);
	}
}

function testForKeys(e) {
	if (active && ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105))) { // 0-9 Keys only
		if (e.keyCode - 48 < 10) {
			pressButton(e.keyCode - 48);
		} else {
			pressButton(e.keyCode - 96)
		}
	}
}

function startGame() {
	document.addEventListener("keydown", testForKeys);
	gameCountDown();
}

/**
 * Returns a random number between min and max
 * @param {Number} min
 * @param {Number} max
 * @returns a random integer between min (inclusive) and max (inclusive)
 */
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function getRandomOperator(option) {
	switch (getRandomInt(1, option)) {
		case 1: 
			return '+';
		case 2: 
			return '-';
		case 3: 
			return '*';
		case 4: 
			return '/';
		default: 
			return null;
	}
}

/**
 * Calculates the result of two integers based on the operators
 * @param {Number} int1 The first integer that would be evaluated in the equation
 * @param {string} operator The string representing an operator (+, -, *, /)
 * @param {Number} int2 The second integer that would be evaluated in the equation
 * @returns The result of the equation
 */
function calculate(int1, operator, int2) {
	switch (operator) {
		case '+':
			return int1 + int2;
		case '-':
			return int1 - int2;
		case '*':
			return int1 * int2;
		case '/':
			return int1 / int2;
		default:
			return null;
	}
}

function getNewEquation() {
	active = true;
	answer = getRandomInt(0, 9); // Always have Answer of 0-9
	var parenthesis = Math.random() >= 0.5; // Random Boolean
	num1 = getRandomInt(0, 25);
	num2 = getRandomInt(0, 25);
	if (num1 < num2) { // First Number is always bigger
		temp = num1;
		num1 = num2;
		num2 = temp;
	}
	if ((num1 % num2 == 0)) { // Divison is Whole Number
		opt1 = '/'
	}
	else if (num1 <= 10 || num2 <= 10) { // Multiplication is not Too Complicated
		opt1 = getRandomOperator(3);
	}
	else { // Only Addition or Subtraction
		opt1 = getRandomOperator(2);
	}
	result = calculate(num1, opt1, num2);
	if (result > answer) { // Result - Num3 = Answer
		opt2 = '-';
		num3 = result - answer;
		parenthesis = true;
	} // Result can be addition or subtraction
	else {//(result < answer)
		if (parenthesis) { // Just need Random Bool
			// Result + Num3 = Answer
			opt2 = '+';
			num3 = answer - result;
		} else {
			// Num3 - Result = Answer
			opt2 = '-';
			num3 = answer + result;
			parenthesis = false;
		}
	}

	if (parenthesis) { // Place around First Set
		final = calculate(result, opt2, num3);
		document.getElementById("left1").style.display = 'inline-block';
		document.getElementById("right1").style.display = 'inline-block';
		document.getElementById("left2").style.display = 'none';
		document.getElementById("right2").style.display = 'none';
		document.getElementById("num1").innerText = num1;
		document.getElementById("opt1").innerText = opt1;
		document.getElementById("num2").innerText = num2;
		document.getElementById("opt2").innerText = opt2;
		document.getElementById("num3").innerText = num3;
	} else { // Place around Second set
		final = calculate(num3, opt2, result);
		document.getElementById("left2").style.display = 'inline-block';
		document.getElementById("right2").style.display = 'inline-block';
		document.getElementById("left1").style.display = 'none';
		document.getElementById("right1").style.display = 'none';
		document.getElementById("num1").innerText = num3;
		document.getElementById("opt1").innerText = opt2;
		document.getElementById("num2").innerText = num1;
		document.getElementById("opt2").innerText = opt1;
		document.getElementById("num3").innerText = num2;
	}
}
