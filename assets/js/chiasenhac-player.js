$(function() {
  var menuContexts = ["link"];
  var menuContextForPages = ["*://www.chatwork.com/*"];
  var yqlAPIEndpoint = "https://query.yahooapis.com/v1/public/yql?q=";

  chrome.contextMenus.create({
    title: "Play with this link",
    documentUrlPatterns: menuContextForPages,
    contexts: menuContexts,
    onclick: playCSN
  });

  /**
   * Get direct music direct link from ChiaSeNhac.vn URL
   * @param  {Object} pageInfo Page info
   * @param  {Object} tabInfo  Tab info
   * @return {Void}            Send direct URL to view
   */
  function playCSN(pageInfo, tabInfo) {
    var csnUrl = pageInfo.linkUrl;

    if (_isValidCSNUrl(csnUrl)) {
      var yqlStatement = [
        "SELECT * FROM html WHERE url='",
        csnUrl,
        "' AND xpath='//div[@align=\"left\"]//script[not(@src)]'"
      ].join("");
      _sendMessageToView({status: "start"});

      $.ajax({
        url: yqlAPIEndpoint + encodeURIComponent(yqlStatement) + "&format=json",
        success: function(response) {
          _sendMessageToView({
            status: "done",
            text: _getCSNDirectUrl(response)
          });
        },
        error: function(xhr, ajaxOpts, error) {
          _sendMessageToView({status: "fail", text: error});
        }
      });
    } else {
      _sendMessageToView({status: "fail", text: "Invalid URL"});
    }
  }

  // Private functions
  /**
   * Check link is valid ChiaSeNhac.vn URL
   * @param  {String}  csnUrl Link fro page info
   * @return {Boolean}        Is valid ChiaSeNhac.vn URL
   */
  function _isValidCSNUrl(csnUrl) {
    return (csnUrl && /^https?\:\/\/(www\.)?chiasenhac.vn\/mp3\/.*\.html$/.test(csnUrl));
  }

  /**
   * Send message to view
   * @param  {Mixed} message Message to send
   * @return {Void}          Sed message to view
   */
  function _sendMessageToView(message) {
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, message);
    });
  }

  /**
   * Get direct link ChiaSeNhac.vn
   * @param  {Object} yqlResponse Object response from YQL
   * @return {String}             Direct link to file
   */
  function _getCSNDirectUrl(yqlResponse) {
    var directUrl = "";
    var queryResults = yqlResponse.query.results;

    if (queryResults.script.length) {
      directUrl = queryResults.script[0].content;
      directUrl = directUrl.match(/(?!title\:)\".*\"/g);

      if (directUrl.length >= 3) {
        directUrl = {
          title: directUrl[0].replace(/^\"|\"$/g, ""),
          url: directUrl[1].replace(/^\"|\"$/g, "")
        };
      }
    }

    return directUrl;
  }
});
