var memory = null
/**
 * Helper function to set the value on the board
 * @param {int} row row index of cell
 * @param {int} col column index of cell
 * @param {*} value value to set the cell
 */
function set_cell(row, col, value){
    document.getElementById("board").rows[row].cells[col].innerHTML = String(value);
}
/**
 * Solves the Puzzle using existing values
 */
function solve(){
    let all_cells = document.getElementsByTagName("td");
    //If solution in memory
    if(memory !== null){
        for(let i = 0; i<all_cells.length;i++){
            all_cells[i].innerHTML = memory[i]
        }
    }
    //Try to solve if user input values
    else{
        //clear user input values
        for(let i = 0; i<all_cells.length;i++){
            if(iEditable(i)){
                all_cells[i].innerHTML = ""
            }
        }
        if(!recursive_fill(0,0)){
            alert("Puzzle contains 0 solutions");
        }
    }
    
    
}

/**
 * Sets user input values for the starting point of a puzzle
 */
function set(){
    //Check valid starting position
    for(let index = 0; index<board.rows.length; index++){
        if(!check(index,index)){
            alert("Given puzzle is invalid")
            return;
        }
    }
    //Set the filled cells
    let all_cells = document.getElementsByTagName("td");
    let empty = true
    for(let i = 0; i<all_cells.length;i++){
        //lock down the cell if it has been entered by user
        if(all_cells[i].innerHTML){
            all_cells[i].contentEditable = false;
            all_cells[i].className = "restricted";
            empty = false
        }
    }
    //show the solve button
    if(!empty){
        show_solve(true)
    }
}

/**
 * Helper function to toggle solve/set buttons
 * @param {boolean} show if true, show solve, else show set
 */
function show_solve(show){
    if(show){ //showing solve
        document.getElementById("set").className = "hidden"
        document.getElementById("solve").className = ""
    }
    else{ //showing set
        document.getElementById("set").className = ""
        document.getElementById("solve").className = "hidden"
    }
}

/**
 * Retu
 * @param {*} row row index
 * @param {*} col column index
 */
function rcEditable(row, col){
    let bool = document.getElementById("board").rows[row].cells[col].contentEditable;
    if(bool === "true"){
        return true
    }
    return false
}
function iEditable(index){
    let all_cells = document.getElementsByTagName("td");
    let bool = all_cells[index].contentEditable;
    if(bool === "true"){
        return true
    }
    return false
}

/**
 * Recursive function to fill a cell on the board 
 * with valid input
 * @param {*} row row index to fill next
 * @param {*} col column index to fill next
 * @returns true if filled successful, else false
 */
function recursive_fill(row, col){
    let valid_position = true;
    var board = document.getElementById("board")
    try {
        valid_position = rcEditable(row,col)
    } catch (error) {
        return true;
    }

    //find the next position
    if(col < 8){
        var next = [row, col+1]
    }else{ 
        var next = [row+1, 0]
    }
    
    //only try to fill in non-locked positions
    if(valid_position === true){
        let possible = get_valid(row, col);
        for(let i = 0; i<possible.length; i++){
            set_cell(row, col, possible[i]);
            
            if(recursive_fill(next[0], next[1])){
                return true;
            }
        }
        //if none of the positions work, clear the cell
        set_cell(row,col, "");
    }

    //if position is already filled, skip it
    else{
        if(recursive_fill(next[0], next[1])){
            return true;
        }
    }

    //no values worked, return false
    return false
}

/**
 * Returns an array of valid moves for the cell at [row, col]
 * @param {int} row row index of cell
 * @param {int} col column index of cell
 * @returns {Array} Array of possible moves
 */
function get_valid(row, col){
    let board = document.getElementById("board");
    let existing = [];

    //Check column
    for(let i=0; i<board.rows.length; i++){
        existing.push(board.rows[i].cells[col].innerHTML);
    }
    
    //Check row
    for(let i = 0; i<board.rows[row].cells.length; i++){
        existing.push(board.rows[row].cells[i].innerHTML)
    }

    //Check subgrid
    let row_start = Math.floor(row/3) * 3;
    let row_end = row_start + 3;

    let col_start =  Math.floor(col/3) * 3;
    let col_end = col_start + 3;

    for(let i = row_start; i<row_end;i++){
        for(let j = col_start; j<col_end;j++){
            existing.push(board.rows[i].cells[j].innerHTML);
        }
    }
    
    //Find all values not included in existing
    let possible = [];
    for(let i=1; i<=9; i++){
        if(!existing.includes(String(i))){
            possible.push(i);
        }
    }
    possible.sort(() => Math.random()-0.5)
    return possible;
}

/**
 * Checks the board to see if it is valid
 * @param {*} row row index to check
 * @param {*} col column index to check
 * @returns true if board is valid, else false
 */
function check(row, col){
    let board = document.getElementById("board");
    let existing = [];

    //Check column
    for(let i=0; i<board.rows.length; i++){
        let value = board.rows[i].cells[col].innerHTML
        if(value != ""){
            existing.push(value);
        }
    }
    
    //check for duplicates
    if(new Set(existing).size !== existing.length){
        return false;
    }

    existing =[]
    //Check row
    for(let i = 0; i<board.rows[row].cells.length; i++){
        let value = board.rows[row].cells[i].innerHTML
        if(value != ""){
            existing.push(value);
        }
    }
    //check for duplicates
    if(new Set(existing).size !== existing.length){
        return false;
    }

    existing =[]

    //Check subgrid
    let row_start = Math.floor(row/3) * 3;
    let row_end = row_start + 3;

    let col_start =  Math.floor(col/3) * 3;
    let col_end = col_start + 3;

    for(let i = row_start; i<row_end;i++){
        for(j = col_start; j<col_end;j++){
            let value = board.rows[i].cells[j].innerHTML
            if(value != ""){
                existing.push(value);
            }
        }
    }

    //check for duplicates
    return (new Set(existing).size == existing.length)
}

/**
 * Validates the data entry in each cell and forces it to adhere
 */
function validate(){
    //if the text is nothing, do nothing
    if(this.innerHTML ==""){return}
    
    let board = document.getElementById("board");
    let valid = ["1", "2", "3", "4", "5", "6", "7", "8", "9"]

    //Enforce only single digit
    if (this.innerHTML.length > 1){
        this.innerHTML = this.innerHTML.substring(0,1)
    }
    //Invalid input, clear the line
    else if(!valid.includes(this.innerHTML)){
        this.innerHTML = "";
    }
    //Valid input
    else{
        //Get next cell and focus
        let row = this.parentNode.rowIndex
        let cell = this.cellIndex
        let num = row*9+cell+1
        if(num < board.rows.length * board.rows[0].cells.length){
            document.getElementsByTagName("td")[num].focus()
        }else{
            document.activeElement.blur() //unfocus on current element
        }
    }
}

/**
 * Gets the page ready
 */
function initialize(){
    //Add validate event listener to all cell objects
    let all_cells = document.getElementsByTagName("td")
    for(let i = 0; i<all_cells.length; i++){
        all_cells[i].addEventListener("DOMSubtreeModified", validate);
        all_cells[i].addEventListener("keyup", navigate)
    }
    show_solve(false)
}

function navigate(e){
    // function placeCaretAtEnd(element) {
    //     if (typeof window.getSelection != "undefined"
    //             && typeof document.createRange != "undefined") {
    //         var range = document.createRange();
    //         range.selectNodeContents(element);
    //         range.collapse(false);
    //         var sel = window.getSelection();
    //         sel.removeAllRanges();
    //         sel.addRange(range);
    //     }
    // }
    
    let row = this.parentNode.rowIndex
    let cell = this.cellIndex
    let num = row*9+cell
    switch(e.keyCode){
        case 38: //up arrow
            do{
                num -=9
            }while(!iEditable(num))
            break
        case 40: //down arrow
            do{
                num +=9
            }while(!iEditable(num))
            break
        case 37: //left arrow
            do{
                num-=1
            }while(!iEditable(num))
            break
        case 39: //right arrow
            do{
                num+=1
            }while(!iEditable(num))
            break
        default:
            return
    }
    let board = document.getElementById("board");
    if(num < board.rows.length * board.rows[0].cells.length){
        document.getElementsByTagName("td")[num].focus()
        //placeCaretAtEnd(document.getElementsByTagName("td")[num])
    }else{
        document.activeElement.blur() //unfocus on current element
    }
}

/**
 * Function to clear the Board to empty state
 */
function clear_board(){
    //set all cells to blank  
    let all_cells = document.getElementsByTagName("td");
    for(let i = 0; i<all_cells.length; i++){
        all_cells[i].innerHTML = "";
        all_cells[i].contentEditable = true;
        all_cells[i].className = ""
    }
    //show the set button
    show_solve(false)
    memory = null
}

/**
 * Function to randomize the board
 */
function randomize(){
    //clear the board then fill
    clear_board()
    recursive_fill(0,0)
    show_solve(true)
    
    //Step through and remove values at random
    let all_cells = document.getElementsByTagName("td");
    memory = []
    for(let i = 0; i<all_cells.length; i++){
        memory.push(String(all_cells[i].innerHTML))
        //console.log(all_cells[i].innerHTML)
        if(Math.random() > 0.4){
            all_cells[i].innerHTML = "";
        }else{
            all_cells[i].contentEditable = false;
            all_cells[i].className = "restricted"
        }
    }
}