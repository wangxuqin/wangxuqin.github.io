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

		console.log(i, keys[i][0].toString(16), keys[i][1].toString(16), keys[i][2].toString(16), keys[i][3].toString(16));
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
}


var AddRoundKey = function(block, keys, pIndex)
{
	for(var i = 0; i < block.length; i++){
		block[i] = XOR_ARR_2(block[i], keys[pIndex + i]);
	}
}

var blockEncrypt = function(block, keys, round)
{
	AddRoundKey(block, keys, 0);
	for(var i = 0; i < round; i++){
		SubBytes(block);
		ShiftRows(block);
		if(i < (round - 1)){ MixColumns(block); }
		AddRoundKey(block, keys, 4 * (round + 1));
	}
}


var block = [
	[0x19, 0x3d, 0xe3, 0xbe],
	[0xa0, 0xf4, 0xe2, 0x2b],
	[0x9a, 0xc6, 0x8d, 0x2a],
	[0xe9, 0xf8, 0x48, 0x08]
]

console.log("SubBytes");
SubBytes(block);
for(var i = 0; i < 4; i++){
	console.log(i , block[i][0].toString(16), block[i][1].toString(16), block[i][2].toString(16), block[i][3].toString(16));
}

console.log("ShiftRows");
ShiftRows(block);
for(var i = 0; i < 4; i++){
	console.log(i , block[i][0].toString(16), block[i][1].toString(16), block[i][2].toString(16), block[i][3].toString(16));
}

console.log("MixColumns");
MixColumns(block);
for(var i = 0; i < 4; i++){
	console.log(i , block[i][0].toString(16), block[i][1].toString(16), block[i][2].toString(16), block[i][3].toString(16));
}





