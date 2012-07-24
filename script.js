//Añado el botón que calculará los puntos
var vez = 0;
var dinero_inicial = 40000000;
var boton = "<div id='mi_div' class='article_header2'><div><a id='boton_calcula_puntos' class='newbutton new_message_btn' >CALCULAR DINERO</a><div><div id='mis_resultados' class='oculto' style='padding:1em;display:none'>Ahora se ve...<div></div>";
var usuarios = new Array();

$( "#postwrap").prepend(boton);
//Añado el listener para el boton
$( "#boton_calcula_puntos" ).bind("click", handlerClick);

function handlerClick( evnt ) {
	if($( "#mis_resultados").hasClass("oculto")){
		if(vez===0){
			//Todavia no se ha hecho el calculo, llamo a la función que se encargará de ello
			window.localStorage.clear();
			goInicioTemporada();
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
    if(ano===12 && mes<5) return 1;
    if(ano===12 && mes===5 && dia<15) return 1;
    else return 0;
}
