function cekInternet() {

    if(navigator.onLine){

        document.getElementById("loadingScreen").style.display="none";
        document.getElementById("appContent").style.display="block";

    }else{

        document.getElementById("loadingScreen").style.display="block";
        document.getElementById("appContent").style.display="none";

    }

}

window.addEventListener("online", cekInternet);
window.addEventListener("offline", cekInternet);

cekInternet();