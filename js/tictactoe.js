addEventHandler(window, 'load', function (e) {
    $('#playerX').style = 'background-color: #888888';
    addEventHandler($('#playArea'), 'pointerdown', makeMove);
    addEventHandler($('#newGame'), 'pointerdown', function (e) { location.reload(); });
    addEventHandler($('#undo'), 'pointerdown', undoLastMove);
    addEventHandler($('#startPVP'), 'pointerdown', startPVP);
    addEventHandler($('#startPVE'), 'pointerdown', startPVE);

});  

var player = 0; // 0-X, 1-O
var moves = [];
var isPVE = false;
var undoTimer;

function changePlayer() {
    if(player === 1) {
        player = 0;
        $('#playerX').style = 'background-color: #888888';
        $('#playerO').style = 'background-color: #444444';
    }else{
        player = 1;
        $('#playerO').style = 'background-color: #888888';
        $('#playerX').style = 'background-color: #444444';
    }
}

function makeMove(e) {
    if(e.target.tagName !== 'TD'){
        return;
    }

    if(e.target.innerHTML !== ''){
        return;
    }

    if(player === 0){
        e.target.innerHTML = 'X';
    }else{
        e.target.innerHTML = 'O';
    }
    changePlayer();

    moves.push(e.target.id);
    $('#moves').innerHTML = moves;

    var end = isEnd();
    if(end !== -1){
        gameEnd(end);
    }else if(isPVE){
        makeAIMove();
    }
}

function gameEnd(end) {
    if(end !== 'D') {
        $('#resultText').innerHTML = 'Nyert: ' + end;
    }else{
        $('#resultText').innerHTML = 'Döntetlen';
    }
    $('#results').style.visibility = 'visible';
    removeEventHandler($('#playArea'), 'pointerdown', makeMove);
}

function undoLastMove(e) {
    clearInterval(undoTimer);
    $('#' + moves[moves.length-1]).style.color = '#dddddd';  // visszaállítjuk az eredeti színt a mezőre
    $('#undo').style.visibility = 'hidden';  // elrejtjük a visszalépés gombot
    $('#undoTimer').style.visibility = 'hidden';  // elrejtjük a visszaszámlálást

    // mivel a gép lépte az utolsót, ezért kétszer kell visszalépni
    $('#' + moves[moves.length-1]).innerHTML = '';
    moves.pop();
    changePlayer();
    $('#' + moves[moves.length-1]).innerHTML = '';
    moves.pop();
    changePlayer();
}

function isEnd() {

    // vízszintes keresés
    for(var i=1; i<=7; i+=3){
        if($('#m' + i).innerHTML !== '' &&
            $('#m' + i).innerHTML === $('#m' + (i+1)).innerHTML &&
            $('#m' + i).innerHTML === $('#m' + (i+2)).innerHTML){

            return $('#m' + i).innerHTML;
        }
    }

    // függőleges keresés
    for(var i=1; i<=3; i++){
        if($('#m' + i).innerHTML !== '' &&
            $('#m' + i).innerHTML === $('#m' + (i+3)).innerHTML &&
            $('#m' + i).innerHTML === $('#m' + (i+6)).innerHTML){

            return $('#m' + i).innerHTML;
        }
    }

    // átlós keresés
    if($('#m1').innerHTML !== '' &&
        $('#m1').innerHTML === $('#m5').innerHTML &&
        $('#m1').innerHTML === $('#m9').innerHTML){

        return $('#m1').innerHTML;
    }
    if($('#m3').innerHTML !== '' &&
        $('#m3').innerHTML === $('#m5').innerHTML &&
        $('#m3').innerHTML === $('#m7').innerHTML){

        return $('#m3').innerHTML;
    }

    // döntetlen ellenőrzés
    var draw = true;
    for(var i=1; i<=9; i++){
        if($('#m' + i).innerHTML === ''){
            draw = false;
        }
    }
    if(draw){
        return 'D';
    }

    return -1;
}

function startPVP(e) {
    $('#startScreen').style.visibility = 'hidden';
}

function startPVE(e) {
    $('#startScreen').style.visibility = 'hidden';
    isPVE = true;
}

function makeAIMove() {
    var num = 0;
    do {
        num = Math.floor((Math.random() * 9) + 1);
    }while($('#m' + num).innerHTML !== '');

    if(player === 0){
        $('#m' + num).innerHTML = 'X';
    }else{
        $('#m' + num).innerHTML = 'O';
    }
    changePlayer()

    moves.push('m' + num);
    $('#moves').innerHTML = moves;

    var end = isEnd();
    if(end !== -1){
        $('#m' + num).style.color = '#ff5555';
        $('#undo').style.visibility = 'visible';
        $('#undoTimer').style.visibility = 'visible';

        var counter = 5;
        $('#undoTimer').innerHTML = counter;
        undoTimer = setInterval(function () {
            counter--;
            $('#undoTimer').innerHTML = counter;
            if(counter <= 0){
                gameEnd(end);
            }
        }, 1000);
    }
}
