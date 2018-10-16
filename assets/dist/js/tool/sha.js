var hex_char = '0123456789abcdef'.split('');

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

var rightrotate = function(a, n){
	return ((a & 0xffffffff) >>> n) | ((a & 0xffffffff)  << (32 - n));
}

var safeAdd = function(x, y) {
    var lsw = (x & 0xffff) + (y & 0xffff)
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16)
    return (msw << 16) | (lsw & 0xffff)
}

var safeAdds = function(arr){
	if(arr.length == 0){
		return 0;
	}
	
	if(arr.length == 1){
		return arr[0];
	}

	var value = arr[0];
	for(var i = 1; i < arr.length; i++){
		value = safeAdd(value, arr[i]);
	}
	return value;
}

var fill = function(bytes){
	var len = bytes.length;

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
}

var handleInput = function(input)
{
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
		return bytes;
	}
	fill(bytes);
	return bytes;
}

var hexOutput = function(arr)
{
	var output = new Array();
	for(var i = 0; i < arr.length; i++)
	{
		var n = arr[i];
		var s = '';
		for (var j = 28; j >= 0; j = j - 4){
			s += hex_char[(n >> j) & 0x0F];
		}
		output.push(s);
	}
	return output.join('');
}

function sha1(input){
	var bytes = handleInput(input);
	if(bytes == null){
		return "";
	}

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
	return hexOutput([h0, h1, h2, h3, h4]);
}

function sha256(input){
	var bytes = handleInput(input);
	if(bytes == null){
		return "";
	}

	K = [
	   0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
	   0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
	   0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
	   0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
	   0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
	   0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
	   0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
	   0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
   ];


	var h0 = 0x6a09e667;
	var h1 = 0xbb67ae85;
	var h2 = 0x3c6ef372;
	var h3 = 0xa54ff53a;
	var h4 = 0x510e527f;
	var h5 = 0x9b05688c;
	var h6 = 0x1f83d9ab;
	var h7 = 0x5be0cd19;

	for(var i = 0; i < bytes.length; i = i + 64)
	{

		var w = group(bytes, i, 64);
		for(var k = 16; k < 64; k++){
			var s0 = rightrotate(w[k - 15],  7) ^ rightrotate(w[k - 15], 18) ^ (w[k - 15] >>>  3)
	        var s1 = rightrotate(w[k -  2], 17) ^ rightrotate(w[k -  2], 19) ^ (w[k -  2] >>> 10)
	        w[k]   = safeAdds([w[k-16], s0, w[k-7], s1]);
		}

		var a = h0;
	    var b = h1;
	    var c = h2;
	    var d = h3;
	    var e = h4;
	    var f = h5;
	    var g = h6;
	    var h = h7;

	    for(var n = 0; n < 64; n++){
	        var s0  = rightrotate(a, 2) ^ rightrotate(a, 13) ^ rightrotate(a, 22);
	        var maj = (a & b) ^ (a & c) ^(b & c);
	        var t2  = safeAdd(s0, maj);
	        var s1  = rightrotate(e, 6) ^ rightrotate(e, 11) ^ rightrotate(e, 25)
	        var ch  = (e & f) ^ ((~e) & g);
	        var t1  = safeAdds([h, s1, ch, K[n], w[n]]);
	        h = g;
	        g = f;
	        f = e;
	        e = safeAdd(d, t1);
	        d = c;
	        c = b;
	        b = a;
	        a = safeAdd(t1, t2);
	    }

	    h0 = safeAdd(h0, a);
	    h1 = safeAdd(h1, b);
	    h2 = safeAdd(h2, c);
	    h3 = safeAdd(h3, d);
	    h4 = safeAdd(h4, e);
	    h5 = safeAdd(h5, f);
	    h6 = safeAdd(h6, g);
	    h7 = safeAdd(h7, h);
	}

	return hexOutput([h0, h1, h2, h3, h4, h5, h6, h7]);
}

function sha224(input){
	var bytes = handleInput(input);
	if(bytes == null){
		return "";
	}

	K = [
	   0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
	   0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
	   0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
	   0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
	   0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
	   0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
	   0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
	   0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
   ];


	var h0 = 0xc1059ed8;
    var h1 = 0x367cd507;
    var h2 = 0x3070dd17;
    var h3 = 0xf70e5939;
    var h4 = 0xffc00b31;
    var h5 = 0x68581511;
    var h6 = 0x64f98fa7;
    var h7 = 0xbefa4fa4;
    
	for(var i = 0; i < bytes.length; i = i + 64)
	{

		var w = group(bytes, i, 64);
		for(var k = 16; k < 64; k++){
			var s0 = rightrotate(w[k - 15],  7) ^ rightrotate(w[k - 15], 18) ^ (w[k - 15] >>>  3)
	        var s1 = rightrotate(w[k -  2], 17) ^ rightrotate(w[k -  2], 19) ^ (w[k -  2] >>> 10)
	        w[k]   = safeAdds([w[k-16], s0, w[k-7], s1]);
		}

		var a = h0;
	    var b = h1;
	    var c = h2;
	    var d = h3;
	    var e = h4;
	    var f = h5;
	    var g = h6;
	    var h = h7;

	    for(var n = 0; n < 64; n++){
	        var s0  = rightrotate(a, 2) ^ rightrotate(a, 13) ^ rightrotate(a, 22);
	        var maj = (a & b) ^ (a & c) ^(b & c);
	        var t2  = safeAdd(s0, maj);
	        var s1  = rightrotate(e, 6) ^ rightrotate(e, 11) ^ rightrotate(e, 25)
	        var ch  = (e & f) ^ ((~e) & g);
	        var t1  = safeAdds([h, s1, ch, K[n], w[n]]);
	        h = g;
	        g = f;
	        f = e;
	        e = safeAdd(d, t1);
	        d = c;
	        c = b;
	        b = a;
	        a = safeAdd(t1, t2);
	    }

	    h0 = safeAdd(h0, a);
	    h1 = safeAdd(h1, b);
	    h2 = safeAdd(h2, c);
	    h3 = safeAdd(h3, d);
	    h4 = safeAdd(h4, e);
	    h5 = safeAdd(h5, f);
	    h6 = safeAdd(h6, g);
	    h7 = safeAdd(h7, h);
	}

	return hexOutput([h0, h1, h2, h3, h4, h5, h6]);
}