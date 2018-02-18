/*
 * 
 * Noty Animations - Implements GreenSock's TweenLite, TweenMax, TimelineLite & TimelineMax components
 * 
*/

import GreenSock from 'gsap'
import query from './query'

const { TimelineLite, TimelineMax, TweenLite, TweenMax } = GreenSock



export default class Animations /*extends GreenSock*/ {

	constructor() {
		this.init()
	}

	init() {
		console.log("[ANIMATIONS] Animations running...")

		// let localeTweener = new Tweener()

		// Call all instances of animation classes
		// localeTweener.init()
	}
	
}

class Tweener /*extends TweenLite*/ {
	init() {
		// buttons.forEach((button) => {
			// let tween = TweenLite.fromTo(button, 2, {
			// 	x: 100,
			// 	ease: Power1.easeInOut,
			// 	delay: 2,
			// 	// onComplete: () => console.log("[Animations]<Tweener> Tween cleared..."),
			// 	// onCompleteParams: [button, button.textContent]
			// }, {
			// 	x: 55
			// })
			
		// })

	}
}
