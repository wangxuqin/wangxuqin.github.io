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

var dump = function(output)
{
	var arr = [];
	for(var i = 0; i < output.length; i++){
		for(var j = 0; j < output.length; j++){
			var item = output[i][j].toString(16);
			if(item.length == 1){ item = "0" + item;}
			item = "0x"+item;
			arr.push(item);
		}
	}
	return "\t" + arr.join(",");
}

var dump_arr = function(output)
{
	var arr = [];
	for(var i = 0; i < output.length; i++){
		item = output[i];
		if(item.length == 1){ item = "0" + item;}
		item = "0x"+item;
		arr.push(item);
	}
	return "\t" + arr.join(",");
}


function xor_arr(arr1, arr2)
{
	var output = [];
	if(arr1 != null && arr2 != null){
		var len = Math.min(arr1.length, arr2.length);
		for(var i = 0; i < len; i++){
			var val = arr1[i] ^ arr2[i];
			output.push(val);
		}
	}
	return output;
}

function inc_arr(arr)
{
	if(arr != null){
		var idx = arr.length - 1;
		while(idx > 0){
			arr[idx] += 1;
			if(arr[idx] == 256){
				arr[idx] = 0;
				idx = idx - 1;
			}
			else{
				break;
			}
		}
	}
}

var XOR_ARR_2 = function(a, b)
{
	var ret = [];
	var len = a.length;
	for(i = 0; i < len; i++){
		var v = a[i] ^ b[i];
		ret.push(v);
	}
	return ret;
}

var XOR_ARR_3 = function(a, b, c)
{
	var ret = [];
	var len = a.length;
	for(i = 0; i < len; i++){
		var v = a[i] ^ b[i] ^ c[i];
		ret.push(v);
	}
	return ret;
}

var tea_add_padding = function(data, padding){
	var padding_count = 8 - (data.length % 8);

	switch(padding){
		case "zeropadding":
		for(var i = 0; i < padding_count; i++){
			data.push(0x00);
		}
		break;

		case "pkcs5padding":
		case "pkcs7padding":
		for(var i = 0; i < padding_count; i++){
			data.push(padding_count);
		}
		break;

		case "iso/iec7816-4":
		data.push(0x80);
		for(var i = 1; i < padding_count; i++){
			data.push(0);
		}
		break;

		case "iso10126":
		for(var i = 0; i < padding_count - 1; i++){
			data.push(Math.floor(Math.random() * 256));
		}
		data.push(padding_count);
		break;

		case "ansix923":
		for(var i = 0; i < padding_count - 1; i++){
			data.push(0x00);
		}
		data.push(padding_count);
		break;
	}
}

var tea_remove_padding = function(data, padding){
	switch(padding){
		case "zeropadding":
		while(data[data.length - 1] == 0){
			data.pop();
		}

		break;

		case "pkcs5padding":
		case "pkcs7padding":
		case "iso10126":
		case "ansix923":
		var padding_count = data[data.length - 1];
		for(var i = 0; i < padding_count; i++){
			data.pop();
		}
		break;

		case "iso/iec7816-4":
		while(data[data.length - 1] != 0x80){
			data.pop();
		}
		break;

		if(data[data.length - 1] == 0x80){
			data.pop();
		}
		break;
	}
}

var MASK  = 0xffffffff;
var uint32 = function(val)
{
	var ret = (val & MASK) >>> 0;
	return ret;
}

var toUInt32 = function(d0, d1, d2, d3)
{
	return uint32(uint32(d0 << 24)  | d1 << 16 | d2 << 8 | d3);
}

var toUInt32Arr = function(arr)
{
	var uint32Arr = new Array();
	if(arr != undefined && arr.length > 0){
		for(var i = 0; i < arr.length; i += 4){
			var idx = i;
			var d0 = (idx < arr.length) ? arr[idx] : 0; 

			idx += 1;
			var d1 = (idx < arr.length) ? arr[idx] : 0; 

			idx += 1;
			var d2 = (idx < arr.length) ? arr[idx] : 0; 

			idx += 1;
			var d3 = (idx < arr.length) ? arr[idx] : 0;

			var val = toUInt32(d0, d1, d2, d3)
			uint32Arr.push(val);
		}
	}
	return uint32Arr;
}

var toUInt8Arr = function(uint32Arr)
{
	var arr = new Array();
	if(uint32Arr && uint32Arr.length > 0){
		for(var i = 0; i < uint32Arr.length; i++){
			var val = uint32Arr[i];
			var d0  = (val >>> 24 & 0xff) >>> 0;
			var d1  = (val >>> 16 & 0xff) >>> 0;
			var d2  = (val >>> 8  & 0xff) >>> 0;
			var d3  = (val & 0xff) >>> 0;
			arr.push(d0);
			arr.push(d1);
			arr.push(d2);
			arr.push(d3);
		}
	}
	return arr;
}

var DELTA = 0x9e3779b9;
var BLOCK_LENGTH = 8;

var tea_count_sum = function(rounds)
{
	var sum = 0;
	for(var i = 0; i < rounds; i++){
		sum += DELTA;
		sum = uint32(sum);
	}
	return sum;
}


var tea_block_encrypt = function(rounds, data, keys)
{
	var v0 = data[0];
	var v1 = data[1];
	var k0 = keys[0];
	var k1 = keys[1];
	var k2 = keys[2];
	var k3 = keys[3];
	var sum = 0;
	var p0, p1, p2;
	for(var i = 0; i < rounds; i++){
		sum += DELTA;
		sum = uint32(sum);

		p0 = uint32(uint32(v1 << 4) + k0);
		p1 = uint32(v1 + sum)
		p2 = uint32((v1 >>> 5) + k1);
		v0 += uint32(p0 ^ p1 ^ p2);
		v0  = uint32(v0);

		p0 = uint32(uint32(v0 << 4) + k2);
		p1 = uint32(v0 + sum);
		p2 = uint32((v0 >>> 5) + k3);
		v1 += uint32(p0 ^ p1 ^ p2);
		v1 = uint32(v1);
	}

	return [v0, v1];
}

var tea_block_decrypt = function(rounds, data, keys)
{
	var v0 = data[0];
	var v1 = data[1];
	var k0 = keys[0];
	var k1 = keys[1];
	var k2 = keys[2];
	var k3 = keys[3];
	var sum = tea_count_sum(rounds);
	var p0, p1, p2;
	for(var i = 0; i < rounds; i++){
		
		p0 = uint32(uint32(v0 << 4) + k2);
		p1 = uint32(v0 + sum)
		p2 = uint32((v0 >>> 5) + k3);
		v1 -= uint32(p0 ^ p1 ^ p2);
		v1  = uint32(v1);

		p0 = uint32(uint32(v1 << 4) + k0);
		p1 = uint32(v1 + sum);
		p2 = uint32((v1 >>> 5) + k1);
		v0 -= uint32(p0 ^ p1 ^ p2);
		v0 = uint32(v0);

		sum -= DELTA;
		sum = uint32(sum);
	}

	return [v0, v1];
}

var convertCipherKey = function(cipherKeysText)
{
	var keys = stringToByte(cipherKeysText);
	keys = keys.slice(0, BLOCK_LENGTH * 2);
	for(var i = keys.length; i < BLOCK_LENGTH * 2; i++){
		keys.push(0x00);
	};
	return keys;
}

var convertIV = function(viText)
{
	var iv = stringToByte(viText)
	iv = iv.slice(0, BLOCK_LENGTH);
	for(var i = iv.length; i < BLOCK_LENGTH; i++){
		iv.push(0x00);
	}
	return iv;
}

var copyToArray = function(output, arr)
{
	for(var i = 0; i < arr.length; i++){
		output.push(arr[i]);
	}
}

//rounds   轮数
//mode    分组模式,分别有ECB, CBC, CFB, OFB, CTR
//padding 填充模式,分别有zeropadding, pkcs5padding(默认), pkcs7padding, ISO10126, ansix923, ISO/IEC7816-4
//iv      偏移量
//flag    加密方法,分别由TEA、XTEA、XXTEA

tea_encrypt = function(plainText, cipherKeysText, rounds, mode, padding, ivText, flag)
{
	if(plainText == null || plainText.length == 0){return "";}
	if(cipherKeysText == null){cipherKeysText = "";}
	if(rounds == null){rounds = 32}
	if(mode == null){mode = "ECB";}
	if(padding == null){padding = "pkcs5padding";}
	if(ivText == null){ivText = "";}
	if(flag == null){flag = "TEA"}

	var data = stringToByte(plainText);
	tea_add_padding(data, padding);

	var cipherKeys = convertCipherKey(cipherKeysText);
	var keys = toUInt32Arr(cipherKeys);
	var iv = convertIV(ivText);

	if(flag == "XXTEA"){
		//调用 XXTEA 块加密函数
		return;
	}

	var encrypt_block = (flag == "TEA") ? tea_block_encrypt : null;

	var output = [];
	if(mode == "ECB"){
		for(var i = 0; i < data.length; i += BLOCK_LENGTH){
			var arr = data.slice(i, i + BLOCK_LENGTH);
			
			// var block = convertBlock(arr);
			// blockEncrypt(block, keys, round);
			// copyToArray(output, block);

			var block = toUInt32Arr(arr);
			block = encrypt_block(rounds, block, keys);
			arr = toUInt8Arr(block);
			copyToArray(output, arr);
		}
	}
	else if(mode == "CBC"){
		for(var i = 0; i < data.length; i += BLOCK_LENGTH){
			// var arr = data.slice(i, i + BLOCK_LENGTH);
			// arr = xor_arr(arr, iv);
			// var block = convertBlock(arr);
			// blockEncrypt(block, keys, round);
			// copyToArray(output, block);
			// iv = convertArr(block);
		}
	}
	else if(mode == "CFB"){
		for(var i = 0; i < data.length; i += BLOCK_LENGTH){
			// iv = convertBlock(iv);
			// blockEncrypt(iv, keys, round);
			// var arr = data.slice(i, Math.min(i + BLOCK_LENGTH, data.length));
			// copyToArray(output, xor_arr(arr, convertArr(iv)), "array");
			// iv = arr;
		}
	}
	else if(mode == "OFB"){
		iv = convertBlock(iv);
		for(var i = 0; i < data.length; i += BLOCK_LENGTH){
			// blockEncrypt(iv, keys, round);
			// var arr = data.slice(i, Math.min(i + BLOCK_LENGTH, data.length));
			// arr = xor_arr(arr, convertArr(iv));
			// copyToArray(output, arr, "array");
		}
	}
	else if(mode == "CTR"){
		var timer = iv.slice(0, BLOCK_LENGTH);
		for(var i = 0; i < data.length; i += BLOCK_LENGTH){
			// var iv = timer.slice(0, BLOCK_LENGTH);
			// iv = convertBlock(iv);
			// blockEncrypt(iv, keys, round);

			// var arr = data.slice(i, Math.min(i + BLOCK_LENGTH, data.length));
			// arr = xor_arr(arr, convertArr(iv));
			// copyToArray(output, arr, "array");
			// inc_arr(timer);
		}
	}

	return output;
}

//rounds   轮数
//mode    分组模式,分别有ECB, CBC, CFB, OFB, CTR
//padding 填充模式,分别有zeropadding, pkcs5padding(默认), pkcs7padding, ISO10126, ansix923, ISO/IEC7816-4
//iv      偏移量
//flag    加密方法,分别由TEA、XTEA、XXTEA
tea_decrypt = function(data, cipherKeysText, rounds, mode, padding, ivText, flag)
{
	if(rounds == null){rounds = 32}
	if(mode == null){mode = "ECB";}
	if(padding == null){padding = "pkcs5padding";}
	if(ivText == null){ivText = "";}
	if(flag == null){flag = "TEA"}

	var cipherKeys = convertCipherKey(cipherKeysText);
	var keys = toUInt32Arr(cipherKeys);
	var iv = convertIV(ivText);

	if(flag == "XXTEA"){
		//调用 XXTEA 块加密函数
		return;
	}

	var encrypt_block = (flag == "TEA") ? tea_block_encrypt : null;
	var decrypt_block = (flag == "TEA") ? tea_block_decrypt : null;

	var output = [];
	if(mode == "ECB"){
		for(var i = 0; i < data.length; i += BLOCK_LENGTH){
			var arr = data.slice(i, i + BLOCK_LENGTH);
			var block = toUInt32Arr(arr);
			block = decrypt_block(rounds, block, keys);
			arr = toUInt8Arr(block);
			copyToArray(output, arr);
		}
	}
	else if(mode == "CBC"){
		for(var i = 0; i < data.length; i += BLOCK_LENGTH){
			// var arr = data.slice(i, i + BLOCK_LENGTH);
			// var block = convertBlock(arr);
			// blockDecrypt(block, keys, round);
			// arr = xor_arr(convertArr(block), iv);
			// copyToArray(output, arr, "array");
			// iv = data.slice(i, i + BLOCK_LENGTH);
		}
	}
	else if(mode == "CFB"){
		for(var i = 0; i < data.length; i += BLOCK_LENGTH){
			// iv = convertBlock(iv);
			// blockEncrypt(iv, keys, round);
			// var arr = data.slice(i, Math.min(i + BLOCK_LENGTH, data.length));
			// arr = xor_arr(arr, convertArr(iv));
			// copyToArray(output, arr, "array");
			// iv = arr;
		}
	}
	else if(mode == "OFB"){
		// iv = convertBlock(iv);
		for(var i = 0; i < data.length; i += BLOCK_LENGTH){
			// blockEncrypt(iv, keys, round);
			// var arr = data.slice(i, Math.min(i + BLOCK_LENGTH, data.length));
			// arr = xor_arr(arr, convertArr(iv));
			// copyToArray(output, arr, "array");
		}
	}
	else if(mode == "CTR"){
		var timer = iv.slice(0, BLOCK_LENGTH);
		for(var i = 0; i < data.length; i += BLOCK_LENGTH){
			// var iv = timer.slice(0, BLOCK_LENGTH);
			// iv = convertBlock(iv);
			// blockEncrypt(iv, keys, round);
			// var arr = data.slice(i, Math.min(i + BLOCK_LENGTH, data.length));
			// arr = xor_arr(arr, convertArr(iv));
			// copyToArray(output, arr, "array");
			// inc_arr(timer);
		}
	}

	tea_remove_padding(output, padding);
	return output;
}