
document.addEventListener('DOMContentLoaded', function () {
  theMessage = new URL(document.URL).searchParams.get("msg");
  theUnion = new URL(document.URL).searchParams.get("union");
  document.getElementById("loaded-message").innerText = theMessage;
  document.getElementById("reason").innerText
    = "The reason provided by " + theUnion + " is:"
});
