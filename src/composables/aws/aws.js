import aws from 'aws-sdk'

aws.config.update({
  secretAccessKey: 'O7glDt9NN5qziGeM/krh+PizwhFnVFqQBy0qd0JL',
  accessKeyId: 'AKIA5EWLLCAYPN54BK26'
})

export const s3 = new aws.S3({
  signatureVersion: 'v4',
  region: 'us-west-1',
})
