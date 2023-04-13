if(process.env.NODE_ENV == 'production'){
    module.exports = {mongoURI: "mongodb+srv://matheusadmin:<admin>@blogapp.op4jtdi.mongodb.net/?retryWrites=true&w=majority"}
}
else{
    module.exports = {mongoURI: "mongodb://localhost/blogapp"}
}