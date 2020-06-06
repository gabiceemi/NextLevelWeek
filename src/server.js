const express = require("express")
const server = express()

const db = require("./database/db")

server.use(express.static("public"))

//habilita a solicitação do body
server.use(express.urlencoded({ extended: true }))

const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server,
    noCache: true
})

server.get("/", (req, res) => {
    res.render("index.html")
})

server.get("/create-point", (req, res) => {
    return res.render("create-point.html")
})

server.post("/savepoint", (req, res) => {
    const query = `
    INSERT INTO places (
            name, 
            image, 
            address, 
            address2,                 
            state, 
            city,
            items 
    ) VALUES ( ?, ?, ?, ?, ?, ?, ? );
    `

    const values = [
        req.body.name,
        req.body.image,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items
    ]

    function afterInsertData(err) {
        if (err) {
            return console.log(err)
        }
        return res.render("create-point.html", { saved: true })
    }

    db.run(query, values, afterInsertData)

})

server.get("/search-results", (req, res) => {

    const search = req.query.search

    if(search == ""){
        res.render("search-results.html", { places: rows, total })
    }

    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function (err, rows) {
        if (err) {
            return console.log(err)
        }
        const total = rows.length
        res.render("search-results.html", { places: rows, total })
    })

})

server.listen(3000)
