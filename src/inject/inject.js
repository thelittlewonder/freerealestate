// Unique ID for the className.
var MOUSE_VISITED_CLASSNAME = 'selected-element';

// Previous dom, that we want to track, so we can remove the previous styling.
var prevDOM = null;

chrome.extension.sendMessage({}, function (response) {
	var readyStateCheckInterval = setInterval(function () {
		if (document.readyState === "complete") {
			clearInterval(readyStateCheckInterval);

			// Mouse listener for any move event on the current document.
			document.addEventListener('mousemove', function (e) {
				var srcElement = e.srcElement;

				// Lets check if our underlying element is a IMG.
				if (prevDOM != srcElement && srcElement.nodeName == 'A') {

					var requestUrl = "https://medium--abhisheksharm22.repl.co/?url=" + srcElement.href;
					var linkBox = document.createElement('div');
					linkBox.id = 'details';

					// For NPE checking, we check safely. We need to remove the class name
					// Since we will be styling the new one after.
					if (prevDOM != null) {
						prevDOM.classList.remove(MOUSE_VISITED_CLASSNAME);
					}
					if (document.getElementById('details')) {
						document.getElementById('details').remove();
					}

					// Add a visited class name to the element. So we can style it.
					srcElement.classList.add(MOUSE_VISITED_CLASSNAME);

					srcElement.addEventListener('click', async function (e) {
						e.preventDefault();
						fetch(requestUrl)
							.then(
								function (response) {
									if (response.status !== 200) {
										console.log('Looks like there was a problem. Status Code: ' +
											response.status);
										return;
									}
									
									// Examine the text in the response
									response.json().then(function (data) {
										linkBox.innerHTML = JSON.stringify(data.result);
										console.log(data);
										document.body.appendChild(linkBox);
									});
								}
							)
							.catch(function (err) {
								console.log('Fetch Error :-S', err);
							});
					})

					// The current element is now the previous. So we can remove the class
					// during the next ieration.
					prevDOM = srcElement;
				}
			}, false);

		}
	}, 10);
});