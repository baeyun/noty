import React from 'react'

export default class Note extends React.Component {
	render() {
		let props = this.props,
			date = new Date(props.note.date).toDateString(),
			noteCreatedTime = props.note.time,
			index = this._reactInternalFiber.key

		return (
			/*
			 * @todo
			 * 		- Add maximum text-limit, and in the settings page
			 * 		- VelocityJS/WebGL (though WebGL isn't supported everywhere... Thats not the issue, it's bcoz it is 3d hardware graphics-intensive)
			 * 		- 
			 * 		- 
			*/
			<div id={'note-' + index} className="note-item list-group-item list-group-item-action flex-column align-items-start">
				<div className="d-flex w-100 justify-content-between">
					<h5 className="title mb-1">{props.note.title}</h5>
					<div className="actions">
						<i index={index} onClick={props.editNote} className="edit-note fa fa-pencil"></i>
						<i index={index} onClick={props.rmNote} className="delete-note fa fa-close"></i>
						<button style={{display: 'none'}} index={index} onClick={props.saveNote} className="btn btn-success btn-sm" type="button">Save</button>
					</div>
				</div>
				<p className="body mb-1">{props.note.body}</p>
				<small style={{fontStyle: 'italic'}}>{date}</small>
				<small style={{fontStyle: 'italic', float: 'right'}}>{noteCreatedTime}</small>
			</div>
		)
	}
}

// Export component
// module.exports = Note
