/**
 * Channel
 * 
 * The Channel API presents a shim of a modern cross-window, same-origin data-transfer base using Deferred Objects, WebWorkers and BroadcastChannel
 * Channel conforms to the CROP
 * Note: The Channel API was tailored specifically to fit bug #94 (https://www.github.com/noty/issues/94)
 * of Noty (A Note Web Application built with ReactJS - https://www.github.com/noty/). The main essence of Channel in Noty was when the notes didn't update
 * if the app was open in a different window/browser tab
 * 
 * @author Bukhari Muhammad
*/


// Too much issues, bad documentation too... This is our road to cross-window/frame and maybe cross-browser communications
// However let's checkout if other guys did some stuff

export default class Channel {
	init() {
		let channelHostConfig = {
			// DeferredHost: js/DeferredHost.js
			boundURL: 'js/DeferredHost.js'
		}
		// let listeners = []

		return new Promise((resolve, reject) => {

			if (!window.Worker) reject(this.workersUnsupported())
			resolve(this.workersSupported)

			return void 0;
		// Call channel method when window.Worker is resolved
		}).then(() => this.workersSupported(channelHostConfig))
	}

	/**
	 * Channel.observe(Observer <Function>) - Watches any changes made in the page's build architecture (scripts, broken images/urls, WebStorage CRUD, DOM change)
 	 * then fires a core function that sends a message to the bound listeners to take action. It will be called in Channel.workersSupported
 	 * 
	 * @return status { Object }
 	 * 			-> sync: <string> Contains the data transferred at the last give moment in which any data-transfer was observed. Manual data-transfer is included
 	 * 			-> 
	*/
	static observe(Observer, ...listeners) {}

	workersUnsupported() {
		// debug
		let debugMsg = "WebWorkers not supported. Multiple windows of Noty can't establish live feedbacks from the database using a worker factory function";

		// throw debugMsg
		return debugMsg
	}

	send(data) {
		let host = this.channelServiceInstance

		// console.log(host)
		// return postMessage(data)
	}

	receive(handler) {
		let host = this.channelServiceInstance

		return onmessage ? onmessage(handler) : console.error("onmessage is not defined")
	}

	workersSupported(channelHostConfig) {
		let deferredHandler = (resolve, reject) => {
			resolve(nonBlocking)
		}
		let deferredEstablishHost = new Promise(deferredHandler)

		function nonBlocking() {
			// Resolve message for debugging
			console.log(`[CHANNEL : notyChannel] Channel ready... deferredHandler resolved to nonBlocking (current context)\nfrom <module> ${location.href}/js/Channel.js`)
			// Set host channel thread instance as core Channel prototype
			Channel.prototype.channelServiceInstance = new Worker(channelHostConfig.boundURL)
		}

		return deferredEstablishHost.then(() => nonBlocking())
	}

}
