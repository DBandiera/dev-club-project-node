const express = require('express')
const uuid = require('uuid')

const port = 3001
const app = express()
app.use(express.json())



// app.use = (( request, response, next) => {
//     console.log(`[Method]: ${request.method} - [URL]: ${request.url}`)

//     next()
// })

const orders = []

const checkOrderId = ( request, response, next ) => {
    const { id } = request.params

    const index = orders.findIndex(orderShipping => orderShipping.id === id)

    if (index < 0) {
        return response.status(404).json({ error: "Order not found"})
    }

    request.orderShippingIndex = index
    request.orderShippingId = id

    next()
}

const moduleUrl = ( request, response, next ) => {
    const method = request.method

    const url = request.url

    console.log(`method: ${method} url: ${url}`)

    next()
}



app.get('/orders', moduleUrl, (request, response) => {
    return response.json(orders)
})

app.post('/orders', moduleUrl, (request, response) => {
    const { order, client, price, status } = request.body

    const orderShipping = { id: uuid.v4(), order, client, price, status }

    orders.push(orderShipping)

    return response.json(orderShipping)
})

app.put('/orders/:id', checkOrderId, moduleUrl, (request, response) => {
    const { order, client, price, status } = request.body
    const index = request.orderShippingIndex
    const id = request.orderShippingId

    const updateOrder = { id, order, client, price, status }

    orders[index] = updateOrder

    return response.json(updateOrder)
})

app.delete('/orders/:id', checkOrderId, moduleUrl, (request, response) => {
    const index = request.orderIndex
    
    orders.splice(index, 1)
    
    return response.status(204).json()
})

app.get('/orders/:id', checkOrderId, moduleUrl, (request, response) => {
    const index =  request.orderShippingIndex
    return response.json(orders[index])  
})

app.patch('/orders/:id', checkOrderId, moduleUrl, (request, response) => {
    const index = request.orderShippingIndex
    orders[index].status = "Pronto"

    return response.json(orders[index])
})



app.listen(port, () => {
    console.log(`🛰 Server started on port ${port}`)
})
