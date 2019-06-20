'use strict';

/**
 Method: POST
 Path: /email
**/

const HTTPResponse = require("@hupptech/http_response");
const nodemailer = require("nodemailer");
const extractMimetype = require('./utils/extract-mimeType');

function validate(body){
    if (typeof(body.from) === "undefined" || typeof(body.to) === "undefined" || typeof(body.subject) === "undefined" || typeof(body.body) === "undefined") {
      throw new Error('Please supply an sender email, receiver email, subject and body');
    }
    Promise.resolve(body);
}


module.exports.send = (event, context, callback) => {

    try {

        // console.log('event',event);
        console.log('request from ', event.requestContext.identity.sourceIp);

        const headers = event.headers;

        let body = JSON.parse(event.body);
        const domains = process.env.domain.split(",");

        validate(body);

        // console.log('body',body);

        if (body.base64) {
            let mimeType = extractMimetype(body.base64);
            if (mimeType === null) {
                throw new Error('Invalid base64, we support only pdf, doc, docx, jpg and jpeg.');
            }else if (mimeType.extension === undefined) {
                throw new Error('Invalid base64, we support only pdf, doc, docx, jpg and jpeg.');
            }
        }

        console.log('headers', headers);

        console.log('verified domains', domains);

        console.log('Origin', headers.origin);

        console.log('indexOf',domains.indexOf(headers.origin));

        if(domains.indexOf(headers.origin) < 0){
            callback(null, HTTPResponse.response(404, {
                error: true,
                message: 'Requested resources doen\'t found!',
                // event
            }));
            return;
        };

        let transporter = nodemailer.createTransport({
            host: process.env.email_host,
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.email_user, // generated ethereal user
                pass: process.env.email_password // generated ethereal password
            }
        });

        // setup email data with unicode symbols
        let mailOptions = {
            from: body.from,        // sender address
            to: body.to,            // list of receivers
            subject: body.subject,  // Subject line
            html: body.body,        // html body
            replyTo: (body.replyTo) ? body.replyTo : undefined,
            bcc: "test@hupp.in",
            attachments: (body.base64) ? [{ path: body.base64 }] : undefined
        };

        // send mail with defined transport objecta
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('send Email err', error);
                callback(null, HTTPResponse.response(409, {
                    error: true,
                    message: error.message
                }));
            }else{
                callback(null, HTTPResponse.response(200, {
                    error: false,
                    message: 'Email has been sent!',
                    // event
                }));
            }
        });

    } catch(err) {
        callback(null, HTTPResponse.response(400, {
            error: true,
            message: err.message
        }));
    }

};
