//CARREGANDO MODULOS
    const express = require('express')
    const handlebars = require('express-handlebars')
    const bodyParser = require('body-parser')  
    const app = express()        
    const admin = require('./routes/admin') 
    const path = require("path")
    const mongoose = require('mongoose')
    const session = require("express-session")
    const flash = require("connect-flash")
    //const router = require('./routes/admin')
    require("./models/Postagens")
    const Postagem = mongoose.model("postagens")
    require("./models/Categoria")
    const Categoria = mongoose.model("categorias")
    const usuarios = require("./routes/usuario")
    const passport = require("passport")
    require("./config/auth")(passport)



//CONFIGURAÇÕES
    //SESSAO
    app.use(session({
        secret: "cursodenode",
        resave: true,
        saveUninitialized: true
    }))

    app.use(passport.initialize())
    app.use(passport.session())
    app.use(flash())

    //MIDDLEWARE
        app.use((req, res, next) => {
            res.locals.success_msg = req.flash("success_msg")
            res.locals.error_msg = req.flash("error_msg")
            next()
        })

    //BODY PARSER
        app.use(bodyParser.urlencoded({extended: true}))
        //app.use(express.urlencoded({extended: true: true})) tbm pode ser uma solução
        app.use(bodyParser.json())
        //app.use(express.json())
    //HANDLEBARS
        app.engine('handlebars',handlebars.engine({defaultLayout: 'main'}))
        app.set('view engine', 'handlebars')
    //MONGOOSE
        mongoose.Promise = global.Promise

        mongoose.connect('mongodb://localhost/blogapp').then(()=>{
            console.log("Conectando-se ao MongoDB...")
            console.log("Conectado com sucesso!")
        }).catch((err) => {
            console.log("Conectando-se ao MongoDB...")
            console.log("Erro ao conectar-se ao MongoDB ["+err+"]")
        })
    //PUBLIC
        app.use(express.static(path.join(__dirname, "public")))

        // app.use((req, res, next) => {
        //     console.log("Oi, eu sou um middleware!")
        //     next()
        // })
//ROTAS
    app.get('/', (req, res) => {
        Postagem.find().lean().populate("categoria").sort({data: -1}).then((postagens) => {
            res.render("index", {postagens: postagens})
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro interno")
            res.redirect("/404")
        })
    })

    app.get("/postagem/:slug", (req, res) => {
        Postagem.findOne({slug: req.params.slug}).lean().then((postagem) => {
            if(postagem){
                res.render("postagem/index", {postagem: postagem})
            }else{
                req.flash("error_msg", "Esta postagem não existe")
                res.redirect("/")
            }
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro interno")
            res.redirect("/")
        })
    })

    app.get("/categorias", (req, res) => {
        Categoria.find().lean().then((categorias) => {
            res.render("categorias/index", {categorias: categorias})
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro interno ao listar as categorias")
            res.redirect("/")
        })
    })

    app.get("/categorias/:slug", (req, res) => {
        Categoria.findOne({slug: req.params.slug}).lean().then((categoria) => {
            if(categoria){
                
                Postagem.find({categoria: categoria._id}).lean().then((postagens) => {
                    res.render("categorias/postagens", {postagens: postagens, categoria: categoria})
                }).catch((err) => {
                    req.flash("error_msg","Houve um erro ao listar os posts! :(")
                    res.redirect("/")
                })
            }
            else{
                req.flash("error_msg", "esta categoria não existe :(")
                res.redirect("/")
            }
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro interno ao carregar a pagina desta categoria :(")
            res.redirect("/")
        })
    })


    app.get("/404", (req, res) => {
        res.send("Erro 404!")
    })

    app.get('/posts', (req, res) =>{
        res.send("Lista de Posts")
    })

    app.use('/admin', admin)

    app.use("/usuarios", usuarios)

//OUTROS
const PORT = 8089

app.listen(PORT, () => {
    console.log("Servidor rodando na porta: "+PORT)
})