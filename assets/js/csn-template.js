var divElement = document.createElement("div");
var containerIdStr = "nnvsvc-csn-container";

divElement.id = containerIdStr;
divElement.style.cssText = "\
  width: 269px; padding: 10px; position: absolute;\
  border: 1px dashed #000; position: fixed; right: 0;\
  bottom: 0; margin: 10px 2px 2px 10px; z-index: 1000000; \
";

document.body.appendChild(divElement);

chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
  var containerElm = document.getElementById(containerIdStr);

  if (msg.status === "start") {
    containerElm.innerHTML = "<p>Loading...</p>";
  } else if (msg.status === "done" && typeof msg.text === "object") {
    var audioElmStr = "\
      <p><marque>" + msg.text.title + "</marque></p>\
      <audio style=\"width: 269px;\" autoplay loop controls>\
        <source src=\"" + msg.text.url + "\" />\
      </audio>\
    ";

    containerElm.innerHTML = audioElmStr;
  } else if (msg.status === "fail") {
    alert(msg.text)
  }
});
