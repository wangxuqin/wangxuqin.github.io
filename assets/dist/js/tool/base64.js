// import * as utf8util from '/utf8util.js';
// var stringToByte = utf8util.stringToByte;
// var byteToString = utf8util.byteToString;

var decodeErrorTip = function(){}

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

var base64Table = {
    0:'A',  1:'B',  2:'C',  3:'D',  4:'E',  5:'F',  6:'G',  7:'H',
    8:'I',  9:'J', 10:'K', 11:'L', 12:'M', 13:'N', 14:'O', 15:'P',
   16:'Q', 17:'R', 18:'S', 19:'T', 20:'U', 21:'V', 22:'W', 23:'X',
   24:'Y', 25:'Z', 26:'a', 27:'b', 28:'c', 29:'d', 30:'e', 31:'f',
   32:'g', 33:'h', 34:'i', 35:'j', 36:'k', 37:'l', 38:'m', 39:'n',
   40:'o', 41:'p', 42:'q', 43:'r', 44:'s', 45:'t', 46:'u', 47:'v',
   48:'w', 49:'x', 50:'y', 51:'z', 52:'0', 53:'1', 54:'2', 55:'3',
   56:'4', 57:'5', 58:'6', 59:'7', 60:'8', 61:'9', 62:'+', 63:'/'
}

var base64ReverseTable = {};
Object.keys(base64Table).forEach(function(key){
	if(!isNaN(key)){
		var newKey   = base64Table[key].toString();
		var newValue =  parseInt(key);
		base64ReverseTable[newKey] = newValue;
	}
});

function base64Encode(input)
{
	var bytes = null;

	if(Object.prototype.toString.call(input) === "[object String]"){
		bytes = stringToByte(input);
	}
	else if(Object.prototype.toString.call(input) === "[object Array]"){
		bytes = input;
	}
	else{
		return "";
	}

	var arr = new Array();
	var index = 0;
	while(index < bytes.length){
		var byte0 = bytes[index++];
		var byte1 = bytes[index++];
		var byte2 = bytes[index++];

		var idxArr = [-1, -1, -1, -1];

		if(byte0 != undefined && byte1 != undefined && byte2 != undefined){
			idxArr[0] = byte0 >> 2;
			idxArr[1] = (byte0 & 0x03) << 4 | (byte1 & 0xf0) >> 4;
			idxArr[2] = (byte1 & 0x0f) << 2 | (byte2 & 0xc0) >> 6;
			idxArr[3] = (byte2 & 0x3f);
		}
		else if(byte0 != undefined && byte1 != undefined){
			idxArr[0] = byte0 >> 2;
			idxArr[1] = (byte0 & 0x03) << 4 | (byte1 & 0xf0) >> 4;
			idxArr[2] = (byte1 & 0x0f) << 2;
		}
		else if(byte0 != undefined){
			idxArr[0] = byte0 >> 2;
			idxArr[1] = (byte0 & 0x03) << 4;
		}

		for(var i = 0; i < idxArr.length; i++){
			arr.push(idxArr[i] == -1 ? '=' : base64Table[idxArr[i]]);
		}
	}
	return arr.join('');
}


function base64Decode(str, output){
	if (output == undefined) {output = "str"}

	var arr = new Array();
	var bytes = stringToByte(str);
	if(bytes.length > 0 && (bytes.length % 4) != 0){
		decodeErrorTip();
		return "";
	}

	var index = 0;
	while(index < bytes.length){
		var idxArr = [-1, -1, -1, -1];
		for(var i = 0; i < 4; i++){
			var b = bytes[index + i];
			if(b >= 128){
				decodeErrorTip();
				return "";
			}
			if(b == 61){ //ascii码对应为=
				idxArr[i] = -1;
			}
			else{
				idxArr[i] = base64ReverseTable[String.fromCharCode(b)];
				if(idxArr[i] == undefined){
					decodeErrorTip();
					return "";
				}
			}
		}

		var byteArr = [-1, -1, -1];
		if(idxArr[0] != -1 && idxArr[1] != -1 && idxArr[2] != -1 && idxArr[3] != -1){
			byteArr[0] = idxArr[0] << 2 | (idxArr[1] & 0xf0) >> 4;
			byteArr[1] = (idxArr[1] & 0x0f) << 4 | (idxArr[2] & 0x3c) >> 2;
			byteArr[2] = (idxArr[2] & 0x03) << 6 | idxArr[3];
		}
		else if(idxArr[0] != -1 && idxArr[1] != -1 && idxArr[2] != -1){
			byteArr[0] = idxArr[0] << 2 | (idxArr[1] & 0xf0) >> 4;
			byteArr[1] = (idxArr[1] & 0x0f) << 4 | (idxArr[2] & 0x3c) >> 2;
		}
		else if(idxArr[0] != -1 && idxArr[1] != -1){
			byteArr[0] = idxArr[0] << 2 | (idxArr[1] & 0xf0) >> 4;
		}

		if(byteArr[0] == -1){
			decodeErrorTip();
			return "";
		}
		else{
			for(var i = 0; i < byteArr.length; i++){
				if(byteArr[i] != -1){
					arr.push(byteArr[i])
				}
			}
		}

		index = index + 4;
	}

	if(output == "arr"){
		return arr;
	}
	else if(output == "str"){
		return byteToString(arr);
	}
}


var base32Table = {
    0:'A',  1:'B',  2:'C',  3:'D',  4:'E',  5:'F',  6:'G',  7:'H',
    8:'I',  9:'J', 10:'K', 11:'L', 12:'M', 13:'N', 14:'O', 15:'P',
   16:'Q', 17:'R', 18:'S', 19:'T', 20:'U', 21:'V', 22:'W', 23:'X',
   24:'Y', 25:'Z', 26:'2', 27:'3', 28:'4', 29:'5', 30:'6', 31:'7'
}

var base32ReverseTable = {};
Object.keys(base32Table).forEach(function(key){
	if(!isNaN(key)){
		var newKey   = base32Table[key].toString();
		var newValue =  parseInt(key);
		base32ReverseTable[newKey] = newValue;
	}
});

var binBytesToBase32Bytes = function(input_bytes)
{
	var output_bytes = new Array();
	if(input_bytes.length == 0){
		return output_bytes;
	}

	var count = 0;
	var input_len = input_bytes.length;
	switch(input_len){
		case 5: count = 5 * 8; break;
		case 4: count = 5 * 7; break;
		case 3: count = 5 * 5; break;
		case 2: count = 5 * 4; break;
		case 1: count = 5 * 2; break;
	}

	var split_count = 0;
	var split_total = 5;
	var tmp = 0;
	var bytes = input_bytes.slice();
	for(var i = 0; i < count; i++){
		var bit = (bytes[0] & 0x80) >> 7;
		bytes[0] = bytes[0] << 1;
		var index = 0;
		while(index < bytes.length - 1)
		{
			bytes[index] = bytes[index] | ((bytes[index] & 0x01) | ((bytes[index + 1] & 0x80) >> 7));
			bytes[index + 1] = bytes[index + 1] << 1;
			index = index + 1;
		}
		tmp = (tmp << 1 | bit);
		split_count = split_count + 1;
		if(!(split_count < split_total)){
			output_bytes.push(base32Table[tmp]);
			split_count = 0;
			tmp = 0;
		}
	}

	while(output_bytes.length < 8){
		output_bytes.push('=');
	}

	console.log(output_bytes);

	return output_bytes;
}

var base32BytesToBinBytes = function(input_bytes)
{
	var output_bytes = new Array();
	var bytes = new Array();
	var len = 0;
	for(i = 0; i < input_bytes.length; i++){
		var b = input_bytes[i];
		if(base32ReverseTable[String.fromCharCode(b)] != undefined){
			bytes.push(base32ReverseTable[String.fromCharCode(b)]);
			len = len + 1;
		}
		else if(b == 61){
			bytes.push(0x00);
		}
	}

	while(bytes.length < 8){
		bytes.push(0x00);
	}

	var count = 0;
	console.log(len);
	switch(len){
		case 2: count = 8 * 1; break;
		case 4: count = 8 * 2; break;
		case 5: count = 8 * 3; break;
		case 7: count = 8 * 4; break;
		case 8: count = 8 * 5; break;
	}

	var split_count = 0;
	var split_total = 8;
	var tmp = 0;
	for(var i = 0; i < count; i++){
		var bit = (bytes[0] & 0x10) >> 4;
		bytes[0] = (bytes[0] << 1) & 0x1f;
		var index = 0;
		while(index < bytes.length - 1)
		{
			bytes[index] = bytes[index] | ((bytes[index] & 0x01) | ((bytes[index + 1] & 0x10) >> 4));
			bytes[index + 1] = (bytes[index + 1] << 1) & 0x1f;
			index = index + 1;
		}
		tmp = (tmp << 1 | bit);
		split_count = split_count + 1;
		if(!(split_count < split_total)){
			output_bytes.push(tmp);
			split_count = 0;
			tmp = 0;
		}
	}
	return output_bytes;
}

//base32编码
function base32Encode(input)
{
	var bytes = null;
	if(Object.prototype.toString.call(input) === "[object String]"){
		bytes = stringToByte(input);
	}
	else if(Object.prototype.toString.call(input) === "[object Array]"){
		bytes = input;
	}
	else{
		return "";
	}

	var arr = new Array();
	var index = 0;
	while(index < bytes.length)
	{
		var input_bytes = bytes.slice(index, index+5);
		var output_bytes = binBytesToBase32Bytes(input_bytes);
		arr = arr.concat(output_bytes);
		index = index + 5;
	}
	return arr.join('');
}

//base32解码
function base32Decode(str)
{
	var arr = new Array();
	var bytes = stringToByte(str.toUpperCase());
	var index = 0;
	while(index < bytes.length)
	{
		var input_bytes = bytes.slice(index, index+8);
		if(input_bytes.length != 8){
			decodeErrorTip();
			return "";
		}
		var output_bytes = base32BytesToBinBytes(input_bytes);
		console.log(output_bytes);
		arr = arr.concat(output_bytes);
		index = index + 8;
	}
	return byteToString(arr);
}




//base16编码
function base16Encode(str)
{
	var base16String = '0123456789ABCDEF'
	var arr = new Array();
	var bytes = stringToByte(str);
	for(var i = 0; i < bytes.length; i++){
		var high = bytes[i] >> 4;
		var low  = bytes[i] & 0x0f;
		arr.push(base16String[high]);
		arr.push(base16String[low]);
	}
	return arr.join('');
}

var base16Convert = function(byteValue)
{
	var value = -1;
	if(byteValue != undefined){
		if(48 <= byteValue && byteValue <= 59){
			value = byteValue - 48;
		}
		else if(65 <= byteValue && byteValue <= 70){
			value = byteValue - 65 + 10;
		}
		else if(97 <= byteValue && byteValue <= 102){
			value = byteValue - 97 + 10;
		}
	}
	return value;
}

//base16解码
function base16Decode(str)
{
	var bytes = null;
	if(Object.prototype.toString.call(input) === "[object String]"){
		bytes = stringToByte(input);
	}
	else if(Object.prototype.toString.call(input) === "[object Array]"){
		bytes = input;
	}
	else{
		return "";
	}

	var arr   = new Array();
	var index = 0;
	while(index < bytes.length)
	{
		var high = bytes[index++];
		var low  = bytes[index++];
		var highValue = base16Convert(high);
		var lowValue  = base16Convert(low);
		if(highValue != -1 && lowValue != -1){
			var value = highValue << 4 | lowValue
			arr.push(value);
		}
	}
	return byteToString(arr);
}
