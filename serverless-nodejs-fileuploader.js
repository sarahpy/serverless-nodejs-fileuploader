const AWS = require('aws-sdk');
const s3 = new AWS.S3();

//new dependencies
let mime = require('mime-types')

exports.handler = async (event) => {
    debugger;
    console.log("serverless nodejs fileuploader received");

    //extract file content eg.file upload in body, text (csv) in body, binary (img) in Base64 encoded
    let fileContent = event.isBase64Encoded ? Buffer.from(event.body, 'base64') : event.body;

    //generate filename from current timestamp
    let fileName = `${Date.now()}`;

    //file extension : need to include in HTTP Header to determine file extension contenttype
    let contentType = event.headers['content-type'] || event.headers['Content-Type'];
    let extension = contentType ? mime.extension(contentType) : '';

    //full filename
    let fullFileName = extension ? `${fileName}.${extension}` : fileName;

    //upload file to s3 bucket
    try {
        let data = await s3.putObject({
            Bucket: "file-upload-s3bucket-scgcpo",
            Key: fullFileName,
            Body: fileContent,
            Metadata: {}
        }).promise();

        console.log("Successfully uploaded file", fullFileName);
        return "Successfully uploaded";

    } catch (err) {
        // error handling goes here
        console.log("Failed to upload file", fullFileName, err);
        throw err;
    };


    return { "message": "Successfully executed" };
};