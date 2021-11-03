const http = require("http");
const { getTasks, addTasks, updateTask, deleteTask, createTaskObj, getTaskById } = require("./todolist-servises.js");
const url = require("url");
const queryString = require("querystring");
const PORT = 8000;

http.createServer(async (request, response) => {

    response.setHeader('Access-Control-Allow-Origin', '*'); //Permitir las solicitudes desde cualquier origen
    response.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    response.setHeader('Allow', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');


    //console.log('metod otro -->', request.method);
    //console.log('url metod -->', request.url);

    if (request.method === "OPTIONS") {
        response.statusCode = 204;
        response.end();
        return;
    }


    if (request.method === "GET") {
        switch (request.url) {
            case '/':

                response.end(JSON.stringify({
                    message: "todolist server conectado"
                }))

                break;
            case "/task":

                const task = await getTasks();

                response.writeHead(200, { 'content-type': 'application/json' });

                response.end(JSON.stringify(task));

                break;
            case "/task/":

                break;

            default:
                const urlArray = url.parse(request.url, true).pathname.split('/');
                const id = urlArray[urlArray.length - 1];
                const resource = urlArray[urlArray.length - 2];

                if (resource === "task") {

                    const task = await getTaskById(id);

                    response.writeHead(200, { 'content-type': 'application/json' });

                    response.end(JSON.stringify(task));

                };

                break;
        }
    } else if (request.method === "POST") {
        switch (request.url) {
            case "/task":
                let body = "";

                //evento data ---> cuando el cliente manda datos al servidor
                request.on("data", (data) => {
                    console.log('data -->', data.toString());
                    //body += data.toString();
                    body = data.toString();
                });

                console.log('body -->', body);

                request.on("end", async () => {
                    const formato = JSON.parse(body);
                    console.log('formato -->', formato);
                    //const newObj = createTaskObj(formato);

                    await addTasks(formato);

                    response.writeHead(201, { 'content-type': 'application/json' });

                    response.end(JSON.stringify({
                        message: "se ha agregado una nueva tarea"
                    }));
                });

                break;

            default:
                break;
        }
    } else if (request.method === "PUT") {
        let body = "";
        switch (request.url) {
            case '/task':
                //Obtenemos los datos que me está enviando el cliente
                //Evento data -> se dispara cuando un cliente está enviando datos hacía el servidor
                request.on("data", (data) => {
                    body += data.toString();
                });

                request.on("end", async () => { //Finalizo la entrega / envio de datos por parte del cliente 
                    let taskObj = JSON.parse(body);

                    // await addTask(taskObj);
                    console.log(taskObj);
                    response.writeHead(201, { 'Content-Type': 'application/json' });
                    response.end(JSON.stringify({
                        message: "Se ha actualizado la tarea en el sistema"
                    }))
                });

                break;
            default:
                const urlObj = url.parse(request.url, true).pathname.split('/');
                const id = urlObj[urlObj.length - 1];
                const resource = urlObj[urlObj.length - 2];
                
                if (resource === "task") {

                    request.on("data", (data) => {
                        //console.log('data -->', data.toString());
                        body += data.toString();
                    });

                    request.on("end", async () => { //Finalizo la entrega / envio de datos por parte del cliente 
                        let taskObj = JSON.parse(body);

                        //await addTask(taskObj);
                        await updateTask(taskObj.id, taskObj);
                        response.writeHead(201, { 'Content-Type': 'application/json' });
                        response.end(JSON.stringify({
                            message: "Se ha actualizado la tarea en el sistema"
                        }))
                    });
                }
                break;
        }
    }
}).listen(PORT);