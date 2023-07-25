console.log("testing")

let moveInt: number = 0;

let rows: number = 6;
let cols: number = 7;

let gameOver: boolean = false;

enum STATUS {
    AVAILABLE = 'AVAILABLE',
    P1_SELECTED = 'P1_SELECTED',
    P2_SELECTED = 'P2_SELECTED',
  }

class Tile {

    id: number
    status: STATUS
    element: HTMLDivElement

    constructor(id: number) {
        this.id = id
        this.status = STATUS.AVAILABLE
        this.element = document.createElement('div')
        this.element.classList.add('tile')
        this.element.classList.add(this.status.toLowerCase())
        this.element.addEventListener('click', () => {
            
            this.handleClick()
          })
        
      }

      handleClick() {
        if (this.status === STATUS.P1_SELECTED || this.status === STATUS.P2_SELECTED || gameOver === true) return

        this.element.classList.remove(this.status.toLowerCase())
        if (moveInt % 2 === 0  ) this.status = this.status === STATUS.AVAILABLE ? STATUS.P2_SELECTED : STATUS.AVAILABLE
        else this.status = this.status === STATUS.AVAILABLE ? STATUS.P1_SELECTED : STATUS.AVAILABLE
        this.element.classList.add(this.status.toLowerCase())
        moveInt = moveInt + 1;

      }

      get isSelectedP1() {
        return this.status === STATUS.P1_SELECTED
      }

      get isSelectedP2() {
        return this.status === STATUS.P2_SELECTED
      }


}

class Row {

    id: number
    tiles: Tile[]
    element: HTMLDivElement

    constructor(id: number, tileNumber: number) {
        this.id = id
        this.tiles = Array.from({ length: tileNumber }).map((_, index) => {
          const tileId = tileNumber * id + index
          return new Tile(tileId)
        })
        this.element = document.createElement('div')
        this.element.classList.add('row')
        this.element.append(...this.tiles.map((tile) => tile.element))
      }

      get selectedSeatsIdP1() {
        return this.tiles.filter((tile) => tile.isSelectedP1).map((tile) => tile.id)
      }

      get selectedSeatsIdP2() {
        return this.tiles.filter((tile) => tile.isSelectedP2).map((tile) => tile.id)
      }

}

class TileMap {
    rows: Row[]
    selectedTilesP1: number[] = []
    selectedTilesP2: number[] = []
    element: HTMLDivElement

    constructor(rowNumber: number,tileNumberPerRow: number) {
        this.rows = Array.from({ length: rowNumber }).map((_, index) => {
          return new Row(index, tileNumberPerRow)
        })
        this.element = document.createElement('div')
        this.element.classList.add('tile-map')
        this.element.append(...this.rows.map((row) => row.element))
        this.element.addEventListener('click', () => {
            this.getSelectedSeatsIdP1()
            this.getSelectedSeatsIdP2()

            if (moveInt === rows*cols  ) console.log("draw")


          })
       
      }

      getSelectedSeatsIdP1() {
         this.selectedTilesP1 = this.rows.reduce<number[]>((total, row) => {
           total = [...total, ...row.selectedSeatsIdP1]
           return total
         }, [])
         //console.log(`selected tiles: ${this.selectedTilesP1.join(',')}`)
         //console.log('P1: '+checkIfWinner(this.selectedTilesP1))
         //console.log(moveInt)

         
      }

      getSelectedSeatsIdP2() {
        this.selectedTilesP2 = this.rows.reduce<number[]>((total, row) => {
          total = [...total, ...row.selectedSeatsIdP2]
          return total
        }, [])
        //console.log(`selected tiles: ${this.selectedTilesP2.join(',')}`)
        console.log('P2: '+checkIfWinner(this.selectedTilesP2))
        //console.log(moveInt)

        
     }
}


class resetButton {

    element: HTMLDivElement

    constructor() {

        this.element = document.createElement('div')
        this.element.classList.add('reset')
        this.element.innerText = 'reset'

        this.element.addEventListener('click', () => {
            
            this.handleClick()
            location.reload();

          })
        
      }

      handleClick() {

        this.element.innerText = 'pressed'

        

        

      }
 }


//const boardMap = new TileMap(rows,cols)
//document.getElementById('game')?.appendChild(boardMap.element)

class displayLayout {

    gameContainer: HTMLDivElement


    constructor() {
       
        const boardMap = new TileMap(rows,cols)

        const resetElement = new resetButton
        
        this.gameContainer = document.createElement('div')
        this.gameContainer.id = 'gameSpace'
        this.gameContainer.classList.add('gameSpace')

        const scoreElement = document.createElement('div')
        scoreElement.classList.add('score')
        scoreElement.innerText = 'White Turn'

        

        this.gameContainer.appendChild(boardMap.element)
        this.gameContainer.appendChild(scoreElement)
        this.gameContainer.appendChild(resetElement.element)
        

        this.gameContainer.addEventListener('click', () => {

            if(checkIfWinner(boardMap.selectedTilesP1)) {
                scoreElement.innerText = 'Black Wins'
                gameOver = true
            }
            else if(checkIfWinner(boardMap.selectedTilesP2)) {
                scoreElement.innerText = 'White Wins'
                gameOver = true
            }
            else {

            if (moveInt === rows*cols  ) scoreElement.innerText = 'Draw'
            else {

            if (moveInt % 2 === 0 ) scoreElement.innerText = 'White Turn'
            else scoreElement.innerText = 'Black Turn'
            }
        
        }

            


          })

        

        document
          .getElementById('game')
          ?.append(this.gameContainer)
      }

      





}

const tets = new displayLayout()


function checkIfWinner(board: Array<number>) {
    // Horizontal check
    for (let j = 0; j < cols*(rows-1); j=j+cols) {

      for (let i = 0; i < cols-4; i++) {
        if (
            board.includes(j+i) &&
            board.includes(j+i+1) &&
            board.includes(j+i+2) &&
            board.includes(j+i+3) &&
            board.includes(j+i+4)
        ) {
          return true
        }
      }
    }



    // Vertical check
    for (let j = 0; j < cols; j++) {

      for (let i = 0; i < rows*(cols-4); i=i+cols) {

        if (
            board.includes(j+i) &&
            board.includes(j+i+cols) &&
            board.includes(j+i+2*cols) &&
            board.includes(j+i+3*cols) &&
            board.includes(j+i+4*cols)
        ) {
          return true
        }
      }
    }

    // Diagonal down check
    for (let j = 0; j < cols-4; j++) {

        for (let i = 0; i < rows*(cols-4); i=i+cols) {

  
          if (
              board.includes(j+i) &&
              board.includes(j+1+(i+cols)) &&
              board.includes(j+2+(i+cols*2)) &&
              board.includes(j+3+(i+cols*3)) &&
              board.includes(j+4+(i+cols*4))
          ) {
            return true
          }
        }
      }  

          // Diagonal up check
    for (let j = 0; j < cols-4; j++) {

        

        for (let i = 4*cols; i < rows*(cols); i=i+cols) {


  
          if (
              board.includes(j+i) &&
              board.includes(j+1+(i-cols)) &&
              board.includes(j+2+(i-cols*2)) &&
              board.includes(j+3+(i-cols*3)) &&
              board.includes(j+4+(i-cols*4))
          ) {
            return true
          }
        }
      }  





    
  
    
  
    return false
  }
