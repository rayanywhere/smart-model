module.exports = {
    id: {
        type: "string",
        length: 32,
        default: "",
        index: "unique"
    },
    name: {
        type: "string",
        length: 16,
        default: ""
    },
    age: {
        type: "integer",
        default: 18,
        index: "ordinary"
    },
    cardNo: {
        type: "string",
        length: 10,
        default: "",
        index: "unique"
    }
};