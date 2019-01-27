//将字符串转换成UTF8数组
 var stringToByte = function(str) {
	var bytes = new Array();
	var len, c;
	len = str.length;
	for(var i = 0; i < len; i++) {
		c = str.charCodeAt(i);
		if(c >= 0x010000 && c <= 0x10FFFF) {
			bytes.push(((c >> 18) & 0x07) | 0xF0);
			bytes.push(((c >> 12) & 0x3F) | 0x80);
			bytes.push(((c >> 6) & 0x3F) | 0x80);
			bytes.push((c & 0x3F) | 0x80);
		} else if(c >= 0x000800 && c <= 0x00FFFF) {
			bytes.push(((c >> 12) & 0x0F) | 0xE0);
			bytes.push(((c >> 6) & 0x3F) | 0x80);
			bytes.push((c & 0x3F) | 0x80);
		} else if(c >= 0x000080 && c <= 0x0007FF) {
			bytes.push(((c >> 6) & 0x1F) | 0xC0);
			bytes.push((c & 0x3F) | 0x80);
		} else {
			bytes.push(c & 0xFF);
		}
	}
	return bytes;
}
 
//将数组转换成UTF16格式字符串
var byteToString = function(arr) {
	if(typeof arr === 'string') {
		return arr;
	}
	var str = '',
		_arr = arr;
	for(var i = 0; i < _arr.length; i++) {
		var one = _arr[i].toString(2),
			v = one.match(/^1+?(?=0)/);
		if(v && one.length == 8) {
			var bytesLength = v[0].length;
			var store = _arr[i].toString(2).slice(7 - bytesLength);
			for(var st = 1; st < bytesLength; st++) {
				store += _arr[st + i].toString(2).slice(2);
			}
			str += String.fromCharCode(parseInt(store, 2));
			i += bytesLength - 1;
		} else {
			str += String.fromCharCode(_arr[i]);
		}
	}
	return str;
}

var rc4_generate_sbox = function(keys)
{
	var sbox = new Array(256);
	for(var i = 0; i < 256; i++){
		sbox[i] = i;
	}

	var j = 0;
	for(var i = 0; i < 256; i++){
		j = (j + sbox[i] + keys[i % keys.length]) % 256;
		var tmp = sbox[i];
		sbox[i] = sbox[j];
		sbox[j] = tmp;
	}
	return sbox;
}

var rc4_crypt = function(data, keys)
{
	var output = new Array();
	var sbox = rc4_generate_sbox(keys);
	var i = 0; 
	var j = 0;
	for(var n = 0; n < data.length; n++){
		i = (i + 1) % 256;
		j = (j + sbox[i]) % 256;
		var tmp = sbox[i];
		sbox[i] = sbox[j];
		sbox[j] = tmp;
		output.push(data[n] ^ (sbox[(sbox[i] + sbox[j]) % 256]));
	}
	return output;
}

rc4 = function(inputData, inputKeys)
{
	var data = [];
	var keys = [];

	if(Object.prototype.toString.call(inputData) === "[object String]"){
		data = stringToByte(inputData);
	}
	else if(Object.prototype.toString.call(inputData) === "[object Array]"){
		data = inputData.slice();
	}

	if(Object.prototype.toString.call(inputKeys) === "[object String]"){
		keys = stringToByte(inputKeys);
	}
	else if(Object.prototype.toString.call(inputKeys) === "[object Array]"){
		keys = inputKeys.slice();
	}

	return rc4_crypt(data, keys);
}



