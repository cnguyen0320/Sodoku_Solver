
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
    if(!recursive_fill(0,0)){
        alert("Puzzle contains 0 solutions");
    }
}

/**
 * Recursive function to fill a cell on the board 
 * with valid input
 * @param {*} row row index to fill next
 * @param {*} col column index to fill next
 * @returns true if filled successful, else false
 */
function recursive_fill(row, col){
    let value = "";
    var board = document.getElementById("board")
    try {
        value = board.rows[row].cells[col].innerHTML;
    } catch (error) {
        return true;
    }

    //find the next position
    if(col < 8){
        var next = [row, col+1]
    }else{ 
        var next = [row+1, 0]
    }
    
    //fill in this position with possible values
    if(value == ""){
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
        for(j = col_start; j<col_end;j++){
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
        row = this.parentNode.rowIndex
        cell = this.cellIndex
        num = row*9+cell+1
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
    }
}