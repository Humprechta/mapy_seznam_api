var _data = "";
_obj = Array();
function pridej(){
    _data = prompt("Je záchod zdarma, či na kód?","Záchod je na kód #4421");

    if (_data == null) {
        return;
    }
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition,showError);
    }else{
        return;
    }
}
    $.ajax({
        url: 'server_history.php', // <-- point to server-side PHP script 
        dataType: 'text',  // <-- what to expect back from the PHP script, if anything
        cache: false,
        contentType: false,
        processData: false,                       
        type: 'post',
        success: function(php_script_response){// <-- display response from the PHP script, if any
            _obj = JSON.parse(php_script_response);
        }
    });
function showPosition(p){
    //console.log("Název: "+_data+"N: "+p.coords.latitude+" E: "+p.coords.longitude)    ; 
    var form_data = new FormData();
    form_data.append("N",p.coords.latitude);
    form_data.append("E",p.coords.longitude);
    form_data.append("DATA",_data);
    $.ajax({
        url: 'server_save.php', // <-- point to server-side PHP script 
        dataType: 'text',  // <-- what to expect back from the PHP script, if anything
        cache: false,
        contentType: false,
        processData: false,
        data: form_data,                         
        type: 'post',
        success: function(php_script_response){// <-- display response from the PHP script, if any
            if(php_script_response == true){
                alert("Úspěšně uloženo");
                location.reload();
                return;  
            }
            alert(php_script_response);
        }
    });
}
const xhttp = new XMLHttpRequest();
xhttp.onload = function() {
    const obj = JSON.parse(this.responseText);
    loadMap(obj);
    }
xhttp.open("GET", "server_load.php", true);
xhttp.send();


//load iframeMapy
function loadMap(responseArray){
var obrazek = "https://api.mapy.cz/img/api/marker/drop-red.png";

var m = new SMap(JAK.gel("m"));
m.addDefaultControls();
m.addControl(new SMap.Control.Sync()); /* Aby mapa reagovala na změnu velikosti průhledu */
m.addDefaultLayer(SMap.DEF_BASE).enable(); /* Turistický podklad */
var mouse = new SMap.Control.Mouse(SMap.MOUSE_PAN | SMap.MOUSE_WHEEL | SMap.MOUSE_ZOOM); /* Ovládání myší */
m.addControl(mouse); 

var vrstva = new SMap.Layer.Marker();     /* Vrstva se značkami */
var souradnice = [];
// data pro markery
console.log(responseArray);
var markers = responseArray;
// vytvoreni markeru
var array_historie = Array();
var pocet = 0;
var neco = 0;
markers.forEach(function(marker) {
    neco = 0;
    var c = SMap.Coords.fromWGS84(marker.coords); /* Souřadnice značky, z textového formátu souřadnic */
    var card = new SMap.Card();
    card.getHeader().innerHTML = "<strong>"+marker.name+"</strong>";
    for (var i=0;i<_obj.length;i++) { /* Hodně textu, aby přetekl */
        if(_obj[i].id_data == marker.id){
            array_historie.push(_obj[i].data);
            pocet ++;
        }
    }
    //naplni data
    for (let index = 1; index < array_historie.length + 1; index++) {
        card.getBody().innerHTML += index + ". "+array_historie[pocet -1]+"<br>";
        pocet --;
        neco ++;
    }
    array_historie.length = 0;
    if(neco != 0){ 
    card.getBody().style.margin = "5px 0px";
    card.getBody().style.backgroundColor = "#ccc";
    card.setSize(200, 200);
    }else{
        card.getBody().style.margin = "5px 0px";
        card.getBody().style.backgroundColor = "#ccc";
        card.setSize(200, 125);
        card.getBody().innerHTML = "zatím tu není žádná historie."
    }
    card.getFooter().innerHTML = "Aktualizovat";
    card.getFooter().onclick = function(e){
        aktualizuj(marker.id,marker.name);
    }
    //card.getBody().innerHTML = "Ahoj, já jsem <em>obsah vizitky</em>!";
var options = {
        url: obrazek,
        title: marker.name,
        anchor: {left:10, bottom: 1}  /* Ukotvení značky za bod uprostřed dole */
    }
    
    // duletize je prirazeni id jednotlivemu markeru - vlastni id, jinak se generuje nahodne
    var znacka = new SMap.Marker(c, marker.id, options);
    znacka.decorate(SMap.Marker.Feature.Card, card);
    souradnice.push(c);
    vrstva.addMarker(znacka);
});

// zobrazime a povolime vrstvu - pokud by se vrstva povolila pred vkladanim markeru, tak by se s kazdym vlozenym markerem prekreslovala mapa a pocitaly pozice vsech markeru
m.addLayer(vrstva);                          /* Přidat ji do mapy */
vrstva.enable();                         /* A povolit */

var cz = m.computeCenterZoom(souradnice); /* Spočítat pozici mapy tak, aby značky byly vidět */
m.setCenterZoom(cz[0], cz[1]);      

 /* Došlo ke kliknutí, spočítáme kde 
function click(e, elm) {
    var coords = SMap.Coords.fromEvent(e.data.event, m);
    alert("Kliknuto na " + coords.toWGS84(2).reverse().join(" "));
}
m.getSignals().addListener(window, "map-click", click);  */    


// poslouchani na kliknuti u markeru
m.getSignals().addListener(this, "marker-click", function(e) {
// vybrany marker
var marker = e.target;
var id = marker.getId();
console.log(marker.getTitle());

return;
// zobrazime jeho jmeno - parovani vybraneho markeru pomoci jeho id a nasich vstupnich dat
for (var i = 0; i < markers.length; i++) {
    if (markers[i].id == id) {
        alert(markers[i].name);
        
        
    break;
    }
}
});
}
//aktualizovat bod (ajax)
function aktualizuj(id,old_data){
    txt = prompt("Je záchod zdarma, či na kód?","Záchod je na kód #4421");
    if (txt == null) {
        return;
    }
    var form_data = new FormData();
    form_data.append("id",id);
    form_data.append("DATA",txt);
    form_data.append("old_data",old_data);
    $.ajax({
        url: 'server_aktualizace.php', // <-- point to server-side PHP script 
        dataType: 'text',  // <-- what to expect back from the PHP script, if anything
        cache: false,
        contentType: false,
        processData: false,
        data: form_data,                         
        type: 'post',
        success: function(php_script_response){// <-- display response from the PHP script, if any
            if(php_script_response == 1){
                alert("Děkujieme,\núspěšně aktualizováno.");
                location.reload();
                return;
            }
            alert("Něco se nepovedlo\n"+php_script_response);
        }
    });
}


function showError(error) {
switch(error.code) {
    case error.PERMISSION_DENIED:
    alert("User denied the request for Geolocation.");
    break;
    case error.POSITION_UNAVAILABLE:
    alert("Location information is unavailable.");
    break;
    case error.TIMEOUT:
    alert("The request to get user location timed out.");
    break;
    case error.UNKNOWN_ERROR:
    alert("An unknown error occurred.");
    break;
}
}