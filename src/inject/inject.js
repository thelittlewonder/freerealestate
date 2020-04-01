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
				
				var srcElement = e.target;
				var allLinks = [];

				//get all the links nested
				var getNestedLinks = function (node) {
					if (node.hasChildNodes()) {
						var child = node.firstChild;
						if (child.hasChildNodes()) {
							if (child.nodeName == 'A') {
								allLinks.push(child);
							}
							getNestedLinks(child);
						} else {
							child = child.nextSibling;
						}
					}
				}
				getNestedLinks(srcElement);

				if (prevDOM != srcElement && (srcElement.nodeName == 'A' || allLinks.length>0)) {

					var checkUrl;
					if (srcElement.nodeName == 'A') {
						checkUrl = srcElement.href;
					} else if (allLinks.length > 0) {
						let tagsSet = new Set(allLinks);
						checkUrl = [...tagsSet][0].href;
					}
					var requestUrl = "https://medium--abhisheksharm22.repl.co/?url=" + checkUrl;
					
					//create the box
					var linkBox = document.createElement('div');
					var boxTitle = document.createElement('H3');
					var boxDesc = document.createElement('p');
					var boxIcon = document.createElement('img');
					boxIcon.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 16 16'%3E%3Cpath fill='%23fff' fill-rule='evenodd' d='M1 0a1 1 0 00-1 1v14c0 .6.4 1 1 1h14c.6 0 1-.4 1-1V1c0-.6-.4-1-1-1H1zm12.3 4.2l-.8.8-.1.2V11.3l1 .8v.2H9v-.2l.9-.8v-5l-2.3 6h-.3l-2.8-6v4l.1.5L5.8 12v.2H2.7V12l1-1.3c.2-.1.3-.3.2-.5V5.7l-.1-.3-1-1.2V4h3l2.5 5.1 2-5.1h3v.2z' clip-rule='evenodd'/%3E%3C/svg%3E";
					linkBox.appendChild(boxIcon);
					linkBox.appendChild(boxTitle);
					linkBox.appendChild(boxDesc);
					boxDesc.innerHTML = checkUrl.slice(0,40);
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
						console.log('clicked: ' + checkUrl)
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
										let result = JSON.stringify(data.result);
										result = result.slice(1, -1);
										if(result=='unpaid'){
											boxTitle.innerHTML='Free Article';
											linkBox.classList.add('free');
										} else if(result=='paid'){
											boxTitle.innerHTML='Paid Article';
											linkBox.classList.add('paid');

										} else if(result=='not medium'){
											console.log('Not Medium')
											boxTitle.innerHTML='Not Medium';
											linkBox.classList.add('invalid');
										}
										srcElement.appendChild(linkBox);
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