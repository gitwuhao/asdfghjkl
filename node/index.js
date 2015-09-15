var http = require('http'),
    fs = require('fs'),
    formidable = require('formidable'),
    path = require('path'),
    serverModule = require('./server'),
    uploadModule = require('./upload').Upload,
    host = '127.0.0.1',
    rootDir = '../',
    port = 8901,
    staticServer,
    httpServer,
    main;




main = {
    init: function(root) {
        var me = this;
        this.root = path.normalize(path.resolve(root || rootDir));

        uploadModule.init(this.root + '/data');

        staticServer = new serverModule.Server(rootDir);
        httpServer = http.createServer(function(req, res) {
            var url = req.url;
            if (url.match(/\/upload\/?/i)) {
                me.doUpload(req, res);
            } else {
                me.doGet(req, res);
            }
            console.log("> " + req.url + " - " + res.message);
        }).listen(port, host);
        console.info('http://' + host + ':' + port);
    },
    doForm: function(req, res, callback) {
        var form = new formidable.IncomingForm();
        form.parse(req, function(err, fields, files) {
            callback(req, res, fields);
        });
    },
    doUpload: function(req, res) {
        this.doForm(req, res, function(req, res, form) {
            uploadModule.post(req, res, form);
        });
    },
    doGet: function(request, response) {
        staticServer.serve(request, response, function(err, res) {
            var headers = request.headers;
            if (err) {
                console.error("> Error serving " + request.url + " - " + err.message);
                response.writeHead(err.status, err.headers);
                response.end();
            }
        });
    }
};

main.init(rootDir);
