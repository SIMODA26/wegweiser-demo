/**
 * Paracelsus Wegweiser: Kurzlader
 * Lädt paracelsus-widget.js aus demselben Ordner, in dem diese Datei liegt.
 * Es gibt nur noch ein Chat-Fenster (paracelsus-widget.js); diese Datei bleibt, damit alte Einbindungen weiterlaufen.
 */
(function () {
  if (window.ParacelsusWidgetLoaded) {
    if (window.ParacelsusWidget && typeof window.ParacelsusWidget.open === "function") window.ParacelsusWidget.open();
    return;
  }
  var selbst = document.currentScript;
  var basis = selbst && selbst.src ? selbst.src.substring(0, selbst.src.lastIndexOf("/")) : "";
  var s = document.createElement("script");
  s.src = basis + "/paracelsus-widget.js";
  s.defer = true;
  if (selbst && selbst.dataset) {
    Object.keys(selbst.dataset).forEach(function (k) { s.dataset[k] = selbst.dataset[k]; });
  }
  document.head.appendChild(s);
})();
