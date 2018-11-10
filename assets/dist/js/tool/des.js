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

var pc1 = [
  57,   49,    41,   33,    25,    17,    9,
   1,   58,    50,   42,    34,    26,   18,
  10,    2,    59,   51,    43,    35,   27,
  19,   11,     3,   60,    52,    44,   36,
  63,   55,    47,   39,    31,    23,   15,
   7,   62,    54,   46,    38,    30,   22,
  14,    6,    61,   53,    45,    37,   29,
  21,   13,     5,   28,    20,    12,    4
];

var mask1 = [128, 64, 32, 16, 8, 4, 2, 1];
var mask2 = [8, 4, 2, 1];

var pc2 = [
  14,   17,    11,    24,    1,    5,
   3,   28,    15,     6,   21,   10,
  23,   19,    12,     4,   26,    8,
  16,    7,    27,    20,   13,    2,
  41,   52,    31,    37,   47,   55,
  30,   40,    51,    45,   33,   48,
  44,   49,    39,    56,   34,   53,
  46,   42,    50,    36,   29,   32
];

var leftRotateTable = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1];

var IP = [
	58,    50,   42,    34,    26,   18,    10,    2,
	60,    52,   44,    36,    28,   20,    12,    4,
	62,    54,   46,    38,    30,   22,    14,    6,
	64,    56,   48,    40,    32,   24,    16,    8,
	57,    49,   41,    33,    25,   17,     9,    1,
	59,    51,   43,    35,    27,   19,    11,    3,
	61,    53,   45,    37,    29,   21,    13,    5,
	63,    55,   47,    39,    31,   23,    15,    7
];

var E = [
	32,     1,    2,     3,     4,    5,
	 4,     5,    6,     7,     8,    9,
	 8,     9,   10,    11,    12,   13,
	12,    13,   14,    15,    16,   17,
	16,    17,   18,    19,    20,   21,
	20,    21,   22,    23,    24,   25,
	24,    25,   26,    27,    28,   29,
	28,    29,   30,    31,    32,    1
]

var S = [
	[
		[14,  4,  13,  1,   2, 15,  11,  8,   3, 10,   6, 12,   5,  9,   0,  7],
   		[ 0, 15,   7,  4,  14,  2,  13,  1,  10,  6,  12, 11,   9,  5,   3,  8],
   		[ 4,  1,  14,  8,  13,  6,   2, 11,  15, 12,   9,  7,   3, 10,   5,  0],
   		[15, 12,   8,  2,   4,  9,   1,  7,   5, 11,   3, 14,  10,  0,   6, 13]
 	],

    [
		[15,  1,   8, 14,   6, 11,   3,  4,   9,  7,   2, 13,  12,  0,   5, 10],
		[ 3, 13,   4,  7,  15,  2,   8, 14,  12,  0,   1, 10,   6,  9,  11,  5],
		[ 0, 14,   7, 11,  10,  4,  13,  1,   5,  8,  12,  6,   9,  3,   2, 15],
		[13,  8,  10,  1,   3, 15,   4,  2,  11,  6,   7, 12,   0,  5,  14,  9]
 	],

 	[
	    [10,  0,   9, 14,   6,  3,  15,  5,   1, 13,  12,  7,  11,  4,   2,  8],
	    [13,  7,   0,  9,   3,  4,   6, 10,   2,  8,   5, 14,  12, 11,  15,  1],
	    [13,  6,   4,  9,   8, 15,   3,  0,  11,  1,   2, 12,   5, 10,  14,  7],
	    [ 1, 10,  13,  0,   6,  9,   8,  7,   4, 15,  14,  3,  11,  5,   2, 12]
	],

	[
	    [ 7, 13,  14,  3,   0,  6,   9, 10,   1,  2,   8,  5,  11, 12,   4, 15],
	    [13,  8,  11,  5,   6, 15,   0,  3,   4,  7,   2, 12,   1, 10,  14,  9],
	    [10,  6,   9,  0,  12, 11,   7, 13,  15,  1,   3, 14,   5,  2,   8,  4],
	    [ 3, 15,   0,  6,  10,  1,  13,  8,   9,  4,   5, 11,  12,  7,   2, 14]
	],

	[

	    [ 2, 12,   4,  1,   7, 10,  11,  6,   8,  5,   3, 15,  13,  0,  14,  9],
	    [14, 11,   2, 12,   4,  7,  13,  1,   5,  0,  15, 10,   3,  9,   8,  6],
	    [ 4,  2,   1, 11,  10, 13,   7,  8,  15,  9,  12,  5,   6,  3,   0, 14],
	    [11,  8,  12,  7,   1, 14,   2, 13,   6, 15,   0,  9,  10,  4,   5,  3]
	],
	
	[
	    [12,  1,  10, 15,   9,  2,   6,  8,   0, 13,   3,  4,  14,  7,   5, 11],
	    [10, 15,   4,  2,   7, 12,   9,  5,   6,  1,  13, 14,   0, 11,   3,  8],
	    [ 9, 14,  15,  5,   2,  8,  12,  3,   7,  0,   4, 10,   1, 13,  11,  6],
	    [ 4,  3,   2, 12,   9,  5,  15, 10,  11, 14,   1,  7,   6,  0,   8, 13]
	],
	
	[
	    [ 4, 11,   2, 14,  15,  0,   8, 13,   3, 12,   9,  7,   5, 10,   6,  1],
	    [13,  0,  11,  7,   4,  9,   1, 10,  14,  3,   5, 12,   2, 15,   8,  6],
	    [ 1,  4,  11, 13,  12,  3,   7, 14,  10, 15,   6,  8,   0,  5,   9,  2],
	    [ 6, 11,  13,  8,   1,  4,  10,  7,   9,  5,   0, 15,  14,  2,   3, 12]
    ],

    [
	    [13,  2,   8,  4,   6, 15,  11,  1,  10,  9,   3, 14,   5,  0,  12,  7],
	    [ 1, 15,  13,  8,  10,  3,   7,  4,  12,  5,   6, 11,   0, 14,   9,  2],
	    [ 7, 11,   4,  1,   9, 12,  14,  2,   0,  6,  10, 13,  15,  3,   5,  8],
	    [ 2,  1,  14,  7,   4, 10,   8, 13,  15, 12,   9,  0,   3,  5,   6, 11]
	]
];

var P = [
	16,   7,  20,  21,
	29,  12,  28,  17,
	 1,  15,  23,  26,
	 5,  18,  31,  10,
	 2,   8,  24,  14,
	32,  27,   3,   9,
	19,  13,  30,   6,
	22,  11,   4,  25
];

var FP = [
	40,    8,    48,    16,    56,   24,    64,    32,
	39,    7,    47,    15,    55,   23,    63,    31,
	38,    6,    46,    14,    54,   22,    62,    30,
	37,    5,    45,    13,    53,   21,    61,    29,
	36,    4,    44,    12,    52,   20,    60,    28,
	35,    3,    43,    11,    51,   19,    59,    27,
	34,    2,    42,    10,    50,   18,    58,    26,
	33,    1,    41,     9,    49,   17,    57,    25
];

var leftRotate = function(array, n)
{
	for(var i = 0; i < n; i++){
		var first = array.shift();
		array.push(first);
	}
}

var generateSubKey = function(inputKeys)
{
	var keys = Array(56);
	for(var i = 0; i < 56; i++){
		var idx = pc1[i] - 1;
		var cur = (inputKeys[Math.floor(idx / 8)] & mask1[idx % 8]) != 0 ? 1 : 0;
		keys[i] = cur;
	}

	var lParts = keys.slice(0, 28);
	var rParts = keys.slice(28, 56);
	var outputKeys = Array(16);
	for(var i = 0; i < 16; i++){
		var k = [0, 0, 0, 0, 0, 0, 0, 0]
		leftRotate(lParts, leftRotateTable[i]);
		leftRotate(rParts, leftRotateTable[i]);
		for(var n = 0; n < 48; n++){
			var idx1 = Math.floor(n / 6);
			var idx2 = pc2[n] - 1;
			var cur = (idx2 < 28) ? lParts[idx2] : rParts[idx2 - 28];
			k[idx1] = k[idx1] << 1 | cur;
		}
		outputKeys[i] = k;
	}

	return outputKeys;
}

function padding(num, padCount) {
	if(padCount == undefined){
		padCount = 8;
	}
	var length = padCount;
    var str = num.toString(2);
    for(var len = str.length; len < length; len = str.length) {
        str = "0" + str;            
    }
    return str;
}


var dump = function(tag, arr, isHex, padCount)
{
	if(isHex){
		var str = "";
		for(var i = 0; i < arr.length; i++){
			str = str + padding(arr[i], padCount);
			if(i < arr.length - 1){
				str = str + ",";
			}
		}
		console.log(tag, str);
	}
	else{
		console.log(tag, arr);
	}
}

var blockEncrypt = function(data, keys)
{
	//进行初始置换
	var m = new Array(64);
	for(var i = 0; i < 64; i++){
		var idx = IP[i] - 1;
		var cur = (data[Math.floor(idx / 8)] & mask1[idx % 8]) != 0 ? 1 : 0;
		m[i] = cur;
	}

	console.log("初始置换", m);

	var lParts = m.slice(0, 32);
	var rParts = m.slice(32, 64);
	
	for(var round = 0; round < 16; round++){
		console.log("L"+round, lParts);
		console.log("R"+round, rParts);

		//将右部进行扩展置换
		var eTable = [0, 0, 0, 0, 0, 0, 0, 0];
		for(var i = 0; i < 8; i++){
			for(var j = 0; j < 6; j++){
				var idx = E[i * 6 + j] - 1;
				eTable[i] = eTable[i] << 1 | rParts[idx];
			}
		}

		if(round == 0){
			dump("扩展置换", eTable, true, 6);
		}

		//与密钥进行异或运算
		var key = keys[round];
		for(var i = 0; i < 8; i++){
			eTable[i] = eTable[i] ^ key[i];
		}


		if(round == 0){
			dump("密钥异或", eTable, true, 6);
		}

		//S盒置换
		var sTable = [0, 0, 0, 0, 0, 0, 0, 0];
		for(var i = 0; i < 8; i++){
			var cur = eTable[i];
			var row = (cur & 0b100000) >> 4 | (cur & 0b000001);
			var col = (cur & 0b011110) >> 1;
			sTable[i] = S[i][row][col];
		}

		if(round == 0){
			dump("S盒置换", sTable, true, 4);
		}

		//P盒置换
		var pTable = new Array(32);
		for(var i = 0; i < 32; i++){
			var idx = P[i] - 1;
			var cur = (sTable[Math.floor(idx / 4)] & mask2[idx % 4]) != 0 ? 1 : 0;
			pTable[i] = cur;
		}
		dump("P盒置换", pTable);

		var tmp = rParts.slice(0, 32);
		//与左部进行异或
		for(var i = 0; i < 32; i++){
			rParts[i] = lParts[i] ^ pTable[i];
		}

		//左右部分进行交换
		lParts = tmp;
	}

	//进行终止置换
	m = lParts.concat(rParts);
	var output = [0, 0, 0, 0, 0, 0, 0, 0]
	for(var i = 0; i < 64; i++){
		var idx = FP[i] - 1;
		var byteIdx = Math.floor(i / 8);
		output[byteIdx] = output[byteIdx] << 1 | m[idx];
	}

	console.log("终止置换", output);
	return output;
}

// TEST
// var outputKeys = generateKey([0b00010011, 0b00110100, 0b01010111, 0b01111001, 0b10011011, 0b10111100, 0b11011111, 0b11110001]);
// console.log(outputKeys);
// blockEncrypt([0b00000001,0b00100011, 0b01000101, 0b01100111, 0b10001001, 0b10101011, 0b11001101, 0b11101111], outputKeys);

//mode    分组模式,分别有ECB, CBC, CFB, OFB, CRT
//padding 填充模式,分别有zeropadding(默认), pkcs5padding, pkcs7padding, iso10126, ansix923
//iv      偏移量
function des_encrypt(inputString, keysString, mode, padding, iv){
	var output = [];
	var data = stringToByte(inputString);
	if(data.length == 0){
		return output;
	}
	while(data.length % 8 != 0){data.push(0);}

	console.log("data", data);

	var keys = stringToByte(keysString);
	keys = keys.slice(0, 8);
	for(var i = 0; i < 8; i++){
		if(keys[i] == undefined){
			keys[i] = 0;
		}
	}
	console.log("keys", keys);

	var subKeys = generateSubKey(keys);
	
	for(var i = 0; i < data.length; i += 8){
		var block = data.slice(i, i + 8);
		block = blockEncrypt(block, subKeys);
		output = output.concat(block);
	}
	return output;
}

var output = des_encrypt("12345678", "12345678");
console.log(output);

var str = "";
for(var i = 0; i < output.length; i++){
	str += output[i].toString(16);
	if(i < output.length - 1){
		str += ","
	}
}

console.log(str);









