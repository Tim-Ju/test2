/// <reference path="../../typings/index.d.ts" />

import * as path from "path";
import * as express from "express";
import * as webpack from "webpack";
import * as serveIndex from "serve-index";

export function serve(port?: number) {
    port = port || process.env.PORT;

    var app = express();

    setupWebpackDevelopServer(app);

    app.use('/', express.static(path.resolve(__dirname, "../../")));
    app.use('/static', express.static(path.resolve(__dirname, "../../static")));

    app.listen(port, function (err) {
        if (err) {
            console.error(JSON.stringify(err));
            return;
        }

        console.log(`\nQCloud development server served at http://localhost:${port}\n\n`);
    });

    return app;
}

function setupWebpackDevelopServer(app: express.Express) {
    var config = require('../../webpack/webpack.config');
    var compiler = webpack(config);

    var devMiddleware = require('webpack-dev-middleware')(compiler, {
        publicPath: config.output.publicPath,
        noInfo: true,
        stats: { colors: true },
        poll: true,
        quiet: false,
        reload: true
    });

    var hotMiddleware = require('webpack-hot-middleware')(compiler, { reload: true });

    app.use(devMiddleware);
    app.use(hotMiddleware);
}