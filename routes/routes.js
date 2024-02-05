const express = require('express');
const db = require("../util/dbConnect.js");
const cookieJwt = require("../jwt/auth.js");
const router=express.Router()
// Create Task
router.post('/api/tasks',cookieJwt ,async (req, res) => {
    const dateVal = req.body.due_date;
    const user_id = req.userId.id;
    const [day, month, year] = dateVal.split('-').map(Number);
    const dateObject = new Date(year, month - 1, day); // Month is 0-indexed 
    console.log(dateObject.toLocaleDateString());

    try {
        await db.query("INSERT INTO tasks (title,description,due_date,user_id) VALUES ($1,$2,$3,$4)",
        [req.body.title,req.body.description,dateObject,user_id]);
        res.status(200).send('Success');
    } catch (error) {
        res.status(400).send(error);
    }
});

// Create Sub Task
router.post('/api/subtasks', async (req, res) => {
    const taskId = req.body.task_id;
    // console.log(taskId);
    try {
        const result = await db.query("SELECT * FROM tasks WHERE id = $1",[taskId]);
        if(result.rowCount == 0) res.status(404).send("Id not found !");
    } catch (error) {
        res.status(404).send(error);
    }
    try {
        await db.query("INSERT INTO subtasks (task_id,description) VALUES ($1,$2)",
        [taskId,req.body.description]);
        res.status(200).send('Success');
    } catch (error) {
        res.status(400).send(error);
    }

});

// Get all user tasks with filters and pagination
router.get('/api/tasks', cookieJwt,async (req, res) => {
    try {
        const id = req.userId;
        console.log(id.id);
        const result = await db.query("SELECT * FROM tasks WHERE user_id = $1 ORDER BY due_date",[id.id]);
        //console.log(result);
        const filters = req.query; 
        const filteredUsers = result.rows.filter(task => { 
            let isValid = true; 
            for (key in filters) { 
                console.log(key, task[key], filters[key]);
                isValid = isValid && task[key] == filters[key]; 
            }
            return isValid; 
        }); 
        res.send(filteredUsers);
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
});

// Get all user sub tasks with filters
router.get('/api/subtasks/:taskId',async (req, res) => {
    const {taskId} = req.params;
    console.log(taskId);
    try {
        const result = await db.query("SELECT * FROM subtasks WHERE task_id = $1",[taskId]);
        const filters = req.query; 
        const filteredUsers = result.rows.filter(task => { 
            let isValid = true; 
            for (key in filters) { 
                console.log(key, task[key], filters[key]);
                isValid = isValid && task[key] == filters[key]; 
            }
            return isValid; 
        }); 
        res.send(filteredUsers);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Update Task
router.put('/api/tasks/:taskId', async (req, res) => {
    const { taskId } = req.params;
    const dateVal = req.body.due_date; // dd-mm-yyyy
    const [day, month, year] = dateVal.split('-').map(Number);
    const dateObject = new Date(year, month - 1, day); // Month is 0-indexed
    try {
        await db.query("UPDATE tasks SET due_date = $1 , status = $2 WHERE id = $3",[dateObject,req.body.status,taskId]);
        res.status(200).send("Success");
    } catch (error) {
        res.send(error);
    }
});

// Update Sub Task
router.put('/api/subtasks/:subTaskId', async (req, res) => {
    const { subTaskId } = req.params;
    //console.log(subTaskId);
    const status = req.body.status;
    try {
        await db.query("UPDATE subtasks SET status = $1 WHERE id = $2",[status,subTaskId]);
        let result = await db.query("SELECT task_id from subtasks WHERE id = $1",[subTaskId]);
        result = result.rows[0].task_id;
        await db.query("UPDATE tasks SET status = 'IN_PROGRESS' WHERE id=$1",[result]);
        res.status(200).send("Success");
    } catch (error) {
        res.send(error);
    }
});

// Delete Task
router.delete('/api/tasks/:taskId', async (req, res) => {
    const { taskId } = req.params;
    try {
        await db.query("DELETE FROM tasks WHERE id = $1",[taskId]);
        res.status(200).send("Success");
    } catch (error) {
        res.send(error);
    }
});

// Delete Sub Task
router.delete('/api/subtasks/:subTaskId', async (req, res) => {
    const { subTaskId } = req.params;
    try {
        await db.query("DELETE FROM subtasks WHERE id = $1",[subTaskId]);
        res.status(200).send("Success");
    } catch (error) {
        res.send(error);
    }
});

module.exports = router;