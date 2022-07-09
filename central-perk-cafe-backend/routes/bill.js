const express = require('express');
const connection = require('../connection');
const router = express.Router();
let ejs = require('ejs');
let pdf = require('html-pdf');
let path = require('path');
var fs = require('fs');
var uuid = require('uuid');
var auth = require('../services/authentication');

router.post('/generateReport', auth.authenticateToken, (req, res) => {
    const generatedUuid = uuid.v1();
    const orderDetails = req.body;
    const productDetailsReport = JSON.parse(orderDetails.productDetails);

    var query = "insert into bill (name, uuid, email, contactNumber, paymentMethod, total, productDetails, createdBy) values(?,?,?,?,?,?,?,?)";
    connection.query(query, [orderDetails.name, generatedUuid, orderDetails.email, orderDetails.contactNumber, orderDetails.paymentMethod, orderDetails.totalAmount, orderDetails.productDetails, res.locals.email], (err, results) => {
        if(!err) {
            ejs.renderFile(path.join(__dirname,'',"report.ejs"),{
                productDetails: productDetailsReport,
                name: orderDetails.name,
                email: orderDetails.email,
                contactNumber: orderDetails.contactNumber,
                paymentMethod: orderDetails.paymentMethod,
                totalAmount: orderDetails.totalAmount,
            }, (err, data) => {
                if (err) {
                    return res.status(500).json(err);
                } else {
                    pdf.create(data).toFile('./generated_pdf/' + generatedUuid + ".pdf", function(err, result) {
                        if (err) {
                            console.log(err);
                            return res.status(500).json(err);
                        } else {
                            return res.status(200).json({ uuid: generatedUuid});
                        }
                    });
                }
            });
        } else {
            return res.status(500).json(err);
        }
    });
});

module.exports = router;