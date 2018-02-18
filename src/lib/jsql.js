/* 
 * jSQL - An SQL-like implementation of the indexedDB API
 *
 * Bukhari Muhammad <bukharim96@gmail.com>
 *
 * (https://github.com/bukharim96)
 */
export default class jSQL {
	constructor(c) {
		if (!window.indexedDB)
			throw 'IndexedDB support is required for jSQL to function.'
		
		if (!c.db)
			throw 'A database name is required.'

		this.db = c.db
		this.version = c.version || 1
		this.query_statements = []

		// Establish connection
		this.conn = window.indexedDB.open(this.db, this.version)

		return {
			on: this.on.bind(this),
			query: this.query.bind(this)
		}
	}

	on(e, callback) {
		if (e === 'error') {
			this.conn.onerror = (event) => {
				callback.call(event)
			}
		} else if (e === 'success') {
			this.conn.onsuccess = (event) => {
				this.query_statements = event.target.result
				callback.call(event)
			}
		}

		// return this
	}
	
	// Best feature
	// Requires lot of regX
	query(q) {
		var statements = q.split(';')

		for (var i in statements) {
			var s = statements[i].trim()
			
			if (s)
				this.query_statements.push(s)
		}
		// this.parseQueries();

		return this.query_statements
	}
}

// Usage
/*
var myDB = new jSQL()
myDB.connect({db: 'noty'})
myDB.on('success', () => {
	console.log('connected!')
})
myDB.on('error', () => {
	console.log('DB connection failed.')
})
console.log(myDB)
*/