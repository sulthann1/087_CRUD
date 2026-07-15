import express from 'express'
import pg from 'pg'

const app = express()
const port = 3000
const { Pool } = pg

app.use(express.json())
app.use(
    express.urlencoded({
        extended: true,
    })
)
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'mahasiswa',
    password: 'Slthnca155',
    port: 5432,
})

app.get('/', (req, res) => {
    console.log("TEST DATA:");
    pool.query('SELECT * FROM biodata')
        .then(testData => {
            console.log(testData.rows);
            res.json(testData.rows);
        })
        .catch(err => {
            console.error("Error executing query", err.stack);
            res.status(500).send("Database error");
        });
});

app.get('/:id', async (req, res) => {
    const { id } = req.params

    try {
        const result = await pool.query(
            'SELECT * FROM biodata WHERE id = $1',
            [id]
        )

        res.json(result.rows)
    } catch (err) {
        console.error(err)
        res.status(500).json({
            message: "Database Error"
        })
    }
})

app.post('/', async (req, res) => {

    const { nama, nim, kelas } = req.body
    try {
        const result = await pool.query(
            'INSERT INTO biodata (nama, nim, kelas) VALUES ($1,$2,$3) RETURNING *',
            [nama, nim, kelas]
        )
        rest.json (result.rows)
    } catch (err) {
        console.error(err)
        res.status(500).json({
            message: err.message
            
        })
    }

})

app.put('/:id', async (req, res) => {

    const { id } = req.params
    const { nama, nim, kelas } = req.body

    try {
        const result = await pool.query(
            'UPDATE biodata SET nama=$1, nim=$2, kelas=$3 WHERE id=$4 RETURNING *',
            [nama, nim, kelas, id]
        )

        res.json({
            message: "Data berhasil diupdate",
            data: result.rows[0]
        })

    } catch (err) {
        console.error(err)
        res.status(500).json({
            message: "Database Error"
        })
    }

})

app.delete('/:id', async (req, res) => {

    const { id } = req.params

    try {
        await pool.query(
            'DELETE FROM biodata WHERE id=$1',
            [id]
        )

        res.json({
            message: "Data berhasil dihapus"
        })

    } catch (err) {
        console.error(err)
        res.status(500).json({
            message: "Database Error"
        })
    }

})

app.listen(port, () => {
    console.log(`App is running on ${port}`)
})