document.addEventListener('DOMContentLoaded', function () {
  const message = new URL(document.URL).searchParams.get("msg");
  const union = new URL(document.URL).searchParams.get("union");
  document.getElementById("loaded-message").innerText = message;
  document.getElementById("reason").innerText
    = "The reason provided by " + union + " is:"
});
