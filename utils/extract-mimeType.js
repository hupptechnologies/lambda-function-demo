'use strict';

const ACCEPTABLE_MIME_EXTENSIONS = {
    "image/jpg": "jpg",
    "image/jpeg": "jpeg",
    "application/pdf": "pdf",
    "application/msword": "doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx"
}

/*
 @param: Base64 (Accept base64 string)
*/
module.exports = function(base64) {
	let mimeType = extractType(base64);
	console.log('mimetype', mimeType);
	return mimeType;
}

function extractType(base64) {
  	if (typeof(base64) !== 'string') {
    	throw("base64 must be a string");
  	}
  	let found = base64.match(/data:([\w+-\/]+);base64/)
  	if (found) {
	    let mimetype = found[1];
	    let type = mimetype.split("/")[0];
	    return { extension: ACCEPTABLE_MIME_EXTENSIONS[mimetype], mime: mimetype, type: type};
  	} else {
    	return null;
  	}
}
