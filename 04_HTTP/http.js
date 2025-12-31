const http = require('http');

http.createServer((request, response) => {
    const  path = request.url;
    const method = request.method;
    console.log(`Recevied ${method} request for: ${path}`);

    if(path.includes('/abc') && method === 'GET') {
        response.write('You have reached the /abc endpoint!');
        response.end();
    }
    else{
        response.write('hello world');
        response.end();
    }


}).listen(3000);

    console.log('Server is listening on port 3000');
