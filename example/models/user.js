module.exports = {
	id: {
		type: "string",
		length: 32,
		default: "",
		index: "unique"
	},
	name: {
		type: "string",
		length: 30,
		default: ""
	}
}
