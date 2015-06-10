var path = require('path')

module.exports = {
    entry: "./client/Main.jsx",
    output: {
        path: path.join(__dirname, 'public/scripts/'),
        filename: "bundle.js",
        minimize: "true"
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" },
            { test: /\.jsx?$/, loader: "jsx?harmony&insertPragma=React.DOM"}
        ]
    }
};
