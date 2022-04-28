const express = require('express');
const router = express.Router();
const data = {
    employees : require('../../data/employees.json'),
    setEmployees: function (data) { this.employees = data }
}
// console.log(data.employees);
const ROLES_LIST = require('../../config/user_roles')
const verifyRoles = require('../../middleware/verifyroles')

router.route('/')
    .get((req,res) => {
        res.json(data.employees)
    })
    .post(verifyRoles(ROLES_LIST.Admin,ROLES_LIST.Editor),(req,res) => {
        const newEmployee = {
              id : data.employees[data.employees.length-1].id + 1 || 1,
              name :req.body.name,
              job :req.body.job
    }
    if(!newEmployee.name || !newEmployee.job){
        return res.status(400).json({
            'message' : 'Missing'
        })
    }
    data.setEmployees([...data.employees,newEmployee])
    res.status(201).json(data.employees)
    })
    .put(verifyRoles(ROLES_LIST.Admin,ROLES_LIST.Editor),(req,res) => {
        const employee = data.employees.find(emp => emp.id===parseInt(req.body.id))
        if(!employee){
            return res.status(400).json({
                'message' : 'Missing'
            })
        }
        if(req.body.name) employee.name = req.body.name
        if(req.body.job) employee.job = req.body.job

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