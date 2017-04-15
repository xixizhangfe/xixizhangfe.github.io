/* var mainElem=document.getElementById("sec1");
document.onreadystatechange=function(){
if(document.readyState=="complete"){
	mainElem.style.minHeight=(document.documentElement.clientHeight-100)+"px";
	window.onresize=function(){
		mainElem.style.minHeight=(document.documentElement.clientHeight-100)+"px";
		};
	} 
}; */

var mainElem=document.getElementById("sec1");

   document.onreadystatechange=function(){

    if(document.readyState=="complete"){
	

     mainElem.style.minHeight=(document.documentElement.clientHeight-document.getElementById("header").style.height)+"px";



     window.onresize=function(){

      mainElem.style.minHeight=(document.documentElement.clientHeight-100)+"px";

     };

    }

   };   