//Añado el botón que calculará los puntos
var vez = 0;
var dinero_inicial = 40000000;
var boton = "<div id='mi_div' class='article_header2'><div><a id='boton_calcula_puntos' class='newbutton new_message_btn' >CALCULAR DINERO</a><div><div id='mis_resultados' class='oculto' style='padding:1em;display:none'>Calculando...<div></div>";
var lista_dinero = "<div id='dinero_inicial' style='float:left;font-size:x-small;padding-left:1em;padding-right:1.5em'>Dinero inicial: <select id='sel_mio'><option value='40000000'>40.000.000€</option><option value='20000000'>20.000.000€</option><option value='9000000'>9.000.000€</option><option value='5000000'>5.000.000€</option></select></div>"
var usuarios = new Array();
var usuarios_ordenado = new Array();
$( "#postwrap").prepend(boton);
$( "#postwrap").prepend(lista_dinero);
//Añado el listener para el boton
$( "#boton_calcula_puntos" ).bind("click", handlerClick);

function handlerClick( evnt ) {
	if($( "#mis_resultados").hasClass("oculto")){
		if(vez===0){
			//Todavia no se ha hecho el calculo, llamo a la función que se encargará de ello
			window.localStorage.clear();
			dinero_inicial = parseInt($("#sel_mio").val());
			goInicioTemporada();
            $("#dinero_inicial").hide();
			vez++;
		}
		//Hago los calculos y lo muestro
		$( "#mis_resultados").show();
		$( "#mis_resultados").attr("class", "mostrado");
		$( "#boton_calcula_puntos" ).html("OCULTAR DINERO");
	}else{
		//Oculto los resultados
		$( "#mis_resultados").hide();
		$( "#mis_resultados").attr("class", "oculto");		
        $( "#boton_calcula_puntos" ).html("MOSTRAR DINERO");
	}
}

function goInicioTemporada() {
    var interval;
    window.alert("Esto puede tardar un poco... Tu ventana podría moverse durante el proceso, no te preocupes. ¡TODO VA BIEN!");
    window.scrollTo(0, 1);
    interval = setInterval(function () {
        if(isTemporadaIniciada()===0){
            window.scrollTo(0, document.body.scrollHeight-window.innerHeight);
        }else{
            window.scrollTo(0, 0);
            clearInterval(interval);
            calculaTodo();
        }
    }, 2);
}

function calculaTodo() {       
    //Obtengo todos los elementos del tablon
    var elementos = $(".article_content1 .article_content_text");
    var elementos2 = $(".article_content2 .article_content_text");
    $.merge(elementos, elementos2);
    
    for(var i=0; i<elementos.length; i++){
        //Compruebo que se trata de un post de transacciones
        if( $(elementos[i]).find("a")!==0 && $(elementos[i]).text().indexOf("cambia por ")!==-1 ) {
            //Se trata de un traspaso
            var texto = $(elementos[i]).text();
            var array_ventas = texto.split("cambia por ");
            for(var j = 1; j<array_ventas.length; j++){
                var cadena = array_ventas[j];
                //Obtengo el valor del traspaso
                var cantidad = cadena.split(" € ")[0].split(".");
                var cant_int = "";
                var tmp = cantidad;
                for(var h = 0; h<cantidad.length; h++){
                    cant_int += cantidad[h];
                }
                cantidad = parseInt(cant_int);
                //Obtengo el vendedor
                var intervienen = array_ventas[j].split(" € de ");
                intervienen = intervienen[intervienen.length - 1];
                var vendedor = intervienen.split(" a ")[0];
                vendedor = vendedor.split(".")[0];
                //Obtengo el comprador
                var comprador = intervienen.split(" a ");
                comprador = comprador[comprador.length - 1];
                comprador = comprador.split(".")[0];
                
                //Añado los usuarios si es la primera vez que participan en una transaccion
                if(window.localStorage.getItem(vendedor)===null){
                    usuarios.push(vendedor);
                    window.localStorage.setItem(vendedor, dinero_inicial);
                }
                
                if(window.localStorage.getItem(comprador)===null){
                    usuarios.push(comprador);
                    window.localStorage.setItem(comprador, dinero_inicial);
                }
                //Actualizo los valores
                var c_dinero = parseInt(window.localStorage.getItem(comprador));
                var v_dinero = parseInt(window.localStorage.getItem(vendedor));
                window.localStorage.setItem(comprador, c_dinero - cantidad);
                window.localStorage.setItem(vendedor, v_dinero + cantidad);
                
                /*if(comprador=="Palla"){                    
                console.log(array_ventas[j]);
                console.log(cant_int + " ---> " + cantidad);
                console.log(comprador + " tiene " + window.localStorage.getItem(comprador));
                }*/
            }
        }
    }               
    printResultados();
}

function printResultados() {
    ordenaUsuarios();
    var html = "<table style='border:solid; border-width:thin'>";
    for (var i = 0; i<usuarios.length; i++){
        html += "<tr><td style='padding-right:2em'><b>"+ parseInt(parseInt(i)+parseInt(1)) + ". </b>" + usuarios[i] + ":</td><td align='right'> " + addCommas(window.localStorage.getItem(usuarios[i])) + " €</td></tr>";   
    }
    html += "</table>"
    $("#mis_resultados").html(html);
}

function ordenaUsuarios() {
    var sin_computer = new Array();
    for( var i = 0; i<usuarios.length; i++){
        if(usuarios[i]!=="Computer"){
            sin_computer.push(usuarios[i]);
        }
    };
    usuarios = sin_computer;
    //ordeno de mas dinero a menos
    usuarios.sort(function(a, b) {
        return (window.localStorage.getItem(b) - window.localStorage.getItem(a));
    })
}

function getUltimaFecha() {
    var fecha = $($(".news_date")[$(".news_date").length - 1]).attr("title");
    return fecha.split(" ")[0];
}

function isTemporadaIniciada () {
    //Fecha comienzo temporada: 14.05.12
    var fecha = getUltimaFecha();
    var dia = Number(fecha.split(".")[0]);
    var mes = Number(fecha.split(".")[1]);
    var ano = Number(fecha.split(".")[2]);
    if(ano<12) return 1;
    if(ano===12 && mes<6) return 1;
    if(ano===12 && mes===5 && dia<4) return 1;
    else return 0;
}


function addCommas(nStr)
{
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + '.' + '$2');
    }
    return x1 + x2;
}
