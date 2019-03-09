var mkdirp = require("mkdirp");
const path = require("path");

const directory = path.join(__dirname, "me/cagas/mi/pelo/idiota");

mkdirp.sync(directory);

var appDir = path.dirname(require.main.filename);
console.log(process.cwd());
