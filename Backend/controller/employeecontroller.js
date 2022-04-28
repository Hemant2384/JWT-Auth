const express = require('express');
const router = express.Router();
const Employee = require('../data/Employee')
// console.log(data.employees);
const ROLES_LIST = require('../config/user_roles')
const verifyRoles = require('../middleware/verifyroles')

router.route('/')
    .get(async (req,res) => {
        const employee = await Employee.find();
        if(!employee) res.sendStatus(204)
        res.json(employee)
    })
    .post(verifyRoles(ROLES_LIST.Admin,ROLES_LIST.Editor),(req,res) => {
        if(!req.body.firstname || !req.body.lastname) return res.sendStatus(400)
        try {
            const result = Employee.create ({
                firstname : req.body.firstname,
                lastname : req.body.lastname
            })
            res.json(result)
        }catch(err){
            console.log(err);
        }
    })
    .put(verifyRoles(ROLES_LIST.Admin,ROLES_LIST.Editor),(req,res) => {
        if(!req?.body?.id){
            return res.status(400).json({
                'message' : 'Missing'
            })
        }
        const employee = Employee.findOne({_id : req.body.id}).exec();
        if(!employee){
            return res.sendStatus(404)
        }
        const filtered = data.employees.filter(emp => emp.id !==(req.body.id))

        const unsortedarray = [...filtered,employee]

        data.setEmployees(unsortedarray.sort((a,b) => a.id > b.id ? 1:a.id<b.id ? -1 : 0))

        res.json(data.employees)
    })
    .delete(verifyRoles(ROLES_LIST.Admin),(req,res) => {
        const employee = data.employees.find(emp => emp.id===parseInt(req.body.id))
        if(!employee){
            return res.status(400).json({
                'message' : 'Missing'
            })
        }
        const filtered = data.employees.filter(emp => emp.id !==(req.body.id))
        data.setEmployees([...filtered])
        res.json(data.employees)
    })

    router.route('/:id')
    .get((req,res) => {
        const employee = data.employees.find(emp => emp.id===parseInt(req.params.id))
        if(!employee){
            return res.status(400).json({
                'message' : 'Missing'
            })
        }
        res.json(employee)
    })

module.exports = router;