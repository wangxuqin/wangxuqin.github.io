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


var group = function(bytes, index, length)
{
	var m = new Array(length);
	if(index < bytes.length)
	{
		var count = 0;
		for(var i = index; i < bytes.length; i = i + 4)
		{
			m[count] = bytes[i] << 24 | bytes[i + 1] << 16 | bytes[i + 2] << 8 | bytes[i + 3];
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

function sha1(input){
	var arr = new Array();
	var bytes = null;
	if(Object.prototype.toString.call(input) === "[object String]"){
		str = input
		bytes = stringToByte(str);
	}
	else if(Object.prototype.toString.call(input) === "[object Array]"){
		bytes = input;
	}
	else{
		alert("输入参数错误!");
		return;
	}

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


	var hLen = len >> 29;//直接替代了len * 8 >> 32，因为len * 8有溢出的风险
	bytes.push((hLen >> 24) & 0xff);
	bytes.push((hLen >> 16) & 0xff);
	bytes.push((hLen >> 8)  & 0xff);
	bytes.push(hLen & 0xff);

	//len最大值为Math.pow(2, 53) - 1
	var lLen = len * 8;
	bytes.push((lLen >> 24) & 0xff);
	bytes.push((lLen >> 16) & 0xff);
	bytes.push((lLen >>  8) & 0xff);
	bytes.push(lLen & 0xff);

	var h0 = 0x67452301;
	var h1 = 0xEFCDAB89;
	var h2 = 0x98BADCFE;
	var h3 = 0x10325476;
	var h4 = 0xC3D2E1F0;
	for(var i = 0; i < bytes.length; i = i + 64)
	{

		var M = group(bytes, i, 80);
		for(var k = 16; k < 80; k++){
			M[k] = leftrotate(M[k - 3] ^ M[k - 8] ^ M[k - 14] ^ M[k - 16], 1); 
		}

		a = h0;
		b = h1;
		c = h2;
		d = h3;
		e = h4;
		var f = 0;
		var k = 0;
		for(var n = 0; n < 80; n++){
			if(n < 20){
				 f = (b & c) | ((~b) & d);
            	 k = 0x5A827999;
			}
			else if (n < 40){
				f = b ^ c ^ d;
            	k = 0x6ED9EBA1;
			}
			else if (n < 60){
				f = (b & c) | (b & d) |(c & d);
            	k = 0x8F1BBCDC;
			}
			else{
				f = b ^ c ^ d;
            	k = 0xCA62C1D6;
			}

			var temp = safeAdd(leftrotate(a,5), safeAdd(safeAdd(f,e), safeAdd(k, M[n])));
	        e = d;
	        d = c;
	        c = leftrotate(b, 30);
	        b = a;
	        a = temp;
	        console.log([a, b, c, d, e]);
		}

		h0 = safeAdd(h0, a);
		h1 = safeAdd(h1, b);
		h2 = safeAdd(h2, c);
		h3 = safeAdd(h3, d);
		h4 = safeAdd(h4, e);
	}

	var tmp = [h0, h1, h2, h3, h4];
	console.log("tmp = ", tmp);

	var hex_char = '0123456789abcdef'.split('');
	for(var i = 0; i < tmp.length; i++)
	{
		var n = tmp[i];
		var s = '';
		for (var j = 28; j >= 0; j = j - 4){
			s += hex_char[(n >> j) & 0x0F];
		}
		console.log("s = ", s);
		arr.push(s);
	}
	return arr.join('');
}