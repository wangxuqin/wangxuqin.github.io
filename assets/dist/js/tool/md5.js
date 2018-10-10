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


var group = function(bytes, index)
{
	var m = new Array();
	if(index < bytes.length)
	{
		var count = 0;
		for(var i = index; i < bytes.length; i = i + 4)
		{
			var b = bytes[i + 3];
			b = b << 8 | bytes[i + 2];
			b = b << 8 | bytes[i + 1];
			b = b << 8 | bytes[i];
			m.push(b);
			count = count + 1;
			if(!(count < 16)){
				break;
			}
		}
	}
	return m;
}

var leftrotate = function(a, n){
	return ((a & 0xffffffff) << n) | ((a & 0xffffffff)  >>> (32 - n));
}

var safeAdd = function(x, y) {
    var lsw = (x & 0xffff) + (y & 0xffff)
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16)
    return (msw << 16) | (lsw & 0xffff)
}

function md5(str){
	var arr = new Array();
	var bytes = stringToByte(str);
	var len = bytes.length;
	if(len == 0){
		return "";
	}

	if ((len % 64) != 56){
		bytes.push(0x01 << 7);
		while(bytes.length % 64 != 56){
			bytes.push(0x00);
		}
	}

	//len最大值为Math.pow(2, 53) - 1
	var lLen = len * 8;
	bytes.push(lLen & 0xff);
	bytes.push((lLen >>  8) & 0xff);
	bytes.push((lLen >> 16) & 0xff);
	bytes.push((lLen >> 24) & 0xff);

	var hLen = len >> 29;//直接替代了len * 8 >> 32，因为len * 8有溢出的风险
	bytes.push(hLen & 0xff);
	bytes.push((hLen >> 8)  & 0xff);
	bytes.push((hLen >> 16) & 0xff);
	bytes.push((hLen >> 24) & 0xff);


	console.log(bytes);

	var S = [	
				7, 12, 17, 22,  7, 12, 17, 22,  7, 12, 17, 22,  7, 12, 17, 22,
				5,  9, 14, 20,  5,  9, 14, 20,  5,  9, 14, 20,  5,  9, 14, 20,
				4, 11, 16, 23,  4, 11, 16, 23,  4, 11, 16, 23,  4, 11, 16, 23,
				6, 10, 15, 21,  6, 10, 15, 21,  6, 10, 15, 21,  6, 10, 15, 21
			];

	

	var K = new Array();
	for(var i = 0; i < 64; i++){
		K[i] = Math.floor(Math.pow(2, 32) * Math.abs(Math.sin(i + 1)));
		console.log(K[i].toString(16));
	}

 // var K = [
 //    0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee ,
 //    0xf57c0faf, 0x4787c62a, 0xa8304613, 0xfd469501 ,
 //    0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be ,
 //    0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821 ,
 //    0xf61e2562, 0xc040b340, 0x265e5a51, 0xe9b6c7aa ,
 //    0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8 ,
 //    0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed ,
 //    0xa9e3e905, 0xfcefa3f8, 0x676f02d9, 0x8d2a4c8a ,
 //    0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c ,
 //    0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70 ,
 //    0x289b7ec6, 0xeaa127fa, 0xd4ef3085, 0x04881d05 ,
 //    0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665 ,
 //    0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039 ,
 //    0x655b59c3, 0x8f0ccc92, 0xffeff47d, 0x85845dd1 ,
 //    0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1 ,
 //    0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391 ];

	var  a0 = 0x67452301; //A
	var  b0 = 0xefcdab89; //B
	var  c0 = 0x98badcfe; //C
	var  d0 = 0x10325476; //D


	for(var i = 0; i < bytes.length; i = i + 64)
	{
		var M = group(bytes, i);
		var A = a0;
		var B = b0;
		var C = c0;
		var D = d0;
		var F = 0;
		var g = 0;

		for(n = 0; n < 64; n++){
			if(0 <= n && n <= 15){
				F = (B & C) | (~B & D);
				g = n % 16;
			}
			else if(16 <= n && n <= 31){
				F = (B & D) | (C & ~D);
				g = (n * 5 + 1) % 16;
			}
			else if(32 <= n && n <= 47){
				F = B ^ C ^ D;
				g = (n * 3 + 5) % 16;
			}
			else{
				F = C ^ (B | ~D);
				g = (n * 7) % 16;
			}

			F = safeAdd(safeAdd(F, A), safeAdd(K[n],M[g]));
			A = D;
			D = C;
			C = B;
			B = safeAdd(B, leftrotate(F, S[n]));
		}

		a0 = safeAdd(a0, A);
		b0 = safeAdd(b0, B);
		c0 = safeAdd(c0, C);
		d0 = safeAdd(d0, D);
	}
	var tmp = [a0, b0, c0, d0];

	var hex_char = '0123456789ABCDEF'.split('');
	for(var i = 0; i < tmp.length; i++)
	{
		var n = tmp[i];
		var s = '';
		for (var j = 0; j < 4; j++){
			s += hex_char[(n >> (j * 8 + 4)) & 0x0F] + hex_char[(n >> (j * 8)) & 0x0F];
		}
		arr.push(s);
	}

	return arr.join('');
}