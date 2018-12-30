

///puertos

process.env.PORT = process.env.PORT || 3000



process.env.NODE_ENV =   process.env.NODE_ENV || 'dev'

let urlDB
if(process.env.NODE_ENV === 'dev'){
	urlDB='mongodb://localhost:27017/pepa'
}
else{
	urlDB='mongodb://cafes-user:55555eze@ds145584.mlab.com:45584/cafes'
}

process.env.URLDB = urlDB

