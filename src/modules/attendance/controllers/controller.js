'use strict';
var mongoose = require('mongoose'),
    model = require('../models/model'),
    mq = require('../../core/controllers/rabbitmq'),
    Attendance = mongoose.model('Attendance'),
    errorHandler = require('../../core/controllers/errors.server.controller'),
    _ = require('lodash');

exports.getList = async (req, res) => {
    var pageNo = parseInt(req.query.pageNo);
    var size = parseInt(req.query.size);

    delete req.query.pageNo;
    delete req.query.size;

    var sort = { updated: -1, created: -1 };

    if (pageNo < 0) {
        response = { "error": true, "message": "invalid page number, should start with 1" };
        return res.json(response);
    }

    try {
        const [_result, _count] = await Promise.all([
            Attendance.find(req.query)
                .skip(size * (pageNo))
                .limit(size)
                .sort(sort)
                .exec(),
                Attendance.countDocuments(req.query).exec()
        ]);

        res.jsonp({
            status: 200,
            data: _result,
            pageIndex: pageNo,
            pageSize: size,
            totalRecord: _count,
        });

    } catch (err) {
        console.log(err);
        return res.status(400).send({
            status: 400,
            message: errorHandler.getErrorMessage(err)
        });
    }
};

exports.create =  (req, res) => {
    var newAttendance = new Attendance (req.body);
    newAttendance.createby = req.user;
    newAttendance.save((err, data) => {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp({
                status: 200,
                data: data
            });
            /**
             * Message Queue
             */
            // mq.publish('exchange', 'keymsg', JSON.stringify(newOrder));
        };
    });
};

exports.getByID = (req, res, next, id) => {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            status: 400,
            message: 'Id is invalid'
        });
    }

    Attendance.findById(id, (err, data) => {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            req.data = data ? data : {};
            next();
        };
    });
};

exports.read = (req, res) => {
    res.jsonp({
        status: 200,
        data: req.data ? req.data : []
    });
};

exports.update =  (req, res) => {
    var updAttendance = _.extend(req.data, req.body);
    updAttendance.updated = new Date();
    updAttendance.updateby = req.user;
    updAttendance.save((err, data) => {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp({
                status: 200,
                data: data
            });
        };
    });
};

exports.delete = (req, res) => {
    req.data.remove((err, data) => {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp({
                status: 200,
                data: data
            });
        };
    });
};


