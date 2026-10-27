(function () {
  var btn = document.querySelector("[data-share]");
  if (!btn) return;
  var label = btn.textContent;
  btn.addEventListener("click", function () {
    var url = btn.getAttribute("data-url") || location.href;
    var payload = {
      title: btn.getAttribute("data-title") || document.title,
      text: btn.getAttribute("data-text") || "",
      url: url
    };
    if (navigator.share) {
      navigator.share(payload).catch(function (err) {
        if (err && err.name === "AbortError") return;
        copy(url);
      });
      return;
    }
    copy(url);
  });

  function copy(url) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(copied).catch(function () { fallback(url); });
      return;
    }
    fallback(url);
  }

  function copied() {
    btn.textContent = "Link copied";
    window.setTimeout(function () { btn.textContent = label; }, 2000);
  }

  function fallback(url) {
    var box = document.getElementById("share-fallback");
    if (!box) return;
    box.hidden = false;
    var input = box.querySelector("input");
    input.value = url;
    input.focus();
    input.select();
    btn.textContent = "Copy the link below";
  }
})();
