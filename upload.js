var KS3 = require('ks3');

var AK = process.env.KS3_AK;
var SK = process.env.KS3_SK;
var bucketName = 'damife';
var filePath = 'dist';
var key = 'kpc';
var region = 'BEIJING'; //BEIJING|SHANGHAI|HONGKONG|AMERICA

var ks3 = new KS3(AK, SK, bucketName, region);
console.log('Start upload files to ks3. Time:' + new Date());
console.log('Upload "' + filePath + '" to "' + key + '"');
ks3.upload.start({
	Bucket: bucketName,
	filePath: filePath,
	region: region,
	Key: key,
	ACL: 'public-read',
	fileSetting: {
		isDeep: true,
		ignore: /(.(swp|ds_store)$)/ig
	}
}, function (err, data, res) {
	if (err) {
		console.log(err);
	} else {
		console.log(data);
		console.log('Upload finished. Time:' + new Date());
	}
}, {
	'Cache-Control': 'no-cache,max-age=0'
});
