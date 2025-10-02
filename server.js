const http = require('http');
const url = require('url');
let data = ["1", "2"];
const server = http.createServer((req, res) => {
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    const pathname = parsedUrl.pathname;
    const method = req.method;
    if (pathname !== '/data') 
    {
        res.statusCode = 404;
        res.end('Not Found');
        return;
    }
    if (method === 'GET') 
    {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
    } 
    else if (method === 'POST') 
    {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const parsed = JSON.parse(body);
                if (!parsed.item) {
                    res.writeHead(400);
                    res.end('item field is required');
                    return;
                }
                data.push(parsed.item);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(data));
            } catch (e) 
            {
                res.writeHead(400);
                res.end('Invalid JSON');
            }
        });
    } 
    else if (method === 'PUT') 
    {
        const itemToUpdate = parsedUrl.searchParams.get('item');
        if (!itemToUpdate) 
        {
            res.writeHead(400);
            res.end('Query parameter "item" is required');
            return;
        }
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const parsed = JSON.parse(body);
                if (!parsed.newItem) {
                    res.writeHead(400);
                    res.end('Body field "newItem" is required');
                    return;
                }
                const index = data.indexOf(itemToUpdate);
                if (index === -1) {
                    res.writeHead(404);
                    res.end('Item to update not found');
                    return;
                }
                data[index] = parsed.newItem;
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(data));
            } catch (e) 
            {
                res.writeHead(400);
                res.end('Invalid JSON');
            }
        });
    } 
    else if (method === 'DELETE') 
    {
        const itemToDelete = parsedUrl.searchParams.get('item');
        if (!itemToDelete) {
            res.writeHead(400);
            res.end('Query parameter "item" is required');
            return;
        }
        const index = data.indexOf(itemToDelete);
        if (index === -1) {
            res.writeHead(404);
            res.end('Item to delete not found');
            return;
        }
        data.splice(index, 1);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
    } 
    else 
    {
        res.writeHead(405);
        res.end(`${method} Method Not Allowed`);
    }
});
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/data`);
});