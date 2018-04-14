addEventHandler(window, 'load', function (e) {
    $('#playerX').style = 'background-color: #888888';
    addEventHandler($('#playArea'), 'pointerdown', makeMove);
    addEventHandler($('#newGame'), 'pointerdown', function (e) { location.reload(); });
    addEventHandler($('#newGame2'), 'pointerdown', function (e) { location.reload(); });
    addEventHandler($('#undo'), 'pointerdown', undoLastMove);
    addEventHandler($('#startPVP'), 'pointerdown', startPVP);
    addEventHandler($('#startPVE'), 'pointerdown', startPVE);
    addEventHandler($('#startDemo'), 'pointerdown', startDemo);
});  

var player = 0; // 0-X, 1-O
var moves = [];
var isPVE = false;
var isDemo = false;
var undoTimer;

var svgX = '<svg height="30" width="30">' +
    '<line x1="0" y1="0" x2="30" y2="30" style="stroke:rgb(200,200,200);stroke-width:5" />\n' +
    '<line x1="0" y1="30" x2="30" y2="0" style="stroke:rgb(200,200,200);stroke-width:5" />\n' +
    'Sajnos ez a böngésző nem támogatja az SVG-t.\n' +
    '</svg>';
var svgO = '<svg height="30" width="30">\n' +
    '<circle cx="15" cy="15" r="12" stroke="rgb(200,200,200)" stroke-width="5" fill="none"/>\n' +
    'Sajnos ez a böngésző nem támogatja az SVG-t.\n' +
    '</svg>';

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
        e.target.innerHTML = svgX;
    }else{
        e.target.innerHTML = svgO;
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
        $('#results').appendChild(createPic('img/happy.jpg', 'Egy mosolygó smiley'));
    }else{
        $('#resultText').innerHTML = 'Döntetlen';
        $('#results').appendChild(createPic('img/dontetlen.jpg', 'Egy kép egy Minionról'));
    }
    $('#results').style.visibility = 'visible';
    removeEventHandler($('#playArea'), 'pointerdown', makeMove);

    // Ha megjelent volna játék közben, akkor elrejtük ezeket
    $('#undo').style.visibility = 'hidden';  // elrejtjük a visszalépés gombot
    $('#undoTimer').style.visibility = 'hidden';  // elrejtjük a visszaszámlálást
}

function createPic(src, alt){
    var img = document.createElement("img");
    img.setAttribute("src", src);
    img.setAttribute("alt", alt);
    img.setAttribute("width", "100%");
    return img;
}

function undoLastMove(e) {
    clearInterval(undoTimer);
    $('#' + moves[moves.length-1]).style.color = '#dddddd';  // visszaállítjuk az eredeti színt a mezőre
    $('#undo').style.visibility = 'hidden';  // elrejtjük a visszalépés gombot
    $('#undoTimer').style.visibility = 'hidden';  // elrejtjük a visszaszámlálást
    // eltüntetjük az összes mező kiemelést
    for(i=1; i<=9; i++){
        $('#m' + i).style = 'background-color: #444444';
    }

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

            $('#m' + i).style = 'background-color: #888888';
            $('#m' + (i+1)).style = 'background-color: #888888';
            $('#m' + (i+2)).style = 'background-color: #888888';
            return $('#m' + i).innerHTML;
        }
    }

    // függőleges keresés
    for(var i=1; i<=3; i++){
        if($('#m' + i).innerHTML !== '' &&
            $('#m' + i).innerHTML === $('#m' + (i+3)).innerHTML &&
            $('#m' + i).innerHTML === $('#m' + (i+6)).innerHTML){

            $('#m' + i).style = 'background-color: #888888';
            $('#m' + (i+3)).style = 'background-color: #888888';
            $('#m' + (i+6)).style = 'background-color: #888888';
            return $('#m' + i).innerHTML;
        }
    }

    // átlós keresés
    if($('#m1').innerHTML !== '' &&
        $('#m1').innerHTML === $('#m5').innerHTML &&
        $('#m1').innerHTML === $('#m9').innerHTML){

        $('#m1').style = 'background-color: #888888';
        $('#m5').style = 'background-color: #888888';
        $('#m9').style = 'background-color: #888888';
        return $('#m1').innerHTML;
    }
    if($('#m3').innerHTML !== '' &&
        $('#m3').innerHTML === $('#m5').innerHTML &&
        $('#m3').innerHTML === $('#m7').innerHTML){

        $('#m3').style = 'background-color: #888888';
        $('#m5').style = 'background-color: #888888';
        $('#m7').style = 'background-color: #888888';
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

function startDemo(e) {
    $('#startScreen').style.visibility = 'hidden';
    isPVE = true;
    isDemo = true;
}

function makeAIMove() {
    var num = 0;
    do {
        num = Math.floor((Math.random() * 9) + 1);
    }while($('#m' + num).innerHTML !== '');

    if(player === 0){
        $('#m' + num).innerHTML = svgX;
    }else{
        $('#m' + num).innerHTML = svgO;
    }
    changePlayer()

    moves.push('m' + num);
    $('#moves').innerHTML = moves;

    var end = isEnd();
    if(end !== -1 && isDemo){
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
    else if(end !== -1 && !isDemo){
        gameEnd(end);
    }
}
