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

app.get('/:id', (req, res) => {

    const id = req.params.id;

    pool.query(
        'SELECT * FROM biodata WHERE id = $1',
        [id]
    )
    .then(result => {
        res.json(result.rows);
    })
    .catch(err => {
        console.error(err.stack);
        res.status(500).send("Database Error");
    });

});

app.post('/', (req, res) => {

    const { nama, nim, kelas } = req.body;

    pool.query(
        'INSERT INTO biodata (nama, nim, kelas) VALUES ($1,$2,$3) RETURNING *',
        [nama, nim, kelas]
    )
    .then(result => {
        res.status(201).json({
            message: "Data berhasil ditambahkan",
            data: result.rows[0]
        });
    })
    .catch(err => {
        console.error(err.stack);
        res.status(500).send("Database Error");
    });

});

app.put('/:id', (req, res) => {

    const id = req.params.id;
    const { nama, nim, kelas } = req.body;

    pool.query(
        'UPDATE biodata SET nama=$1, nim=$2, kelas=$3 WHERE id=$4 RETURNING *',
        [nama, nim, kelas, id]
    )
    .then(result => {
        res.json({
            message: "Data berhasil diupdate",
            data: result.rows[0]
        });
    })
    .catch(err => {
        console.error(err.stack);
        res.status(500).send("Database Error");
    });

});

app.delete('/:id', (req, res) => {

    const id = req.params.id;

    pool.query(
        'DELETE FROM biodata WHERE id=$1 RETURNING *',
        [id]
    )
    .then(result => {

        if (result.rowCount === 0) {
            return res.status(404).json({
                message: "Data tidak ditemukan"
            });
        }

        res.json({
            message: "Data berhasil dihapus",
            data: result.rows[0]
        });

    })
    .catch(err => {
        console.error(err.stack);
        res.status(500).send("Database Error");
    });

});

app.listen(port, () => {
    console.log(`App is running on ${port}`)
})