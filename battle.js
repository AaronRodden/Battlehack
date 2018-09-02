
/*
* Code written for Battlecode: West hackathon on August 25-26th
* Written by: Aaron Rodden, Andy Lo, Alexander Garcia, and Shaan Shiekh
*
*/


class MyRobot extends BCAbstractRobot {

    gamesetup() {
        this.teams = {};
        this.step = 0;
        this.mysignal = null;
        this.isSetup = true;
        this.robotNearMe = false;
        this.robotAdjacent = false;
        this.direction = this.pickDirection();
        this.action = "";
        this.finalnexus = false;
        this.nexuslead = false;
        this.tryingspots = false;
        this.attackflag = false;
        this.moveList = [];
        this.priorityMap = new Array(7);
        for (var i = 0; i < 7; i++) {
            this.priorityMap[i] = new Array(7);
        }
    }

    calcsignal(turn){
        return [0,9,12,1,14,7,4,11,0,5,2,13,6,15,10,3][(turn + 8* this.me().team)%16]
    }

    getteam(id){
        return this.teams[id];
    }

    updateNeighborhood(turn){
        var visible = this.getVisibleRobots();
        for (var i = 0; i < visible.length; i++) {
            if (!this.getteam(visible[i].id)){
                if (visible[i].signal%2 == turn%2){
                    if (visible[i].signal == this.calcsignal(turn)){
                        this.teams[visible[i].id] = false;
                    }
                    else {
                        this.teams[visible[i].id] = true;
                    }
                }
                else {
                    if (visible[i].signal == this.calcsignal(turn-1)){
                        this.teams[visible[i].id] = false;
                    }
                    else {
                        this.teams[visible[i].id] = true;
                    }
                }
            }
        }
    }

    turnsetup(){
        if (typeof this.step == 'undefined') {
            this.gamesetup();
        }
        //this.action = "";
        this.step++;
        this.signal(this.calcsignal(this.step));
        this.updateNeighborhood(this.step);
    }

    getfriendlynearby(){
        var visible = this.getVisibleRobots();
        var visiblefriendly = [];
        for (var i = 0; i < visible.length; i++) {
            if (!this.getteam(visible[i].id)){
                visiblefriendly.push(visible[i]);
            }
        }
        return visiblefriendly;
    }

    gethostilenearby(){
        var visible = this.getVisibleRobots();
        var visiblehostile = [];
        for (var i = 0; i < visible.length; i++) {
            if (this.getteam(visible[i].id)){
                visiblehostile.push(visible[i].id);
            }
        }
        return visiblehostile;
    }

    gethostilenearby1(){
        var visible = this.getVisibleRobots();
        var visiblehostile = [];
        for (var i = 0; i < visible.length; i++) {
            if (this.getteam(visible[i].id)){
                visiblehostile.push(visible[i]);
            }
        }
        return visiblehostile;
    }


    turn() {

       this.turnsetup();


      //purely for debugging
        if ((this.me().team) == 0) {
          this.action = "Nothing";
          return this.execute();
        }

        var potentialAttack = this.attackAdjacent();
        //this.log(this.step);
        if (potentialAttack != null) {
            this.action = "Attack";
            this.direction  = potentialAttack;
            return this.execute();
        }
        else {
            this.action = "Nothing";
        }


        //   var enemiesHere = this.gethostilenearby1();
        //   if (enemiesHere.length > 0) {
        //       for (var i = 0; i < enemiesHere.length; i++) {
        //           var enemy = enemiesHere[i];
        //             if (this.me().x == enemy.x && Math.abs(this.me().y-enemy.y) == 2) {
        //                 if (this.me().y - enemy.y < 0) { //we are on the right side
        //                     var leftMove = Math.floor(Math.random() * 5);
        //                     if (leftMove == 0 && this.getInDirection(bc.NORTHWEST) == bc.EMPTY) {
        //                         this.direction = bc.NORTHWEST;
        //                         this.action = "Move";
        //                         return this.execute;
        //                     }
        //                     else if (leftMove == 1 && this.getInDirection(bc.WEST) == bc.EMPTY) {
        //                         this.direction = bc.WEST;
        //                         this.action = "Move";
        //                         return this.execute;
        //                     }
        //                     else if (leftMove == 2 && this.getInDirection(bc.SOUTHWEST) == bc.EMPTY) {
        //                         this.direction = bc.SOUTHWEST;
        //                         this.action = "Move";
        //                         return this.execute;
        //                     }
        //                     else if (leftMove == 3 && this.getInDirection(bc.NORTH) == bc.EMPTY) {
        //                         this.direction = bc.NORTH;
        //                         this.action = "Move";
        //                         return this.execute;
        //                     }
        //                     else if (leftMove == 4 && this.getInDirection(bc.SOUTH) == bc.EMPTY) {
        //                         this.direction = bc.SOUTH;
        //                         this.action = "Move";
        //                         return this.execute;
        //                     }
        //                 }

        //                 if (this.me().y - enemy.y > 0) { //we are on the left side
        //                     var rightMove = Math.floor(Math.random() * 5);
        //                     if (rightMove == 0 && this.getInDirection(bc.NORTHEAST) == bc.EMPTY) {
        //                         this.direction = bc.NORTHEAST;
        //                         this.action = "Move";
        //                         return this.execute;
        //                     }
        //                     else if (rightMove == 1 && this.getInDirection(bc.EAST) == bc.EMPTY) {
        //                         this.direction = bc.EAST;
        //                         this.action = "Move";
        //                         return this.execute;
        //                     }
        //                     else if (rightMove == 2 && this.getInDirection(bc.SOUTHEAST) == bc.EMPTY) {
        //                         this.direction = bc.SOUTHEAST;
        //                         this.action = "Move";
        //                         return this.execute;
        //                     }
        //                     else if (rightMove == 3 && this.getInDirection(bc.SOUTH) == bc.EMPTY) {
        //                         this.direction = bc.SOUTH;
        //                         this.action = "Move";
        //                         return this.execute;
        //                     }
        //                     else if (rightMove == 4 && this.getInDirection(bc.NORTH) == bc.EMPTY) {
        //                         this.direction = bc.NORTH;
        //                         this.action = "Move";
        //                         return this.execute;
        //                     }
        //                 }
        //             }

        //             if (this.me().y == enemy.y && Math.abs(this.me().x-enemy.x) == 2) {
        //                 if (this.me().x - enemy.x < 0) { //we are above enemy
        //                     var upMove = Math.floor(Math.random() * 5);
        //                     if (upMove == 0 && this.getInDirection(bc.NORTHWEST) == bc.EMPTY) {
        //                         this.direction = bc.NORTHWEST;
        //                         this.action = "Move";
        //                         return this.execute;
        //                     }
        //                     else if (upMove == 1 && this.getInDirection(bc.WEST) == bc.EMPTY) {
        //                         this.direction = bc.WEST;
        //                         this.action = "Move";
        //                         return this.execute;
        //                     }
        //                     else if (upMove == 2 && this.getInDirection(bc.EAST) == bc.EMPTY) {
        //                         this.direction = bc.EAST;
        //                         this.action = "Move";
        //                         return this.execute;
        //                     }
        //                     else if (upMove == 3 && this.getInDirection(bc.NORTHEAST) == bc.EMPTY) {
        //                         this.direction = bc.NORTHEAST;
        //                         this.action = "Move";
        //                         return this.execute;
        //                     }
        //                     else if (upMove == 4 && this.getInDirection(bc.NORTH) == bc.EMPTY) {
        //                         this.direction = bc.NORTH;
        //                         this.action = "Move";
        //                         return this.execute;
        //                     }
        //                 }

        //                 if (this.me().x - enemy.x > 0) { //we are below enemy
        //                     var downMove = Math.floor(Math.random() * 5);
        //                     if (downMove == 0 && this.getInDirection(bc.SOUTHWEST) == bc.EMPTY) {
        //                         this.direction = bc.SOUTHWEST;
        //                         this.action = "Move";
        //                         return this.execute;
        //                     }
        //                     else if (downMove == 1 && this.getInDirection(bc.WEST) == bc.EMPTY) {
        //                         this.direction = bc.WEST;
        //                         this.action = "Move";
        //                         return this.execute;
        //                     }
        //                     else if (downMove == 2 && this.getInDirection(bc.EAST) == bc.EMPTY) {
        //                         this.direction = bc.EAST;
        //                         this.action = "Move";
        //                         return this.execute;
        //                     }
        //                     else if (downMove == 3 && this.getInDirection(bc.SOUTHEAST) == bc.EMPTY) {
        //                         this.direction = bc.SOUTHEAST;
        //                         this.action = "Move";
        //                         return this.execute;
        //                     }
        //                     else if (downMove == 4 && this.getInDirection(bc.SOUTH) == bc.EMPTY) {
        //                         this.direction = bc.SOUTH;
        //                         this.action = "Move";
        //                         return this.execute;
        //                     }
        //                 }
        //             }

        //             //here
        //             if (Math.abs(this.me().x - enemy.x) == 2 && Math.abs(this.me().y - enemy.y) == 2) {
        //                 var diagMove = Math.floor(Math.random() * 4);
        //                 if (diagMove == 0 && this.getInDirection(bc.NORTH) == bc.EMPTY) {
        //                     this.direction = bc.NORTH;
        //                     this.action = "Move";
        //                     return this.execute();
        //                 }
        //                 if (diagMove == 1 && this.getInDirection(bc.EAST) == bc.EMPTY) {
        //                     this.direction = bc.EAST;
        //                     this.action = "Move";
        //                     return this.execute();
        //                 }
        //                 if (diagMove == 2 && this.getInDirection(bc.SOUTH) == bc.EMPTY) {
        //                     this.direction = bc.SOUTH;
        //                     this.action = "Move";
        //                     return this.execute();
        //                 }
        //                 if (diagMove == 3 && this.getInDirection(bc.WEST) == bc.EMPTY) {
        //                     this.direction = bc.WEST;
        //                     this.action = "Move";
        //                     return this.execute();
        //                 }
        //             }

        //             if (Math.abs(this.me().x - enemy.x) == 2 && Math.abs(this.me().y - enemy.y) == 1 || Math.abs(this.me().x - enemy.x) == 1 && Math.abs(this.me().y - enemy.y) == 2) {
        //                 // this.action = "Nothing";
        //                 // return this.execute();
        //                 this.action = "Move";
        //                 this.direction = this.runAway();
        //                 return this.execute();
        //             }

        //         }
        //   }



        if (this.step % 10 == 0) {
            this.direction = this.pickDirection();
        }

        this.wander();

        return this.execute();
    }


    pickDirection() {
    var num = Math.floor(Math.random() * 8);
        if (num == 1 && this.direction != bc.NORTH && this.direction != bc.SOUTH)
            return bc.NORTH;
        else if (num == 2 && this.direction != bc.NORTHEAST && this.direction != bc.SOUTHWEST)
            return bc.NORTHEAST;
        else if (num == 3 && this.direction != bc.EAST && this.direction != bc.WEST)
            return bc.EAST;
        else if (num == 4 && this.direction != bc.SOUTHEAST && this.direction != bc.NORTHWEST)
            return bc.SOUTHEAST;
        else if (num == 5 && this.direction != bc.SOUTH && this.direction != bc.NORTH)
            return bc.SOUTH;
        else if (num == 6 && this.direction != bc.SOUTHWEST && this.direction != bc.SOUTHEAST)
            return bc.SOUTHWEST;
        else if (num == 7 && this.direction != bc.WEST && this.direction != bc.EAST)
            return bc.WEST;
        else
            return bc.NORTHWEST;
    }

    runAway() {
        if (this.direction == bc.NORTH) {
            return bc.SOUTH;
        }
        else if (this.direction == bc.NORTHEAST) {
            return bc.SOUTHWEST
        }
        else if (this.direction == bc.EAST) {
            return bc.WEST
        }
        else if (this.direction == bc.SOUTHEAST) {
            return bc.NORTHWEST
        }
        else if (this.direction == bc.SOUTH) {
            return bc.NORTH
        }
        else if (this.direction == bc.SOUTHWEST) {
            return bc.NORTHEAST
        }
        else if (this.direction == bc.WEST) {
            return bc.EAST
        }
        else if (this.direction == bc.NORTHWEST) {
            return bc.SOUTHEAST
        }
    }

    getDirection(num) {
        if (num == 0)
            return "NORTH";
        else if (num == 1)
            return "NORTHEAST";
        else if (num == 2)
            return "EAST";
        else if (num == 3)
            return "SOUTHEAST";
        else if (num == 4)
            return "SOUTH";
        else if (num == 5)
            return "SOUTHWEST";
        else if (num == 6)
            return "WEST";
        else if (num == 7)
            return "NORTHWEST";
    }

    attackAdjacent() {
        var nearby = this.gethostilenearby();
        if (nearby.includes(this.getInDirection(bc.NORTH).id))
            return bc.NORTH;
        else if (nearby.includes(this.getInDirection(bc.NORTHEAST).id))
            return bc.NORTHEAST;
        else if (nearby.includes(this.getInDirection(bc.EAST).id))
            return bc.EAST;
        else if (nearby.includes(this.getInDirection(bc.SOUTHEAST).id))
            return bc.SOUTHEAST;
        else if (nearby.includes(this.getInDirection(bc.SOUTH).id))
            return bc.SOUTH;
        else if (nearby.includes(this.getInDirection(bc.SOUTHWEST).id))
            return bc.SOUTHWEST;
        else if (nearby.includes(this.getInDirection(bc.WEST).id))
            return bc.WEST;
        else if (nearby.includes(this.getInDirection(bc.NORTHWEST).id))
            return bc.NORTHWEST;
        else
            return null;
    }

    getCoord(x, y, x1, y1) {
        var val = (x - x1).toString() + "," + (y - y1).toString();
        return val;
    }

    getMovement(oldX, oldY, newX, newY) {
        var x = oldX - newX;
        var y = oldY - newY;
        var xStr = "";
        var yStr = "";
        if(x < 0) {
            xStr = "EAST";
        }
        else if(x > 0) {
            xStr = "WEST";
        }
        if(y < 0) {
            yStr = "SOUTH";
        }
        else if(y > 0) {
            yStr = "NORTH";
        }
        return this.getDirectionFromString(yStr + xStr);
    }

    getDirectionFromString(direction) {
        if (direction == "NORTH")
            return bc.NORTHEAST;
        else if (direction == "NORTHEAST")
            return bc.NORTHEAST;
        else if (direction == "EAST")
            return bc.SOUTHEAST;
        else if (direction == "SOUTHEAST")
            return bc.SOUTHEAST;
        else if (direction == "SOUTH")
            return bc.SOUTHWEST;
        else if (direction == "SOUTHWEST")
            return bc.SOUTHWEST;
        else if (direction == "WEST")
            return bc.NORTHWEST;
        else if (direction == "NORTHWEST")
            return bc.NORTHWEST;
        else
            return bc.SOUTHEAST;
    }

    execute() {
        if(this.action == "Move") {
            if (this.getInDirection(this.direction) != bc.EMPTY || this.getInDirection(this.direction) == bc.HOLE) {
                this.direction = this.pickDirection();
            }
            return this.move(this.direction);
        }
        else if(this.action == "Attack") {
            return this.attack(this.direction);
        }
        else {
            this.log("Still");
            //var attackDirection = this.attackAdjacent();
            return null;
        }
    }

    getX() {
        if(this.step % 6 < 3) {
            return this.step % 6;
        }
        else {
            return (6 - (this.step % 6));
        }
    }

    getY() {
        if(this.step / 3 < 3) {
            return (this.step / 3) % 3;
        }
        else {
            return (6 - ((this.step / 3) % 3));
        }
    }

    goToSpawn() {
        var x = 0;
        var y = this.step % 6;
        if(this.me().health < 20)
            var x = 4;
        this.direction = this.getMovement(this.me().x, this.me().y, this.getX() + 3, this.getY() + 3);
        if((this.me().x + this.me().y) % 2 == 1)
            this.direction = bc.NORTH;
        this.action = "Move";
    }

    wander() {


        var allies = this.getfriendlynearby();

        if (this.nexuslead == true) {
            this.action = "Nothing";
            return
        }

        if (this.tryingspots == false) {
            for (var i = 0; i < allies.length; i++) {
                if (this.me().id != allies[i].id){
                    if (allies[i].x == 10 && allies[i].y == 10) {
                        //this.log("Ally prepared to nexus");
                        this.tryingspots = true;
                    }
                }
            }
        }

        if (this.tryingspots == true) {
            var botsinplace = [];
            for (var i = 0; i < allies.length; i++){
                if (this.me().id != allies[i].id) {
                    if ((allies[i].x == 10 && allies[i].y == 10) || (allies[i].x == 9 && allies[i].y == 11) || (allies[i].x == 11 && allies[i].y == 11) || (allies[i].x == 10 && allies[i].y == 12)) {
                        var inplace = true;
                        botsinplace.push(inplace);
                    }
                }
            }
            if (botsinplace.length == 4) {
                this.log("Nexus formed, now defending");
                this.action = "Move";
                this.direction = this.pickDirection();
                return
            }
        }

        if (this.tryingspots == true) {
            if ((this.me().x == 10 && this.me().y == 10) || (this.me().x == 9 && this.me().y == 11) || (this.me().x == 11 && this.me().y == 11)
            || (this.me().x == 10 && this.me().y ==12)){
                this.action = "Nothing";
                return
            }

            //first try
            var temp = this.getMovement(this.me().x,this.me().y,9,11);

            if (this.finalnexus == false){
                if(this.getInDirection(temp) == bc.EMPTY){
                    this.log("Going to 9,11");
                    this.action = "Move";
                    this.direction = temp;
                    return
                }
            }

            if (this.finalnexus == false){
                temp = this.getMovement(this.me().x,this.me().y,11,11);
                if (this.getInDirection(temp) == bc.EMPTY){
                    this.log("Going to 11,11");
                    this.action = "Move";
                    this.direction = temp;
                    return
                }
            }

            temp = this.getMovement(this.me().x,this.me().y,10,12);

            this.finalnexus = true;
            this.log("Going to 10,12");
            this.action = "Move";
            this.direction = temp;
            return



        }

        if (this.me().x == 10 && this.me().y == 10) {
            this.log("I am prepared to nexus");
            this.action = "Nothing";
            this.nexuslead == true;
            return
        }

        var x = 10;
        var y = 10;
        this.action = "Move";
        this.direction = this.getMovement(this.me().x,this.me().y,x,y);
        return;
    }

}
