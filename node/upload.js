var fs = require('fs'),
    path = require('path');

var Upload = {
    init: function(root) {
        this.root = root;
    },
    post: function(req, res, form) {
        var id = form.id;
        var shop = form.shop;
        var filename = form.filename || '';
        var data = form.data;
        var isImage = filename.match(/.(png|jpg|gif)$/i);

        var dir = path.resolve(path.join(this.root, shop || ''));
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
		
        dir = path.resolve(path.join(dir, id || ''));
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        dir = path.resolve(path.join(dir, form.dir || ''));
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        filename = path.resolve(path.join(dir, filename));
        if (isImage) {
            this.writeImageFile(filename, data);
        } else {
            this.writeFile(filename, data);
        }

        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
        res.end('{}');
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

exports.Upload = Upload;