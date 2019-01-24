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


var Rcon = [
	[0x00, 0x00, 0x00, 0x00], // 0
	[0x01, 0x00, 0x00, 0x00], // 1
	[0x02, 0x00, 0x00, 0x00], // 2
	[0x04, 0x00, 0x00, 0x00], // 3
	[0x08, 0x00, 0x00, 0x00], // 4
	[0x10, 0x00, 0x00, 0x00], // 5
	[0x20, 0x00, 0x00, 0x00], // 6
	[0x40, 0x00, 0x00, 0x00], // 7
	[0x80, 0x00, 0x00, 0x00], // 8
	[0x1b, 0x00, 0x00, 0x00], // 9
	[0x36, 0x00, 0x00, 0x00], // 10
	[0x6c, 0x00, 0x00, 0x00], // 11
	[0xd8, 0x00, 0x00, 0x00], // 12
	[0xab, 0x00, 0x00, 0x00], // 13
	[0x4d, 0x00, 0x00, 0x00], // 14
	[0x9a, 0x00, 0x00, 0x00], // 15
	[0x2f, 0x00, 0x00, 0x00], // 16
];

var S_BOX = [
	[0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76],
	[0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0],
	[0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15],
	[0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75],
	[0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84],
	[0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf],
	[0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8],
	[0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2],
	[0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73],
	[0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb],
	[0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c, 0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79],
	[0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08],
	[0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a],
	[0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e],
	[0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf],
	[0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16]
]

R_S_BOX = [
  [0x52, 0x09, 0x6a, 0xd5, 0x30, 0x36, 0xa5, 0x38, 0xbf, 0x40, 0xa3, 0x9e, 0x81, 0xf3, 0xd7, 0xfb],
  [0x7c, 0xe3, 0x39, 0x82, 0x9b, 0x2f, 0xff, 0x87, 0x34, 0x8e, 0x43, 0x44, 0xc4, 0xde, 0xe9, 0xcb],
  [0x54, 0x7b, 0x94, 0x32, 0xa6, 0xc2, 0x23, 0x3d, 0xee, 0x4c, 0x95, 0x0b, 0x42, 0xfa, 0xc3, 0x4e],
  [0x08, 0x2e, 0xa1, 0x66, 0x28, 0xd9, 0x24, 0xb2, 0x76, 0x5b, 0xa2, 0x49, 0x6d, 0x8b, 0xd1, 0x25],
  [0x72, 0xf8, 0xf6, 0x64, 0x86, 0x68, 0x98, 0x16, 0xd4, 0xa4, 0x5c, 0xcc, 0x5d, 0x65, 0xb6, 0x92],
  [0x6c, 0x70, 0x48, 0x50, 0xfd, 0xed, 0xb9, 0xda, 0x5e, 0x15, 0x46, 0x57, 0xa7, 0x8d, 0x9d, 0x84],
  [0x90, 0xd8, 0xab, 0x00, 0x8c, 0xbc, 0xd3, 0x0a, 0xf7, 0xe4, 0x58, 0x05, 0xb8, 0xb3, 0x45, 0x06],
  [0xd0, 0x2c, 0x1e, 0x8f, 0xca, 0x3f, 0x0f, 0x02, 0xc1, 0xaf, 0xbd, 0x03, 0x01, 0x13, 0x8a, 0x6b],
  [0x3a, 0x91, 0x11, 0x41, 0x4f, 0x67, 0xdc, 0xea, 0x97, 0xf2, 0xcf, 0xce, 0xf0, 0xb4, 0xe6, 0x73],
  [0x96, 0xac, 0x74, 0x22, 0xe7, 0xad, 0x35, 0x85, 0xe2, 0xf9, 0x37, 0xe8, 0x1c, 0x75, 0xdf, 0x6e],
  [0x47, 0xf1, 0x1a, 0x71, 0x1d, 0x29, 0xc5, 0x89, 0x6f, 0xb7, 0x62, 0x0e, 0xaa, 0x18, 0xbe, 0x1b],
  [0xfc, 0x56, 0x3e, 0x4b, 0xc6, 0xd2, 0x79, 0x20, 0x9a, 0xdb, 0xc0, 0xfe, 0x78, 0xcd, 0x5a, 0xf4],
  [0x1f, 0xdd, 0xa8, 0x33, 0x88, 0x07, 0xc7, 0x31, 0xb1, 0x12, 0x10, 0x59, 0x27, 0x80, 0xec, 0x5f],
  [0x60, 0x51, 0x7f, 0xa9, 0x19, 0xb5, 0x4a, 0x0d, 0x2d, 0xe5, 0x7a, 0x9f, 0x93, 0xc9, 0x9c, 0xef],
  [0xa0, 0xe0, 0x3b, 0x4d, 0xae, 0x2a, 0xf5, 0xb0, 0xc8, 0xeb, 0xbb, 0x3c, 0x83, 0x53, 0x99, 0x61],
  [0x17, 0x2b, 0x04, 0x7e, 0xba, 0x77, 0xd6, 0x26, 0xe1, 0x69, 0x14, 0x63, 0x55, 0x21, 0x0c, 0x7d] 
];


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

var GMul = function(a, b)
{
	if(a == 1){return b;}
	var ret = 0;
	for(var i = 0; i < 8; i++){
		if(b & 0x01 != 0){
			ret = ret ^ a;
		}

		var hi_bit_set = ((a & 0x80) != 0);
		a = a << 1;
		if(hi_bit_set){
			a = a ^ 0x1B;
		}

		b = b >>> 1;
	}

	return ret;
}


var RotWord = function(w){
	var tmp = w[0];
	var len = w.length;
	for(var i = 0; i < len; i++){
		w[i - 1] = w[i];
	}
	w[len - 1] = tmp;
	return w;
}

var SubWord = function(w)
{
	for(var i = 0; i < w.length; i++){
		var x = (w[i] & 0xf0) >>> 4;
		var y = (w[i] & 0x0f);
		w[i] = S_BOX[x][y];
	}
	return w;
}

var keyExpansion = function(cipherKeys, round)
{
	var capacity = 4 * (round + 1);
	var keys = Array(capacity);
	var N = 4;
	switch(round){
		case 10:
			N = 4;
			break;
		case 12:
			N = 6;
			break;
		case 14:
			N = 8;
	}

	for(var i = 0; i < capacity; i++){
		if(i < N){
			keys[i] = cipherKeys[i].slice();
		}
		else{ // i >= N
			if(i % N == 0){
				keys[i] = XOR_ARR_3(keys[i - N], SubWord(RotWord(keys[i - 1].slice())), Rcon[Math.floor(i / N)]);
			}
			else if(N > 6 && (i % 4 == 0)){
				keys[i] = XOR_ARR_2(keys[i - N], SubWord(keys[i - 1].slice()));
			}
			else{
				keys[i] = XOR_ARR_2(keys[i - N], keys[i - 1]);
			}
		}

		//console.log(i, keys[i][0].toString(16), keys[i][1].toString(16), keys[i][2].toString(16), keys[i][3].toString(16));
	}

	return keys;
}

var SubBytes = function(block){
	var len = block.length;
	for(var i = 0; i < len; i++){
		for(var j = 0; j < len; j++){
			var x = (block[i][j] & 0xf0) >>> 4;
			var y = (block[i][j] & 0x0f);
			block[i][j] = S_BOX[x][y];
		}
	}

	//console.log("SubBytes", dump(block));
}

var InvSubBytes = function(block){
	var len = block.length;
	for(var i = 0; i < len; i++){
		for(var j = 0; j < len; j++){
			var x = (block[i][j] & 0xf0) >>> 4;
			var y = (block[i][j] & 0x0f);
			block[i][j] = R_S_BOX[x][y];
		}
	}

	//console.log("InvSubBytes", dump(block));
}

var ShiftRows = function(block)
{
	var len = block.length;
	for(var j = 0; j < len; j++){
		var count = j;
		while(count > 0){
			var tmp = block[0][j];
			for(var i = 1; i < len; i++){
				block[i - 1][j] = block[i][j]
			}
			block[len - 1][j] = tmp;
			count = count - 1;
		}
	}
	
	//console.log("ShiftRows", dump(block));
}

var InvShiftRows = function(block)
{
	var len = block.length;
	for(var j = 0; j < len; j++){
		var count = j;
		while(count > 0){
			var tmp = block[len - 1][j];
			for(var i = len - 1; i > 0; i--){
				block[i][j] = block[i - 1][j]
			}
			block[0][j] = tmp;
			count = count - 1;
		}
	}

	//console.log("InvShiftRows", dump(block));
}

var MixColumns = function(block)
{
	for(var i = 0; i < block.length; i++){
		var v0 = GMul(0x02, block[i][0]) ^ GMul(0x03, block[i][1]) ^ GMul(0x01, block[i][2]) ^ GMul(0x01, block[i][3]);
		var v1 = GMul(0x01, block[i][0]) ^ GMul(0x02, block[i][1]) ^ GMul(0x03, block[i][2]) ^ GMul(0x01, block[i][3]);
		var v2 = GMul(0x01, block[i][0]) ^ GMul(0x01, block[i][1]) ^ GMul(0x02, block[i][2]) ^ GMul(0x03, block[i][3]);
		var v3 = GMul(0x03, block[i][0]) ^ GMul(0x01, block[i][1]) ^ GMul(0x01, block[i][2]) ^ GMul(0x02, block[i][3]);

		block[i][0] = v0 & 0xff;
		block[i][1] = v1 & 0xff;
		block[i][2] = v2 & 0xff;
		block[i][3] = v3 & 0xff;
	}

	//console.log("MixColumns", dump(block));
}

var InvMixColumns = function(block)
{
	for(var i = 0; i < block.length; i++){
		var v0 = GMul(0x0e, block[i][0]) ^ GMul(0x0b, block[i][1]) ^ GMul(0x0d, block[i][2]) ^ GMul(0x09, block[i][3]);
		var v1 = GMul(0x09, block[i][0]) ^ GMul(0x0e, block[i][1]) ^ GMul(0x0b, block[i][2]) ^ GMul(0x0d, block[i][3]);
		var v2 = GMul(0x0d, block[i][0]) ^ GMul(0x09, block[i][1]) ^ GMul(0x0e, block[i][2]) ^ GMul(0x0b, block[i][3]);
		var v3 = GMul(0x0b, block[i][0]) ^ GMul(0x0d, block[i][1]) ^ GMul(0x09, block[i][2]) ^ GMul(0x0e, block[i][3]);

		block[i][0] = v0 & 0xff;
		block[i][1] = v1 & 0xff;
		block[i][2] = v2 & 0xff;
		block[i][3] = v3 & 0xff;
	}

	//console.log("InvMixColumns", dump(block));
}


var AddRoundKey = function(block, keys, pIndex)
{
	for(var i = 0; i < block.length; i++){
		block[i] = XOR_ARR_2(block[i], keys[pIndex + i]);
	}

	//console.log("AddRoundKey", dump(block));
}

var blockEncrypt = function(block, keys, round)
{
	var pIdx = 0;
	AddRoundKey(block, keys, pIdx);
	for(var i = 0; i < round; i++){
		SubBytes(block);
		ShiftRows(block);
		if(i < (round - 1)){ MixColumns(block); }
		pIdx += 4;
		AddRoundKey(block, keys, pIdx);
	}
	console.log("blockEncrypt", dump(block));
}

var blockDecrypt = function(block, keys, round)
{
	var pIdx = 4 * round;
	AddRoundKey(block, keys, pIdx);
	for(var i = 0; i < round; i++){
		InvShiftRows(block);
		InvSubBytes(block);
		pIdx -= 4;
		AddRoundKey(block, keys, pIdx);
		if(i < (round - 1)){ InvMixColumns(block); }
	}
	console.log("blockDecrypt", dump(block));
}

var convertCipherKey = function(cipherKeysText, keyLength){
	if(cipherKeysText == null){cipherKeysText = ""};
	var byteLength = keyLength / 8;
	var keys = stringToByte(cipherKeysText);
	keys = keys.slice(0, byteLength);
	for(var i = keys.length; i < byteLength; i++){
		keys.push(0x00);
	}

	var cipherKeys = Array(Math.floor(byteLength / 4));
	for(var i = 0; i < byteLength; i += 4){
		cipherKeys[Math.floor(i / 4)] = keys.slice(i, i + 4);
	}

	return cipherKeys;
}

var convertIV = function(ivText){
	if(ivText == null){ivText = ""};
	var keyLength = 128;
	var byteLength = keyLength / 8;
	var arr = stringToByte(ivText);
	arr = arr.slice(0, byteLength);
	for(var i = arr.length; i < byteLength; i++){
		arr.push(0x00);
	}

	var iv = Array(Math.floor(byteLength / 4));
	for(var i = 0; i < byteLength; i += 4){
		iv[Math.floor(i / 4)] = arr.slice(i, i + 4);
	}

	return iv;
}

var aes_add_padding = function(data, mode, padding){
	if(mode == "ECB" || mode == "CBC"){
		var padding_count = 16 - (data.length % 16);

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

			case "ios10126":
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
}

var aes_remove_padding = function(data, mode, padding){
	if(mode == "ECB" || mode == "CBC"){
		switch(padding){
			case "zeropadding":
			while(data[data.length - 1] == 0){
				data.pop();
			}

			break;

			case "pkcs5padding":
			case "pkcs7padding":
			case "ios10126":
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
}


var convertBlock = function(arr)
{
	var block = Array(4);
	for(var i = 0; i < arr.length; i += 4){
		block[Math.floor(i / 4)] = arr.slice(i, i + 4);
	}
	return block;
}

var copyToArray = function(output, block)
{
	var len  = block.length;
	for(var i = 0; i < len; i++){
		for(var j = 0; j < len; j++){
			output.push(block[i][j]);
		}
	}
}


ASEKEY128 = 128;
ASEKEY192 = 192;
ASEKEY256 = 256;
//keyLength 键长度 ASEKEY128, ASEKEY192, ASEKEY256
//mode    分组模式,分别有ECB, CBC, CFB, OFB, CTR
//padding 填充模式,分别有zeropadding, pkcs5padding(默认), pkcs7padding, ISO10126, ansix923, ISO/IEC7816-4
//iv      偏移量
aes_encrypt = function(plainText, cipherKeysText, keyLength, mode, padding, ivText)
{
	if(plainText == null || plainText.length == 0){return "";}

	if(keyLength == null){keyLength = ASEKEY128;}
	if(mode == null){mode = "ECB";}
	if(padding == null){padding = "pkcs5padding";}

	var round = 10;
	switch(keyLength){
		case ASEKEY128: round = 10; break;
		case ASEKEY192: round = 12; break;
		case ASEKEY256: round = 14; break;
	}


	var data = stringToByte(plainText);
	aes_add_padding(data, mode, padding);
	console.log("aes_encrypt", data);

	var cipherKeys = convertCipherKey(cipherKeysText, keyLength);
	var keys = keyExpansion(cipherKeys, round);
	var iv = convertIV(ivText);

	var output = [];
	for(var i = 0; i < data.length; i += 16){
		var arr = data.slice(i, i + 16);
		var block = convertBlock(arr);
		blockEncrypt(block, keys, round);
		copyToArray(output, block);
	}

	return output;
}

//keyLength 键长度 ASEKEY128, ASEKEY192, ASEKEY256
//mode    分组模式,分别有ECB, CBC, CFB, OFB, CTR
//padding 填充模式,分别有zeropadding, pkcs5padding(默认), pkcs7padding, ISO10126, ansix923, ISO/IEC7816-4
//iv      偏移量
aes_decrypt = function(data, cipherKeysText, keyLength, mode, padding, ivText)
{
	if(keyLength == null){keyLength = ASEKEY128;}
	if(mode == null){mode = "ECB";}
	if(padding == null){padding = "pkcs5padding";}

	var round = 10;
	switch(keyLength){
		case ASEKEY128: round = 10; break;
		case ASEKEY192: round = 12; break;
		case ASEKEY256: round = 14; break;
	}

	var cipherKeys = convertCipherKey(cipherKeysText, keyLength);
	var keys = keyExpansion(cipherKeys, round);
	var iv = convertIV(ivText);

	var output = [];
	for(var i = 0; i < data.length; i += 16){
		var arr = data.slice(i, i + 16);
		var block = convertBlock(arr);
		blockDecrypt(block, keys, round);
		copyToArray(output, block);
	}

	aes_remove_padding(output, mode, padding);
	return output;
}