/*
 * Noty Query - simple query selector engine
*/

// import Polyfills from './polyfills'

function query(sel) {
	// if (!sel) return

	let queries = document.querySelectorAll(sel)

	let _nativeEachFactory = function(eachCallback) {
		queries.forEach((...queryArgs) => {
			eachCallback.apply(null, queryArgs)
		})
		return this
	}

	let efactory  = {
		/*
		 * content - sets innerHTML of element
		*/
		content: (c) => {
			_nativeEachFactory((el) => {
				c ? el.innerHTML = c : el.innerHTML
			})
			return efactory
		},
		/*
		 * text - sets textContent of element
		*/
		text: (c) => {
			_nativeEachFactory((el) => {
				c ? el.textContent = c : el.textContent
			})
			return efactory
		},
		/*
		 * css - sets CSS of element using JavaScript object
		*/
		css: (o) => {
			_nativeEachFactory((el) => {
				for (let k in o) {
					el.style[k] = o[k]
				}
			})
			return efactory
		}
	}

	return efactory
}

export default query