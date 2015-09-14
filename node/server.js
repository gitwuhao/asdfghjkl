var http = require('http'),
    fs = require('fs'),
    formidable = require('formidable'),
    path = require('path'),
    prot = 8901,
    Server;
Server = {
    init: function(root) {
        var me = this;
        this.root = path.normalize(path.resolve(root || '../'));
        var httpServer = http.createServer(function(req, res) {
            var form = new formidable.IncomingForm();
            form.parse(req, function(err, fields, files) {
                me.doFormFields(fields);
            });
            res.writeHead(200, {
                'Content-Type': 'application/json'
            });
            res.end('{}');

        }).listen(8901, '127.0.0.1');
    },
    doFormFields: function(fields) {
        var id = fields.id;
        var shop = fields.shop;
        var filename = fields.filename;
        var data = fields.data;

        var dir = path.resolve(path.join(this.root, shop||''));
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        dir = path.resolve(path.join(dir, id));
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        dir = path.resolve(path.join(dir, fields.dir || ''));
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        filename = path.resolve(path.join(dir, filename));
        if (fields.type == 'image') {
            this.writeImageFile(filename, data);
        } else {
            this.writeFile(filename, data);
        }
    },
    writeFile: function(fileName, data) {
        fs.writeFile(fileName, data, function(err) {
            if (err) throw err;
            console.log('It\'s write to ' + fileName + '!');
        });
    },
    writeImageFile: function(fileName, data) {
        var data = data.replace(/^data:image\/\w+;base64,/, '');
        var dataBuffer = new Buffer(data, 'base64');
        this.writeFile(fileName, dataBuffer);
    }
};

Server.init('../');