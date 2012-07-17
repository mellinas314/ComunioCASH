//Añado el botón que calculará los puntos
var vez = 0;
var boton = "<div id='mi_div' class='article_header2'><div><a id='boton_calcula_puntos' class='newbutton new_message_btn' >CALCULAR DINERO</a><div><div id='mis_resultados' class='oculto' style='padding:1em;display:none'>Ahora se ve...<div></div>";

$( "#postwrap").prepend(boton);
//Añado el listener para el boton
$( "#boton_calcula_puntos" ).bind("click", handlerClick);

function handlerClick( evnt ) {
	if($( "#mis_resultados").hasClass("oculto")){
		if(vez===0){
			//Todavia no se ha hecho el calculo, llamo a la función que se encargará de ello
			calculaSaldos();
			vez++;
		}
		//Hago los calculos y lo muestro
		$( "#mis_resultados").show();
		$( "#mis_resultados").attr("class", "mostrado");
		
	}else{
		//Oculto los resultados
		$( "#mis_resultados").hide();
		$( "#mis_resultados").attr("class", "oculto");		
	}
}

function calculaSaldos() {
    //Compruebo si la última fecha disponible es mayor que el nuevo año (Fecha comienzo temporada === 14.05.12)
    var fecha = $(".news_date");
    fecha = fecha[$(".news_date").length - 1];
    fecha = $(fecha).attr("title");
    fecha = fecha.split(" ");
    isTemporadaIniciada(fecha[0]);
}

function isTemporadaIniciada( fecha ) {
    var dia = Number(fecha.split(".")[0]);
    var mes = Number(fecha.split(".")[1]);
    var ano = Number(fecha.split(".")[2]);
    console.log("Año: " + ano + ", mes: " + mes + "dia: " + dia);
}
