import React from 'react'
import ReactDOM from 'react-dom'
// import Quill from 'quill'
// import jSQL from './src/lib/jsql'
// import jQuery from 'jquery'
// import Bootstrap from 'bootstrap'

// Components
import Note from './src/components/note'
import Animations from './src/js/Animations'
import Polyfills from './src/js/polyfills'
import query from './src/js/query'
// Channel module lib
// import Channel from './src/js/Channel'
// Hosted Channel
// import DeferredHost from './src/js/DeferredHost'


/**
 * Noty Core Setup - A minimal yet useful note taking app
 */
class Noty extends React.Component {
	constructor(props) {
		super(props)

		// Initialize properties
		this.state = {
			notes: [],
			showMore: false,
		}

		this.addNote = this.addNote.bind(this)
		this.rmNote = this.rmNote.bind(this)
		this.updateNote = this.updateNote.bind(this)
		this.editNote = this.editNote.bind(this)
		this.saveNote = this.saveNote.bind(this)
		this.showMore = this.showMore.bind(this)
	}

	componentWillMount() {
		// Initialize polyfills
		let polyfills = new Polyfills()
		// Latest notes first... makes more sense, right?
		// this.state.notes.reverse()

		/**
		 * Noty Database
		 */

		// indexedDB support handler
		// window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB
		// window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || {READ_WRITE: "readwrite"}
		// window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange

		// Handle no-support error
		if (!window.indexedDB) {
			let errMsg = 'WARNING: IndexedDB support is required for Noty to store notes locally. No support results in data loss.'
			// debug
			throw new ReferenceError(errMsg)
			// user
			alert(errMsg)

			return
		}

		// Create database
		this.notyDB = window.indexedDB.open('NotyDB', 1)

		// Setup schema
		this.notyDB.onupgradeneeded = (e) => {
			let db = e.target.result,
				notesObjectStore = db.createObjectStore('notes', { keyPath: 'id', autoIncrement: true })
		}

		// Populate this.state.notes in DESC order
		this.notyDB.onsuccess = (e) => {
			let db = e.target.result,
				notesObjectStore = db.transaction(['notes']).objectStore('notes'),
				notes = notesObjectStore.getAll()

			notes.onsuccess = (e) => {
				/*// Append 'row key' to notes for later reference
				notesObjectStore.getAllKeys().onsuccess = (e) => {
					notes.result.forEach((note, i) => {
						note.key = e.target.result[i]
					})
				}*/

				this.setState({
					notes: notes.result.reverse()
				})
			}
		}

		/**
		 * Load the channel module once the database has been set
		*/
	}

	componentDidMount() {
		// Animations init when DOM is ready
		let animations = new Animations()
	}

	/*
	 * CRUD Functions
	 */

	addNote(note) {
		// Submitted via form
		if (this.refs) {
			const {title, body} = this.refs
			
			note = {
				title: title.value,
				date: new Date(Date.now()).toISOString(),
				time: `${new Date().getHours()}:${new Date().getMinutes()} ${ new Date().getHours() > 12 ? 'PM' : 'AM' }` || '--:--',
				body: body.value
			}

			// Reset
			title.value = ''
			body.value = ''

			this.setState({showMore: false})
		}

		// @todo handle errors
		if (!note.title)
			return
		// if (this.state.notes.find((notes) => notes.title === note.title))
		// 	return

		// Add new note to DB
		let db =this.notyDB.result,
			notesObjectStore = db.transaction(['notes'], 'readwrite').objectStore('notes')

		notesObjectStore.add(note)/*.onsuccess = (e) => note.key = e.target.result*/
			
		// Prepend new note
		this.state.notes.unshift(note)
	}

	rmNote(e) {
		let noteIndex = e.target.attributes.index.value

		if (window.confirm("Are you sure you'd like to delete this note?")) {
			this.setState({
				notes: this.state.notes.filter((v, i) => {
					return i != noteIndex
				})
			})

			// Delete note record from DB
			let db =this.notyDB.result,
				notesObjectStore = db.transaction(['notes'], 'readwrite').objectStore('notes')

			notesObjectStore.delete(this.state.notes[noteIndex].id)
		}
	}

	updateNote(index, data) {
		let newNote = this.state.notes[index]

		// Merge updates
		newNote.title = data.title
		newNote.body = data.body
		newNote.date = new Date(Date.now()).toISOString()
		
		this.setState({
			notes: this.state.notes.fill(newNote, index, index)
		})

		// Put newNote to DB
		let db =this.notyDB.result,
			notesObjectStore = db.transaction(['notes'], 'readwrite').objectStore('notes')

		notesObjectStore.put(newNote)
	}

	editNote(e) {
		let noteIndex = e.target.attributes.index.value,
			note = document.getElementById(`note-${noteIndex}`),
			title = note.children[0].children[0],
			body = note.children[1],
			actions = note.children[0].children[1]

		for (let child of actions.children) {
			child.style.display = 'none'
		}

		this.setState({showMore: false})

		actions.lastChild.style.display = 'inline-block'
		note.setAttribute('edit', true)
		title.contentEditable = true
		body.contentEditable = true

		title.focus()
	}

	saveNote(e) {
		let noteIndex = e.target.attributes.index.value,
			note = document.getElementById(`note-${noteIndex}`),
			title = note.children[0].children[0],
			body = note.children[1],
			actions = note.children[0].children[1]

		// Reset
		// wtf nigga... when r u gonna stop using for..of loop? i told u it is applied to es6 harmony maps and sets only
		for (let child of actions.children) {
			child.style.display = 'inline-block'
		}
		
		actions.lastChild.style.display = 'none'
		note.setAttribute('edit', false)
		title.contentEditable = false
		body.contentEditable = false

		// @todo scroll up body content on save

		// Save new content
		this.updateNote(noteIndex, {
			title: title.innerHTML,
			body: body.innerHTML
		})
	}

	showMore() {
		this.setState({showMore: true})
	}

	/*
	 * UI
	 */

	render() {
		let state = this.state,
			notes = state.notes

		return (
			<div id="noty">
				<div className="text-center" style={{margin: '70px 0 0'}}>
					<h1 style={{fontFamily: 'Pacifico', marginBottom: '15px', color: '#ff70a4'}}>Noty</h1>
					<p><i className="title-slogan" style={{fontFamily: "Pacifico"}}>Such a busy world, one powerful note</i></p>
				</div>
				
				<main className="view container">
					<div className="col-sm-12" style={{margin: '100px auto 0', maxWidth: '600px'}}>
						<form onSubmit={e => {e.preventDefault(); this.addNote()}}>
							<div className="form-group input-group">
								<input
									ref="title"
									type="text"
									className="form-control"
									placeholder="New Entry..."
									onFocus={this.showMore}
									title="Create new note"
								required />
								<span className="input-group-btn">
									<button
										className="btn btn-default"
										type="submit"
									><i className="fa fa-plus"></i></button>
								</span>
							</div>
							<div className="form-group" id="more" style={{display: (state.showMore) ? 'block' : 'none'}}>
								<textarea id="new-note-body" ref="body" rows="10" className="form-control" placeholder="Add a body to your note..."></textarea>
							</div>
						</form>
						<br />
						<br />
						<br />
						<div className="list-group" id="notes-container">
							{/*<h4 className="header header-suttle">3 days ago</h4>*/}

							{
								notes.empty(function() {
									return <h1>No notes... Create new one!</h1>
								})
							}

							{
								notes.map((note, i) => {
									return (
										<Note key={i} note={note} editNote={this.editNote} rmNote={this.rmNote} saveNote={this.saveNote} />
									)
								})
							}
						</div>
					</div>
				</main>
			</div>
		)
	}
}

ReactDOM.render(<Noty />, document.getElementById('noty-wrapper'))


/*

It took place on {{ date }}. Please make sure we can parse expression strings and execute them as we see fit (users are unable to execute actual scripts. They can only do arithmetic & date/time displaying... Maybe variables can be declared i.e. {{ cost : 2300 }} and return values can be saved/populated to some object as index : return). It would look something like this:
1. Today is {{ day }}
2. Yesterday was {{ yesterday }}
3. Tomorrow is {{ tomorrow }}
4. Time is {{ time as d.m.y }}
5. Total budget is roughly {{ annualCost : 5000; netExpenditures : 2.3; netExpenditures * annualCost }}
6. {{ time as d.m }} is {{ friend : Bob; Bob }}'s birthday...

*/

/*

How about when long notes are clicked it spans the whole note area
How about we put all the settings on the side & we use some animations
How about ability to drag notes (asssign & manipulate component keys)
How about ability to make audio/video/img/doc/emoji notes

*/