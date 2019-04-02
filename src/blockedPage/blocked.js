document.addEventListener('DOMContentLoaded', function () {
  const params = new URL(document.URL).searchParams;
  const message = params.get("msg");
  const union = params.get("union");
  const union_url = params.get("union_url");
  Array.forEach(document.querySelectorAll(".union-name"), (el,i) => { el.innerText = union; });
  document.getElementById("union-link").href = union_url;
  document.getElementById("loaded-message").innerText = message;
  document.getElementById("reason").innerText
    = "The reason provided by " + union + " is:"
});
