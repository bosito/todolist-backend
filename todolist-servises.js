const fs = require("fs/promises");
const path = require("path");

//ruta de db
const TODOLIST_PATH = path.resolve("todolist.json");

const getTasks = async () => {
    try {

        const tasks = await fs.readFile(TODOLIST_PATH, "utf-8");

        return JSON.parse(tasks);

    } catch (error) {

        throw new Error(error);

    };
};

const getTaskById = async (id) => {
    try {

        const listAllTask = await getTasks();

        return listAllTask.find((task) => task.id === parseInt(id));

    } catch (error) {

        throw new Error(error);

    };
};

const addTasks = async (taskObj) => {
    try {

        console.log('taskObj -->', taskObj);

        const listAllTasks = await getTasks();

        const nextId = listAllTasks.length + 1

        const newTask = {
            id: nextId,
            ...taskObj
        };

        listAllTasks.push(newTask);

        await fs.writeFile(TODOLIST_PATH, JSON.stringify(listAllTasks));

        return newTask;

    } catch (error) {

        throw new Error(error);

    };
};

const updateTask = async (id, taskObj) => {
    try {

        console.log('id -->', id);
        console.log('taskObj -->', taskObj);

        const listAllTasks = await getTasks();

        const indexObj = listAllTasks.findIndex((task)=>task.id === id);

        listAllTasks.splice(indexObj,1,taskObj);

        console.log('listAllTasks -->', listAllTasks);

        await fs.writeFile(TODOLIST_PATH, JSON.stringify(listAllTasks));


        return listAllTasks;


    } catch (error) {

        throw new Error(error);

    };
};

const deleteTask = async (id) => {
    try {
        const listAllTasks = await getTasks();

        const indexDelete = listAllTasks.indexOf(task => task.id === id);

        listAllTasks.slice(1, indexDelete);

        await fs.writeFile(TODOLIST_PATH, JSON.stringify(listAllTasks));

        return listAllTasks;

    } catch (error) {

        throw new Error(error);

    };
};

const createTaskObj = (uriEncode) => {
    let bodyArray = decodeURIComponent(uriEncode).split("&"); //creamos un elemento donde cada elemento sea [llave=valor]
    const dataObj = {}; //obj donde se guarda la [llave = valor]

    bodyArray.forEach((data) => {
        const keyValue = data.split("="); // Obtenemos un arreglo donde cada alemento va a ser [llave, valor]
        dataObj[keyValue[0]] = keyValue[1]; //la llave esta en la posicion 0 y el valor en la pociosion 1 del arreglo
    });


    return dataObj;
};

module.exports = {
    getTasks,
    getTaskById,
    addTasks,
    updateTask,
    deleteTask,
    createTaskObj
};