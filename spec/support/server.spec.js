const { response } = require('express')
var request = require('request')

describe('Get messages', () => {
    it('should return 200 Ok', (done)=>{
        request.get('http://localhost:3000/messages', (err, response)=>{
            expect(response.statusCode).toEqual(200)
            done()
        })
    })
    it('should return a list that is not empty', (done)=>{
        request.get('http://localhost:3000/messages', (err, response)=>{
            expect(JSON.parse(response.body).length).toBeGreaterThan(0)
            done()
        })
    })
})

describe('Get messages from user',() =>{
    it('should return 200 Ok', (done)=>{
        request.get('http://localhost:3000/messages/tim', (err, res)=>{
            expect(res.statusCode).toEqual(200)
            done()
        })
    })

    it('name should be tim', (done) =>{
        request.get('http://localhost:3000/messages/tim', (err, res)=>{
            expect(JSON.parse(res.body)[0].name).toEqual('tim')
            done()
        })
    })
})