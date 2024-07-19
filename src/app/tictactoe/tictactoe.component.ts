import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tictactoe',
  templateUrl: './tictactoe.component.html',
  styleUrl: './tictactoe.component.css'
})

export class TictactoeComponent implements OnInit
 {

       ngOnInit(): void
          {
                  let allCells = localStorage.getItem("allCellsKey");
                  this.cells = allCells?JSON.parse(allCells):Array(10).fill(null);

                  let allMovesStr = localStorage.getItem("allMovesKey");
                  this.allMoves = allMovesStr?JSON.parse(allMovesStr):[];
          }


     //Creating two players
     playerA:Player=new Player("PlayerA","X",true,false);
     playerB:Player=new Player("PlayerB","O",false,false);


     //gameStatus
     gameStatus:string="gameActive";


     //array to store player moves(not considering 0th index)............
     cells:string[]=Array(10).fill(null);


     //moves array
     allMoves:string[]=[];


     //for changing the color of winning grid
     winGridComb:number[]=[];


     // From editable to not editable players name and vice versa..............
       updatePlayerName(platerLabel:string){

              if(platerLabel==="A")
                {
                    this.playerA.isEditing=!this.playerA.isEditing;
                }
                else if(platerLabel==='B')
                {
                    this.playerB.isEditing=!this.playerB.isEditing;
                }
       }


     makeMove(index:number)
       {
            //if  slot not free return
            if(this.cells[index]!=null || this.gameStatus!=="gameActive"){return;}

            //find the correct player turn
            const player = this.playerA.isTurn?this.playerA:this.playerB;

            //reflect at HTMl
            this.cells[index]=player.symbol;

            //Pushing current move in allMoves array
            this.allMoves.push(player.name + " plays " + player.symbol + " at " + index);

            if(this.allMoves.length>5){

                this.allMoves.shift();
            }

            //local storage
            localStorage.setItem("allCellsKey",JSON.stringify(this.cells));
            localStorage.setItem("allMovesKey",JSON.stringify(this.allMoves));


            //check for win draw
            this.checkGameState();


            //flip the turn
            if(this.gameStatus==='gameActive'){

              this.playerA.isTurn=!this.playerA.isTurn;
              this.playerB.isTurn=!this.playerB.isTurn;

            }
          }

          checkGameState(){

            const player = this.playerA.isTurn?this.playerA:this.playerB;

            const winCombinations = [

                   [1,2,3],[4,5,6],[7,8,9],
                   [1,4,7],[2,5,8],[3,6,9],
                   [1,5,9],[3,5,7]
               ]

               for(let comb of winCombinations){

                   let [a,b,c]=comb;

                   if(this.cells[a]===player.symbol && this.cells[b]===player.symbol && this.cells[c]===player.symbol )
                    {
                        this.gameStatus=player.name + " WINS";
                        this.winGridComb=comb;//for setting the color of winning grid
                        return;//if game win don't need to check for the game draw so returning
                    }
               }

          // for draw
          let isDraw = true;
          for(let i=1;i<10;i++){

            if(this.cells[i]==null){isDraw=false}
          }
          if(isDraw){
            this.gameStatus="Game Draw";
          }
      }

      resetGame(){

              //cells clear
              this.cells=Array(10).fill(null);
              //all moves
              this.allMoves=[];
              //gameStatus
              this.gameStatus="gameActive";
              //flip turn
              this.playerA.isTurn=true;
              this.playerB.isTurn=false;
              //wingridComb
              this.winGridComb=[];
              //clear localstorage
              localStorage.clear();
      }
  }

//Class for Players
class Player
{

  name:string;
  symbol:string;
  isTurn:boolean;
  isEditing:boolean;

  constructor(name:string,symbol:string,isTurn:boolean,isEditing:boolean){

          this.name=name;
          this.symbol=symbol;
          this.isTurn=isTurn;
          this.isEditing=isEditing;
  }
}
