(function () {
  "use strict";
  const button=document.getElementById("clear-remembered-location");
  const status=document.getElementById("clear-location-status");
  if(!button || !status) return;
  button.addEventListener("click",()=>{
    try {
      localStorage.removeItem("ssf-selected-area");
      localStorage.removeItem("ssf-selected-country");
      status.textContent="Remembered guide and country cleared. Other settings and browser history are unchanged.";
    } catch {status.textContent="Browser storage could not be accessed. Use your browser’s site-data controls if you need to clear it.";}
  });
  button.hidden=false;
})();
