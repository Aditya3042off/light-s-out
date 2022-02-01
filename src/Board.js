import React, {Component} from "react";
import Cell from "./Cell";
import './Board.css';


/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - hasWon: boolean, true when board is all off
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

class Board extends Component {

  static defaultProps = {
    nrows: 5,
    ncols: 5,
    chanceLightStartsOn: 0.35
  }

  constructor(props) {
    super(props);
    
    //Initial state

    this.state = {
      hasWon:false,
      board:this.createBoard()
    }

  }

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */

  createBoard() {
    let board = [];
    const height = this.props.nrows;
    const width = this.props.ncols;

    for(let i =0;i<height;i++) {
        let row = [];
        for(let j=0;j<width;j++) {
            let rand = Math.random();
            row.push(rand >= this.props.chanceLightStartsOn)
        }
        board.push(row);
    }
    return board;
  }

  /**makes a board from the board prop and returns it to render on the screen */

  makeTable() {
    
    return (
      this.state.board.map((row,rIdx) => (
        <tr key={rIdx}>
          {row.map((col,cIdx) => (
            <Cell 
              key={`${rIdx}-${cIdx}`}
              flipCellsAroundMe = {() => this.flipCellsAround(`${rIdx}-${cIdx}`)}
              isLit = {col}
            />
          ))}
        </tr>
      ))
    )
  }

  /** handle changing a cell: update board & determine if winner */

  flipCellsAround(coord) {
    let {ncols, nrows} = this.props;
    let board = this.state.board;
    let [y, x] = coord.split("-").map(num => parseInt(num));
    let countLit=0;
    let isWon = false;


    function flipCell(y, x) {
      // if this coord is actually on board, flip it
      if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
        board[y][x] = !board[y][x];
      }
    }

    // flip this cell and the cells around it

    flipCell(y,x); //Flip initial cell
    flipCell(y,x-1);//flip left
    flipCell(y,x+1);//flip right
    flipCell(y+1,x);//flip above
    flipCell(y-1,x);//flip below

    // win when every cell is turned off

    this.state.board.forEach(row => {
      row.forEach(col => {
        if(col) {
          countLit++;
        }
      })
    })

    if(!countLit) {
      isWon = true;
    }

    // TODO: determine is the game has been won

    this.setState({board:board, hasWon:isWon});
  }




  /** Render game board or winning message. */

  render() {
    return (
        <div>
        {this.state.hasWon ? (
          <div className='winner'>
            <span className='neon-orange'>YOU</span>
            <span className='neon-blue'>WIN!</span>
          </div>
        ) : (
          <div>
            <div className='Board-title'>
              <div className='neon-orange'>Lights</div>
              <div className='neon-blue'>Out</div>
            </div>
            <table className='Board'>
                <tbody>{this.makeTable()}</tbody>
            </table>
          </div>
        )}
      </div>  
    );
  }
}


export default Board;
