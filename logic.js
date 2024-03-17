
// Variables are storage of values
let board;
let score = 0;
let rows = 4;
let columns = 4;

let is2048Exist = false;
let is4096Exist = false;
let is8192Exist = false;

// document how to touch phone since it is a 2048 game. Kung saan na touch yung phone from the X and Y axis
let startX = 0;
let startY = 0;

// It is a program task that is callable (pag set ng command para gumana ang game) (ex. pokemon: pikachu use thunderbolt)
function setGame(){

	board = [
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0]
	];

	for(let r=0; r<rows; r++){
		for(let c=0; c<columns; c++){

			let tile = document.createElement("div");

			tile.id = r.toString() + "-" + c.toString();

			let num = board[r][c];

			// UpdateTile function updates the appearance of the tile based on its number value
			updateTile(tile, num);

			document.getElementById("board").append(tile);
		}
	}

	setTwo();
	setTwo();
}

function updateTile(tile, num){

	tile.innerText = "";
	tile.classList.value = "";
	tile.classList.add("tile");

	if(num > 0){
		tile.innerText = num.toString();

		if(num <= 4096){
			tile.classList.add("x"+num.toString());
		}
		else{
			tile.classList.add("x8192");
		}
	}
}

window.onload = function(){
	setGame();
}

function handleSlide(e) {
	// Displays what key in the keyboard has been pressed.
	console.log(e.code);

	 if(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.code)) {
	 	// Prevents the default behavior of the browser, which in this case, after ArrowLeft, ArrowRight, or any Arrow keys it should not scroll. 
		 e.preventDefault();

	 	if(e.code == "ArrowLeft" && canMoveLeft() == true) {
	 	slideLeft();
	 	setTwo();
	 	}

	 	else if (e.code == "ArrowRight" && canMoveRight() == true) {
	 	slideRight();
	 	setTwo();
	 	}

	 	else if (e.code == "ArrowUp" && canMoveUp() == true) {
	 	slideUp();
	 	setTwo();
	 	}

	 	else if (e.code == "ArrowDown" && canMoveDown() == true) {
	 	slideDown();
	 	setTwo();
	 	}	
	}

	checkWin();

	if(hasLost() == true) {

		setTimeout(() => {
			alert("Game Over!");
			restartGame();
			alert("Click any arrow key to restart")
		}, 100);
	}

	document.getElementById("score").innerText = score;

}

// pag nag press ng key na iidentify sa console
document.addEventListener("keydown", handleSlide);
// removes the zeroes in the board, to make the merging possible
function filterZero(row){
	return row.filter(num => num != 0);
}
// merges the tile
function slide(row){

	row =  filterZero(row);

	for(let i=0; i < row.length - 1; i++ ){
		if(row[i] == row[i+1]){
			row[i] *= 2;
			row[i+1] = 0;

			score += row[i];
		}
	}

	row = filterZero(row);

	while(row.length < columns){
		row.push(0);
	}
	return row;
}

// uses slide() function to merge the tile
function slideLeft(){
	for(let r=0; r<rows; r++){
		let row = board[r];
		let originalRow = row.slice();
		row = slide(row);
		board[r] = row;

		for(let c=0; c<columns; c++){
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			let num = board[r][c];
			updateTile(tile, num);

			if(originalRow[c] !== num && num !== 0) {
				tile.style.animation = "slide-from-right 0.3s";

				setTimeout(() => {
					tile.style.animation = "";
				}, 300)
			}
		}
	}
}


function slideRight(){
	for(let r=0; r<rows; r++){
		let row = board[r];
		let originalRow = row.slice();
		row.reverse();
		row = slide(row);
		row.reverse();
		board[r] = row;

		for(let c=0; c<columns; c++){
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			let num = board[r][c];
			updateTile(tile, num);

			if(originalRow[c] !== num && num !== 0) {
				tile.style.animation = "slide-from-left 0.3s";

				setTimeout(() => {
					tile.style.animation = "";
				}, 300)
			}
		}
	}
}


function slideUp(){
	for(let c=0; c<columns; c++){
		let col = [board[0][c], board[1][c], board[2][c], board[3][c]];
		let originalCol = col.slice();
		col = slide(col);

		changedIndices = [];

		for(let r=0; r<rows; r++) {
			if(originalCol[r] !== col[r]) {
				changedIndices.push(r)
			}
		}
		
		// this loop is to update the appearance of the tiles after merging
		for(let r=0; r<rows; r++){
			board[r][c] = col[r];
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			let num = board[r][c];
			updateTile(tile, num);

			if(changedIndices.includes(r) && num !== 0) {
				tile.style.animation = "slide-from-bottom 0.3s";
				setTimeout(() => {
					tile.style.animation = ""
				}, 300);
			}
		}
	}
}


function slideDown(){
	for(let c=0; c<columns; c++){
		let col = [board[0][c], board[1][c], board[2][c], board[3][c]];

		let originalCol = col.slice();
		col.reverse();
		col = slide(col);
		col.reverse();

		changedIndices = [];

		for(let r=0; r<rows; r++) {
			if(originalCol[r] !== col[r]) {
				changedIndices.push(r)
			}
		}
		
		// this loop is to update the appearance of the tiles after merging
		for(let r=0; r<rows; r++){
			board[r][c] = col[r];
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			let num = board[r][c];
			updateTile(tile, num);

			if(changedIndices.includes(r) && num !== 0) {
				tile.style.animation = "slide-from-top 0.3s";
				setTimeout(() => {
					tile.style.animation = ""
				}, 300);
			}	
		}
	}
}

// this is to check if the board has an empty tile / vacant space
function hasEmptyTile(){
	for(let r=0; r<rows; r++){
		for(let c=0; c<columns; c++){
			if(board[r][c] == 0){
				return true;
			}
		}
	}
	return false;
}


function setTwo(){
	// if there is no empty tile / vacant space
	if(!hasEmptyTile()){
		return;
	}

	let found = false;

	while(!found){

		let r = Math.floor(Math.random() * rows);
		let c = Math.floor(Math.random() * columns);

		if(board[r][c] == 0) {
			board[r][c] = 2;
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			tile.innerText = "2";
			tile.classList.add("x2");

			found = true;
		}
	}
}

// check all tiles on the board
function checkWin(){
	for(let r=0; r<rows; r++){
		for(let c=0; c<columns; c++) {
			if(board[r][c] === 2048 && is2048Exist == false) {
				alert("You Win! You got the 2048")
				is2048Exist = true;
			}
			if(board[r][c] === 4096 && is4096Exist == false) {
				alert("Unstoppable! You got the 4096")
				is4096Exist = true;
			}
			if(board[r][c] === 8192 && is8192Exist == false) {
				alert("Awesome! You won the game!")
				is8192Exist = true;
			}

		}
	}
}


function hasLost(){

	for(let r=0; r<rows; r++){
		for(let c=0; c<columns; c++) {
			if(board[r][c]==0) {
				return false;
			}

			const currentTile = board[r][c];

			if (
                r > 0 && board[r - 1][c] === currentTile ||
                r < rows - 1 && board[r + 1][c] === currentTile ||
                c > 0 && board[r][c - 1] === currentTile ||
                c < columns - 1 && board[r][c + 1] === currentTile
            ) {
                // Found adjacent cells with the same value, user has not lost
                return false;
            }

		}	
	}	

	return true;

}


function restartGame(){
	for(let r=0; r<rows; r++) {
		for(let c=0; c<columns; c++) {
			board[r][c]=0;
		}
	}
	score = 0;
	setTwo();
}


// Document kung saan nagsimula mag touch/ Document the x and y coordinates where the user start to touch the screen
document.addEventListener('touchstart', (e) => {
	startX = e.touches[0].clientX;
	startY = e.touches[0].clientY;
	
})


document.addEventListener('touchend', (e) =>{
	// if the user does not touch a tile it should do nothing.
	if(!e.target.className.includes("tile")){
		return;
	}

	let diffX = startX - e.changedTouches[0].clientX;
	let diffY = startY - e.changedTouches[0].clientY;

// horizontal swipe
	if(Math.abs(diffX) > Math.abs(diffY)) {
		if(diffX > 0 ) {
			slideLeft();
			setTwo();
		}
		else {
			slideRight();
			setTwo();
		}
	}
// vertical swipe
	else {
		if(diffY > 0) {
			slideUp();
			setTwo();			
		}
		else {
			slideDown();
			setTwo();
		}
	}		
	

	// start (x = 5, y = 2)
	// end (x = 20, y = 4) 

	// diffX = 5 - 20
		// = -15 (absolute)
	// diffY = 2 - 1
		// = 1	(absolute)



	document.getElementById("score").innerText = score;

	checkWin();

	if(hasLost() == true) {

		setTimeout(() => {
			alert("Game Over!");
			restartGame();
			alert("Click any arrow key to restart")
		}, 100);
	}
})

document.addEventListener("touchmove", (e) => {
	if(!e.target.className.includes("tile")) {

	}

	e.preventDefault(); // this line prevents the default behavior during the user swipes the tile causing scroll (This line disables scrolling;

}, {passive: false}); // Use passive: false to make preventDefault()work.

	
function canMoveLeft(){

	for(let r=0; r<rows; r++) {
		for(let c=0; c<columns; c++) {
			if(board[r][c] !== 0){
				if(board[r][c-1] === 0 || board[r][c-1] === board[r][c]) {
					return true;
				}
			}
		}
	}
	return false;
}


function canMoveRight(){

	for(let r=0; r<rows; r++) {
		for(let c=0; c<columns; c++) {
			if(board[r][c] !== 0){
				if(board[r][c+1] === 0 || board[r][c+1] === board[r][c]) {
					return true;
				}
			}
		}
	}
	return false;
}


function canMoveUp(){

	for(let c=0; c<columns; c++) {
		for(let r=1; r<rows; r++) {
			if(board[r][c] !== 0){
				if(board[r-1][c] === 0 || board[r-1][c] === board[r][c]) {
					return true;
				}
			}
		}
	}
	return false;
}

function canMoveDown(){

	for(let c=0; c<columns; c++) {
		for(let r=0; r<rows-1; r++) {
			if(board[r][c] !== 0){
				if(board[r+1][c] === 0 || board[r+1][c] === board[r][c]) {
					return true;
				}
			}
		}
	}
	return false;
}







