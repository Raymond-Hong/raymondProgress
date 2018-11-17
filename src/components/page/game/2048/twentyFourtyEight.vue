<template>
  <div>
      <meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=0" charset="utf-8"/>
      <table style="margin-left:5%;margin-top:8rem"
      v-swipeleft="{fn:cellsMoveTo,direction:'left'}"
      v-swiperight="{fn:cellsMoveTo,direction:'right'}"
      v-swipeup="{fn:cellsMoveTo,direction:'up'}"
      v-swipedown="{fn:cellsMoveTo,direction:'down'}"
      >
          <tr v-for="m in rowcol">
              <td v-for="n in rowcol">
                  <div :style="{background:cells[m-1][n-1].backgroundColor,width:width,height:height,
                  color:cells[m-1][n-1].color,'line-height':height,'font-size':'2rem'}">{{cells[m-1][n-1].value||""}}</div>
              </td>
          </tr>
      </table>
      <div class="button" @click="newGame">New Game</div>
      <!-- <div class="button" @click="cellsMoveTo('up')">上移</div>
      <div>
          <div class="span" @click="cellsMoveTo('left')">左移</div>
          <div class="span" @click="cellsMoveTo('right')">右移</div>
      </div>
      <div class="button" style="margin-top:3rem" @click="cellsMoveTo('down')">下移</div> -->
      <!-- <div class="button" @click="goBackStepByStep">返回</div>
      <div @click="switchToDebug">{{debug?"关闭debug模式":"开启debug模式"}}</div> -->
  </div>
</template>
<script>
export default {
    data(){
        return{
            debug:false,
            rowcol:4,
            width:5+"rem",
            height:5+"rem",
            cells:[],
            cell:{active:false,backgroundColor:"silver",color:"blue",value:0},
            color:["lime","orange","khaki","plum","peru","wheat","tomato","lawngreen","pink","gold"],
            leftMove:false,
            rightMove:false,
            upMove:false,
            downMove:false,
            canBackCells:[],
            cellsRecords:[],
            gameOver:false,
        }
    },
    created(){
        this.initGame();
        this.getNumbers();
    },
    methods:{
        updateCell(){
            this.cells = [].concat(this.cells);
        },
        updateCellColor(m,n){
            let value = this.getPower(this.cells[m][n].value);
            this.cells[m][n].color = this.color[value];
            this.cells[m][n].backgroundColor = this.color[this.color.length-1-value];
        },
        output(){
            if(this.debug){
                console.log(JSON.stringify(this.cells));
            }
        },
        switchToDebug(){
            this.debug = !this.debug;
        },
        generate(){
            if(this.upMove&&this.downMove&&this.leftMove&&this.rightMove){
                this.gameOver = true;
                alert("游戏结束");
                return;
            }
            if(this.rightMove||this.leftMove||this.upMove||this.downMove||!this.haveEnoughCell()){
                if(this.debug){
                    console.log(this.rightMove);
                    console.log(this.leftMove);
                    console.log(this.upMove);
                    console.log(this.downMove);
                }
                this.goBack();
                return;
            }
            let m,n;
            do{
                m = Math.round(Math.random()*(this.rowcol-1));
                n = Math.round(Math.random()*(this.rowcol-1));
            }while(this.cells[m][n].active);
            this.cells[m][n].active = true;
            this.cells[m][n].value = Math.round(Math.random()+1)*2;
            this.updateCellColor(m,n);
        },
        haveEnoughCell(){
            if(!this.cells.length){
                return;
            }
            let count=0;
            for(let i=0;i<this.rowcol;i++){
                for(let j=0;j<this.rowcol;j++){
                    if(!this.cells[i][j].active&&++count>=2){
                        return true;
                    }
                }
            }
            this.output();
            return count;
        },
        getNumbers(){
            this.generate();
            if(this.gameOver){
                return;
            }
            this.generate();
            if(this.gameOver){
                return;
            }
            this.cellsRecords.push(JSON.parse(JSON.stringify(this.cells)));
            this.updateCell();
        },
        getPower(val){
            for(let i=1;i<this.color.length;i++){
                if(Math.pow(2,i)==val){
                    return i-1;
                }
            }
            return this.color.length-1;
        },
        reBackCell(m,n){
            this.cells[m][n] = JSON.parse(JSON.stringify(this.cell));
        },
        twoCellsAdd(before,after){
            if(this.cells[after.m][after.n].active && this.cells[after.m][after.n].value==this.cells[before.m][before.n].value){
                this.cells[before.m][before.n].value *= 2;
                this.updateCellColor(before.m,before.n);
                this.cells[after.m][after.n] = JSON.parse(JSON.stringify(this.cells[before.m][before.n]));
            }else{
                return;
            }
            this.reBackCell(before.m,before.n);
            if(this.haveEnoughCell()&&this.haveEnoughCell()!==1){
                this.allCanMove();
            }
        },
        twoCells(before,after){
            if(this.cells[after.m][after.n].active){
                return;
            }else{
                this.cells[after.m][after.n] = JSON.parse(JSON.stringify(this.cells[before.m][before.n]));
            }
            this.reBackCell(before.m,before.n);
            if(this.haveEnoughCell()&&this.haveEnoughCell()!==1){
                this.allCanMove();
            }
        },
        allCanMove(){
            this.downMove = false;
            this.leftMove = false;
            this.rightMove = false;
            this.upMove = false;
        },
        rememberBeforeCells(){
            for(let i=0;i<this.rowcol;i++){
                this.canBackCells[i] = [];
                for(let j=0;j<this.rowcol;j++){
                    this.canBackCells[i].push(JSON.parse(JSON.stringify(this.cells[i][j])));
                }
            }
        },
        goBack(){
            this.cells = [].concat(this.canBackCells);
        },
        goBackStepByStep(){
            let index = --this.cellsRecords.length-1;
            if(index>=0){
                this.cells = [].concat(this.cellsRecords[index]);
            }
        },
        oneMoveDown(m,n,add){
            if(add){
                this.twoCellsAdd({m:m,n:n},{m:m+1,n:n});
                return;
            }
            this.twoCells({m:m,n:n},{m:m+1,n:n});
        },
        oneMoveUp(m,n,add){
            if(add){
                this.twoCellsAdd({m:m,n:n},{m:m-1,n:n});
                return;
            }
            this.twoCells({m:m,n:n},{m:m-1,n:n});
        },
        oneMoveLeft(m,n,add){
            if(add){
                this.twoCellsAdd({m:m,n:n},{m:m,n:n-1});
                return;
            }
            this.twoCells({m:m,n:n},{m:m,n:n-1});
        },
        oneMoveRight(m,n,add){
            if(add){
                this.twoCellsAdd({m:m,n:n},{m:m,n:n+1});
                return;
            }
            this.twoCells({m:m,n:n},{m:m,n:n+1});
        },
        rowMoveDown(times,add){
            if(this.debug){
                console.log("rowMove");
            }
            for(let i=this.rowcol-2;i>=times-1;i--){
                for(let j=0;j<this.rowcol;j++){
                    if(this.cells[i][j].active){
                        this.oneMoveDown(i,j,add);
                    }
                }
            }
        },
        rowMoveUp(times,add){
            for(let i=1;i<=this.rowcol-times;i++){
                for(let j=0;j<this.rowcol;j++){
                    if(this.cells[i][j].active){
                        this.oneMoveUp(i,j,add);
                    }
                }
            }
        },
        colMoveLeft(times,add){
            for(let i=1;i<=this.rowcol-times;i++){
                for(let j=0;j<this.rowcol;j++){
                    if(this.cells[j][i].active){
                        this.oneMoveLeft(j,i,add);
                    }
                }
            }
        },
        colMoveRight(times,add){
            for(let i=this.rowcol-2;i>=times-1;i--){
                for(let j=0;j<this.rowcol;j++){
                    if(this.cells[j][i].active){
                        this.oneMoveRight(j,i,add);
                    }
                }
            }
        },
        allMoving(move){
            for(let i=1;i<this.rowcol;i++){
                move(i);
            }
            move(1,true);
            for(let i=1;i<this.rowcol;i++){
                move(i);
            }
        },
        cellsMoveTo:function(obj){
            let direction = obj.direction;
            if(this.gameOver){
                return;
            }
            this.rememberBeforeCells();
            let vm=this;
            let move;
            switch(direction){
                case "left" : 
                    vm.leftMove = true;
                    move = (function(){
                        return function(val,add){
                            vm.colMoveLeft(val,add);
                        }
                    })();
                    break;
                case "right" : 
                    vm.rightMove = true;
                    move = (function(){
                        return function(val,add){
                            vm.colMoveRight(val,add);
                        }
                    })();
                    break;
                case "up" : 
                    vm.upMove = true;
                    move = (function(){
                        return function(val,add){
                            vm.rowMoveUp(val,add);
                        }
                    })();
                    break;
                case "down" :
                    vm.downMove = true;
                    move = (function(){
                        return function(val,add){
                            vm.rowMoveDown(val,add);
                        }
                    })(); 
                    break;
            }
            vm.allMoving(move);
            vm.getNumbers();
        },
        initGame(){
            let i = 0;
            while(i++ < this.rowcol){
                let j = 0;
                this.cells[i-1] = [];
                while(j++ < this.rowcol){
                    this.cells[i-1].push(JSON.parse(JSON.stringify(this.cell)));
                }
            }
        },
        newGame(){
            this.initGame();
            this.gameOver = false;
            this.cellsRecords = [];
            this.cellsRecords = [];
            this.allCanMove();
            this.getNumbers();
        }
    },
}
</script>
<style scoped>
.button{
    width: 30%;
    height: 3rem;
    line-height: 3rem;
    border-radius: 1rem;
    margin-left: 35%;
    background-color: aqua;
}
.span{
    float: left;
    width: 20%;
    height: 3rem;
    line-height: 3rem;
    border-radius: 1rem;
    margin-left: 20%;
    background-color: aqua;
}
</style>
