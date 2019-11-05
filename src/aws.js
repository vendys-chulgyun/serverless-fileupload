import AWS from 'aws-sdk';
import config from './config';

const albumBucketName = config.albumBucketName;
const albumPhotosKey = encodeURIComponent(config.albumName) + '//';

console.log('############### aws');
AWS.config.update({
    region: config.bucketRegion,
    credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: config.IdentityPoolId
    })
});

// export const init = () => {
//     console.log('############### aws init');
//     AWS.config.update({
//         region: config.bucketRegion,
//         credentials: new AWS.CognitoIdentityCredentials({
//             IdentityPoolId: config.IdentityPoolId
//         })
//     });
// }

export const  signinCallback = (authResult) => {
    if (authResult['status']['signed_in']) {

        // Add the Google access token to the Cognito credentials login map.
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: 'IDENTITY_POOL_ID',
            Logins: {
                'accounts.google.com': authResult['id_token']
            }
        });

        // Obtain AWS credentials
        AWS.config.credentials.get(function () {
            // Access AWS resources here.
        });
    }
}

export const s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    params: {
        Bucket: albumBucketName
    }
});

export async function viewAlbum(callbackFunc) {
    const albumName = config.albumName;
    const callback = 
    s3.listObjects({
        Prefix: albumPhotosKey
    }, function(err, data) {
        
        if (err) {
            return alert('There was an error viewing your album: ' + err.message);
        }
        // 'this' references the AWS.Response instance that represents the response
        const href = this.request.httpRequest.endpoint.href;
        const bucketUrl = href + albumBucketName + '/';
        console.log('앨범', data.Contents);

        const photos = data.Contents.map(function (photo) {
            const photoKey = photo.Key;
            const photoUrl = bucketUrl + encodeURIComponent(photoKey);
            return {
                photoUrl,
                date: photo.LastModified,
                name: photoKey.split('//')[1]
            };
        });

        callbackFunc(photos);
    });
}

export const addPhoto = (file) => {
    console.log(file);
    if (!file) {
        return alert('Please choose a file to upload first.');
    }
    const albumName = config.albumName
    const fileName = file.name;

    const photoKey = albumPhotosKey + fileName;
    console.log(albumName, albumPhotosKey, photoKey, fileName);
    const upload = s3.upload({
        Key: photoKey,
        Body: file,
        ACL: 'public-read'
    });
    return upload;
}

export const deletePhoto = async (fileName) => {
    const request = s3.deleteObject({
        Key: albumPhotosKey + fileName
    });
    const res = await request.promise();
    console.log(res, res.$response.error);
    const error = res.$response.error;
    if (error) {
        return alert('There was an error deleting your photo: ', error.message);
    }
    console.log('Successfully deleted photo.');
}