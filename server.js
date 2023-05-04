var http = require('http');
var fs = require('fs');

let fileListChecker = [];
let fileList = [];
let type = [];

function fileListLoop(dir) {
   fs.readdir(dir, (err, files) => {
      if (err) throw err;
      files.forEach(file => {
         if (file[0] != '.' && file != "server.js") {
            if (file.indexOf('.') > -1) {
               fileListChecker.push(dir.substr(1)+file.replace('index.html',""));
               fileList.push(dir+file);
               type.push(file.substr(file.indexOf('.')+1, file.length));
            } else {
               fileListLoop(dir+file+"/")
            }
         }
      });
   });
}

function rrFileListLoop()
{
   // Reset vars
   fileListChecker = []
   fileList = []
   type = []

   fileListLoop("./");
   setTimeout(rrFileListLoop, 5000);
}
rrFileListLoop()

function CreateServerFunction(req, res) {
   let shown = false;
   for (let i = 0; i < fileListChecker.length; i++) {
      if (req.url == fileListChecker[i] || (type[i] == "html" && req.url == fileListChecker[i].substr(0, fileListChecker[i].length - 1))) {
         fs.readFile(fileList[i], function(err, data) {
            if (err) throw err;
            if (type[i] == 'js') type[i] = 'javascript';
            res.writeHead(200, {'Content-Type': 'text/'+type[i]});
            res.write(data);
            return res.end();
         });
         shown = true;
      }
   }
   if (!shown && req.url != "/favicon.ico") {
      fs.readFile("./404.html", function(err, data) {
         if (err) throw err;
         res.writeHead(200, {'Content-Type': 'text/html'});
         res.write(data);
         return res.end();
      });
   }
}

var server = http.createServer(function (req, res) {
   CreateServerFunction(req, res);
}).listen(8080, () => console.log('Server running on port 8080'));
