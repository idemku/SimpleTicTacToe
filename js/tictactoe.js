addEventHandler(window, 'load', function (e) {
    $('#playerX').style = 'background-color: #888888';
    addEventHandler($('#playArea'), 'pointerdown', makeMove);


});  

var player = 0; // 0-X, 1-O

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
        changePlayer();
    }else{
        e.target.innerHTML = 'O';
        changePlayer();
    }

    console.log(isEnd());
}

function isEnd() {

    // vízszintes keresés
    for(i=1; i<=7; i+=3){
        if($('#m' + i).innerHTML !== '' &&
            $('#m' + i).innerHTML === $('#m' + (i+1)).innerHTML &&
            $('#m' + i).innerHTML === $('#m' + (i+2)).innerHTML){

            return 'Nyert: ' + $('#m' + i).innerHTML;
        }
    }

    // függőleges keresés
    for(i=1; i<=3; i++){
        if($('#m' + i).innerHTML !== '' &&
            $('#m' + i).innerHTML === $('#m' + (i+3)).innerHTML &&
            $('#m' + i).innerHTML === $('#m' + (i+6)).innerHTML){

            return 'Nyert: ' + $('#m' + i).innerHTML;
        }
    }

    // átlós keresés
    if($('#m1').innerHTML !== '' &&
        $('#m1').innerHTML === $('#m5').innerHTML &&
        $('#m1').innerHTML === $('#m9').innerHTML){

        return 'Nyert: ' + $('#m1').innerHTML;
    }
    if($('#m3').innerHTML !== '' &&
        $('#m3').innerHTML === $('#m5').innerHTML &&
        $('#m3').innerHTML === $('#m7').innerHTML){

        return 'Nyert: ' + $('#m3').innerHTML;
    }

    return -1;
}
