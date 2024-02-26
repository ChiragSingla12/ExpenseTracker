const AWS = require('aws-sdk');

const uploadToS3 = (data, filename) => {
    const BUCKET_NAME = 'expensetracking21';
    const IAM_USER_KEY = 'AKIA47CR3UKDEGD5ZTT7';
    const IAM_USER_SECRET = '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';

    let s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET,
    })

    var params = {
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: data,
        ACL: 'public-read'
    }


    return new Promise((resolve, reject) => {
        s3bucket.upload(params, (err, s3response) => {
            if (err) {
                console.log('Something went wrong', err)
                reject(err);
            } else {
                console.log('success', s3response);
                resolve(s3response.Location);
            }
        })
    })

}

module.exports = {
    uploadToS3
}