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

function base64Encode(str)
{
	var arr = new Array();
	var bytes = stringToByte(str);
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

var decodeErrorTip = function(){
	alert("解码失败!请检查输入字符串是否合法!");
}
function base64Decode(str){
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

	return byteToString(arr);
}
