import pool from "../config/db.js";


const getAllTasks = async () =>{
    const result = await pool.query(
        'SELECT * FROM tasks ORDER BY created_at DESC'
    )
    return result.rows;
}

const getTaskById = async (id)=>{

    const result = await pool.query(
        "SELECT * FROM tasks WHERE task_id = $1",
    [id]
    )
    return result.rows[0] || null;
}

const createTask = async (task) =>{
    const { title, description, completed } = task;
    const result = await pool.query(
    `INSERT INTO tasks (title,description,completed) 
    VALUES ($1,$2,$3) RETURNING *`,[task.title,task.description,task.completed]
    );
    return result.rows[0];
}

const updateTask = async (id, task) =>{

    const columnMap = {
        title : 'title',
        description : 'description',
        completed : 'completed'
    }

    const entries = Object.entries(task).filter(([key]) => key in columnMap)
    if(entries.length === 0) return null;

    const values = entries.map(([, value]) => value);

    const setClause = entries.map(([key],index) => `${columnMap[key]} = $${index+1}`)

    values.push(id);

    const query = `UPDATE tasks 
    SET ${setClause.join(', ')},
    updated_at = NOW()
    WHERE task_id = $${values.length} RETURNING *`;

    const result = await pool.query(query,values);
    return result.rows[0] || null;
};

const deleteTask = async (id) =>{
    const result = await pool.query(
        `DELETE FROM tasks WHERE task_id =$1 RETURNING *`,[id]
    )
    return result.rows[0] || null;
}


export {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
}