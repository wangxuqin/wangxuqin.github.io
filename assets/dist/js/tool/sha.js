

function padding(num) {
	var length = 16;
    var str = num.toString(2);
    for(var len = str.length; len < length; len = str.length) {
        str = "0" + str;            
    }
    return str;
}

function padding16(num) {
	var length = 4;
    var str = num.toString(16);
    for(var len = str.length; len < length; len = str.length) {
        str = "0" + str;            
    }
    return str;
}


class int64_class {
	constructor(h, l){
		this.h = h;
		this.l = l;
	}
}

int64_class.prototype.toString = function()
{
	var r0 = this.l & 0xffff;
	var r1 = this.l >>> 16;
	var r2 = this.h & 0xffff;
	var r3 = this.h >>> 16;
	return (padding16(r3) + padding16(r2) + padding16(r1) + padding16(r0));
}

int64_class.prototype.toByteArray = function()
{
	var arr = new Array(8);
	arr[0] = this.l & 0xff;
	arr[1] = (this.l & 0xffff) >>> 8;
	arr[2] = (this.l >>> 16) & 0xff;
	arr[3] = (this.l >>> 24);

	arr[4] = this.h & 0xff;
	arr[5] = (this.h & 0xffff) >>> 8;
	arr[6] = (this.h >>> 16) & 0xff;
	arr[7] = (this.h >>> 24);
	return arr;
}

int64_class.prototype.fromByteArray = function(arr)
{
	
	this.l = arr[3] << 24 | arr[2] << 16 | arr[1] << 8 | arr[0];
	this.h = arr[7] << 24 | arr[6] << 16 | arr[5] << 8 | arr[4];
}

int64_class.prototype.toGetByteArrayWithArray = function(arr)
{
	arr.push(this.l & 0xff);
	arr.push((this.l & 0xffff) >>> 8);
	arr.push((this.l >>> 16) & 0xff);
	arr.push(this.l >>> 24);
	arr.push(this.h & 0xff);
	arr.push((this.h & 0xffff) >>> 8);
	arr.push((this.h >>> 16) & 0xff);
	arr.push((this.h >>> 24));
}

function int64(h, l){
	return new int64_class(h, l);
}


function int64_add(ret, a, b)
{
	var w0 = (a.l & 0xffff) + (b.l & 0xffff);
	var w1 = (a.l >>> 16)   + (b.l >>> 16)   + (w0 >>> 16)
	var w2 = (a.h & 0xffff) + (b.h & 0xffff) + (w1 >>> 16);
	var w3 = (a.h >>> 16)   + (b.h >>> 16)   + (w2 >>> 16);
	ret.l  = (w1 << 16) | (w0 & 0xffff);
	ret.h  = (w3 << 16) | (w2 & 0xffff);
}

function int64_add3(ret, a, b, c)
{
	var w0 = (a.l & 0xffff) + (b.l & 0xffff) + (c.l & 0xffff);
	var w1 = (a.l >>> 16)   + (b.l >>> 16)   + (c.l >>> 16) 	+ (w0 >>> 16)
	var w2 = (a.h & 0xffff) + (b.h & 0xffff) + (c.h & 0xffff) 	+ (w1 >>> 16);
	var w3 = (a.h >>> 16)   + (b.h >>> 16)   + (c.h >>> 16)		+ (w2 >>> 16);
	ret.l  = (w1 << 16) | (w0 & 0xffff);
	ret.h  = (w3 << 16) | (w2 & 0xffff);
}

function int64_add4(ret, a, b, c, d)
{
	var w0 = (a.l & 0xffff) + (b.l & 0xffff) + (c.l & 0xffff)	+ (d.l & 0xffff);
	var w1 = (a.l >>> 16)   + (b.l >>> 16)   + (c.l >>> 16) 	+ (d.l >>> 16)		+ (w0 >>> 16)
	var w2 = (a.h & 0xffff) + (b.h & 0xffff) + (c.h & 0xffff) 	+ (d.h & 0xffff)	+ (w1 >>> 16);
	var w3 = (a.h >>> 16)   + (b.h >>> 16)   + (c.h >>> 16)		+ (d.h >>> 16)		+ (w2 >>> 16);
	ret.l  = (w1 << 16) | (w0 & 0xffff);
	ret.h  = (w3 << 16) | (w2 & 0xffff);
}

function int64_add5(ret, a, b, c, d, e)
{
	var w0 = (a.l & 0xffff) + (b.l & 0xffff) + (c.l & 0xffff)	+ (d.l & 0xffff)	+ (e.l & 0xffff);
	var w1 = (a.l >>> 16)   + (b.l >>> 16)   + (c.l >>> 16) 	+ (d.l >>> 16)		+ (e.l >>> 16)		+ (w0 >>> 16)
	var w2 = (a.h & 0xffff) + (b.h & 0xffff) + (c.h & 0xffff) 	+ (d.h & 0xffff)	+ (e.h & 0xffff)	+ (w1 >>> 16);
	var w3 = (a.h >>> 16)   + (b.h >>> 16)   + (c.h >>> 16)		+ (d.h >>> 16)		+ (e.h >>> 16)		+ (w2 >>> 16);
	ret.l  = (w1 << 16) | (w0 & 0xffff);
	ret.h  = (w3 << 16) | (w2 & 0xffff);
}

function int64_copy(a, b)
{
	a.h = b.h;
	a.l = b.l;
}

function int64_right_rotate(ret, a, n)
{
	n = n % 64;
	var t0 = a.l & 0xffff;
	var t1 = a.l >>> 16;
	var t2 = a.h & 0xffff;
	var t3 = a.h >>> 16;

	var t  = [t0, t1, t2, t3]
	var offset = Math.floor(n / 16);
	var w  = [t[(0 + offset) % 4], t[(1 + offset) % 4], t[(2 + offset) % 4], t[(3 + offset) % 4]];
	n = n % 16;

	var r0 = (w[1] << (16 - n)) & 0xffff | (w[0] >>> n);
	var r1 = (w[2] << (16 - n)) & 0xffff | (w[1] >>> n);
	var r2 = (w[3] << (16 - n)) & 0xffff | (w[2] >>> n);
	var r3 = (w[0] << (16 - n)) & 0xffff | (w[3] >>> n);

	ret.h = (r3 << 16) & 0xffffffff | r2;
	ret.l = (r1 << 16) & 0xffffffff | r0;
	
	/*
	if(n < 32){
		ret.l = (a.l >>> n) | (a.h << (32-n));
    	ret.h = (a.h >>> n) | (a.l << (32-n));
    }
    else{
    	n = n - 32;
    	ret.l = (a.h >>> n) | (a.l << (32-n));
    	ret.h = (a.l >>> n) | (a.h << (32-n));
    }
    */


	//console.log("n = "+n + "\t"+ padding(r3) + "\t" + padding(r2) + "\t" + padding(r1) + "\t" + padding(r0));
}

function int64_right_shift(ret, a, n)
{
	if(n >= 64){
		ret.h = 0;
		ret.l = 0;
		return;
	}

	var t0 = a.l & 0xffff;
	var t1 = a.l >>> 16;
	var t2 = a.h & 0xffff;
	var t3 = a.h >>> 16;

	var t = [t0, t1, t2, t3, 0, 0, 0];
	var offset = Math.floor(n / 16);
	var w  = [t[0 + offset], t[1 + offset], t[2 + offset], t[3 + offset]];
	n = n % 16;

	var r0 = (w[1] << (16 - n)) & 0xffff | (w[0] >>> n);
	var r1 = (w[2] << (16 - n)) & 0xffff | (w[1] >>> n);
	var r2 = (w[3] << (16 - n)) & 0xffff | (w[2] >>> n);
	var r3 = (w[3] >>> n);

	ret.h = (r3 << 16) & 0xffffffff | r2;
	ret.l = (r1 << 16) & 0xffffffff | r0;

	//console.log("n = "+n + "\t"+ padding(r3) + "\t" + padding(r2) + "\t" + padding(r1) + "\t" + padding(r0));
}


function int64_left_rotate(ret, a, n)
{
	n = n % 64;
	var t0 = a.l & 0xffff;
	var t1 = a.l >>> 16;
	var t2 = a.h & 0xffff;
	var t3 = a.h >>> 16;

	var t  = [t3, t2, t1, t0]
	var offset = Math.floor(n / 16);
	var w  = new Array(4);
	w[3] = t[(0 + offset) % 4];
	w[2] = t[(1 + offset) % 4];
	w[1] = t[(2 + offset) % 4];
	w[0] = t[(3 + offset) % 4];
	n = n % 16;

	var r0 = (w[0] << n & 0xffff) | w[3] >>> (16 - n);
	var r1 = (w[1] << n & 0xffff) | w[0] >>> (16 - n);
	var r2 = (w[2] << n & 0xffff) | w[1] >>> (16 - n);
	var r3 = (w[3] << n & 0xffff) | w[2] >>> (16 - n);

	ret.h = (r3 << 16) & 0xffffffff | r2;
	ret.l = (r1 << 16) & 0xffffffff | r0;
	//console.log("n = "+n + " " + padding16(r3) + padding16(r2) + padding16(r1) + padding16(r0));
}

function int64_left_shift(ret, a, n)
{

	if(n >= 64){
		ret.h = 0;
		ret.l = 0;
		return;
	}

	var t0 = a.l & 0xffff;
	var t1 = a.l >>> 16;
	var t2 = a.h & 0xffff;
	var t3 = a.h >>> 16;

	var t  = [t3, t2, t1, t0, 0, 0, 0]
	var offset = Math.floor(n / 16);
	var w  = new Array(4);
	w[3] = t[0 + offset];
	w[2] = t[1 + offset];
	w[1] = t[2 + offset];
	w[0] = t[3 + offset];
	n = n % 16;

	var r0 = (w[0] << n & 0xffff);
	var r1 = (w[1] << n & 0xffff) | w[0] >>> (16 - n);
	var r2 = (w[2] << n & 0xffff) | w[1] >>> (16 - n);
	var r3 = (w[3] << n & 0xffff) | w[2] >>> (16 - n);

	ret.h = (r3 << 16) & 0xffffffff | r2;
	ret.l = (r1 << 16) & 0xffffffff | r0;

	//console.log("n = "+n + "\t"+ padding(r3) + "\t" + padding(r2) + "\t" + padding(r1) + "\t" + padding(r0));
}

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

var group64 = function(bytes, index, length)
{
	var m = new Array(length);
	if(index < bytes.length)
	{
		var count = 0;
		var h = 0;
		var l = 0;
		for(var i = index; i < bytes.length; i = i + 8)
		{
			h = bytes[i]     << 24 | bytes[i + 1] << 16 | bytes[i + 2] << 8 | bytes[i + 3];
			l = bytes[i + 4] << 24 | bytes[i + 5] << 16 | bytes[i + 6] << 8 | bytes[i + 7];
			m[count] = int64(h, l);
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

var fillInt64 = function(bytes){
	var len = bytes.length;

	if ((len % 128) != 112 ){
		bytes.push(0x01 << 7);
		while(bytes.length % 128 != 112){
			bytes.push(0x00);
		}
	}

	for(var i = 0; i < 8; i++){
		bytes.push(0x00);
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

var handleInputInt64 = function(input)
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
	fillInt64(bytes);
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

var hexOutput64 = function(arr)
{
	var output = new Array();
	for(var i = 0; i < arr.length; i++)
	{
		var w = arr[i];
		var h = w.h;
		var l = w.l;
		var s = '';
		for (var j = 28; j >= 0; j = j - 4){
			s += hex_char[(h >> j) & 0x0F];
		}

		for (var j = 28; j >= 0; j = j - 4){
			s += hex_char[(l >> j) & 0x0F];
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


function sha384(input)
{
	var bytes = handleInputInt64(input);
	if(bytes == null){
		return "";
	}

	var K = [
		int64(0x428a2f98, 0xd728ae22), int64(0x71374491, 0x23ef65cd), int64(0xb5c0fbcf, 0xec4d3b2f), int64(0xe9b5dba5, 0x8189dbbc), 
		int64(0x3956c25b, 0xf348b538), int64(0x59f111f1, 0xb605d019), int64(0x923f82a4, 0xaf194f9b), int64(0xab1c5ed5, 0xda6d8118), 
		int64(0xd807aa98, 0xa3030242), int64(0x12835b01, 0x45706fbe), int64(0x243185be, 0x4ee4b28c), int64(0x550c7dc3, 0xd5ffb4e2), 
		int64(0x72be5d74, 0xf27b896f), int64(0x80deb1fe, 0x3b1696b1), int64(0x9bdc06a7, 0x25c71235), int64(0xc19bf174, 0xcf692694),
		int64(0xe49b69c1, 0x9ef14ad2), int64(0xefbe4786, 0x384f25e3), int64(0x0fc19dc6, 0x8b8cd5b5), int64(0x240ca1cc, 0x77ac9c65), 
		int64(0x2de92c6f, 0x592b0275), int64(0x4a7484aa, 0x6ea6e483), int64(0x5cb0a9dc, 0xbd41fbd4), int64(0x76f988da, 0x831153b5),
		int64(0x983e5152, 0xee66dfab), int64(0xa831c66d, 0x2db43210), int64(0xb00327c8, 0x98fb213f), int64(0xbf597fc7, 0xbeef0ee4), 
		int64(0xc6e00bf3, 0x3da88fc2), int64(0xd5a79147, 0x930aa725), int64(0x06ca6351, 0xe003826f), int64(0x14292967, 0x0a0e6e70),
		int64(0x27b70a85, 0x46d22ffc), int64(0x2e1b2138, 0x5c26c926), int64(0x4d2c6dfc, 0x5ac42aed), int64(0x53380d13, 0x9d95b3df), 
		int64(0x650a7354, 0x8baf63de), int64(0x766a0abb, 0x3c77b2a8), int64(0x81c2c92e, 0x47edaee6), int64(0x92722c85, 0x1482353b),
		int64(0xa2bfe8a1, 0x4cf10364), int64(0xa81a664b, 0xbc423001), int64(0xc24b8b70, 0xd0f89791), int64(0xc76c51a3, 0x0654be30), 
		int64(0xd192e819, 0xd6ef5218), int64(0xd6990624, 0x5565a910), int64(0xf40e3585, 0x5771202a), int64(0x106aa070, 0x32bbd1b8),
		int64(0x19a4c116, 0xb8d2d0c8), int64(0x1e376c08, 0x5141ab53), int64(0x2748774c, 0xdf8eeb99), int64(0x34b0bcb5, 0xe19b48a8), 
		int64(0x391c0cb3, 0xc5c95a63), int64(0x4ed8aa4a, 0xe3418acb), int64(0x5b9cca4f, 0x7763e373), int64(0x682e6ff3, 0xd6b2b8a3),
		int64(0x748f82ee, 0x5defb2fc), int64(0x78a5636f, 0x43172f60), int64(0x84c87814, 0xa1f0ab72), int64(0x8cc70208, 0x1a6439ec), 
		int64(0x90befffa, 0x23631e28), int64(0xa4506ceb, 0xde82bde9), int64(0xbef9a3f7, 0xb2c67915), int64(0xc67178f2, 0xe372532b),
		int64(0xca273ece, 0xea26619c), int64(0xd186b8c7, 0x21c0c207), int64(0xeada7dd6, 0xcde0eb1e), int64(0xf57d4f7f, 0xee6ed178), 
		int64(0x06f067aa, 0x72176fba), int64(0x0a637dc5, 0xa2c898a6), int64(0x113f9804, 0xbef90dae), int64(0x1b710b35, 0x131c471b),
		int64(0x28db77f5, 0x23047d84), int64(0x32caab7b, 0x40c72493), int64(0x3c9ebe0a, 0x15c9bebc), int64(0x431d67c4, 0x9c100d4c), 
		int64(0x4cc5d4be, 0xcb3e42b6), int64(0x597f299c, 0xfc657e2a), int64(0x5fcb6fab, 0x3ad6faec), int64(0x6c44198c, 0x4a475817)
	];

	var h0 = int64(0xcbbb9d5d, 0xc1059ed8);
	var h1 = int64(0x629a292a, 0x367cd507);
	var h2 = int64(0x9159015a, 0x3070dd17);
	var h3 = int64(0x152fecd8, 0xf70e5939);
	var h4 = int64(0x67332667, 0xffc00b31);
	var h5 = int64(0x8eb44a87, 0x68581511);
	var h6 = int64(0xdb0c2e0d, 0x64f98fa7);
	var h7 = int64(0x47b5481d, 0xbefa4fa4);

	var a  = int64(0, 0);
	var b  = int64(0, 0);
	var c  = int64(0, 0);
	var d  = int64(0, 0);
	var e  = int64(0, 0);
	var f  = int64(0, 0);
	var g  = int64(0, 0);
	var h  = int64(0, 0);

	var r1 = int64(0, 0);
	var r2 = int64(0, 0);
	var r3 = int64(0, 0);
	var s0 = int64(0, 0);
	var s1 = int64(0, 0);

	var Ch = int64(0, 0);
	var Maj= int64(0, 0);
	var T1 = int64(0, 0);
	var T2 = int64(0, 0);

	var gamma0 = int64(0, 0);
	var gamma1 = int64(0, 0);

	for(var i = 0; i < bytes.length; i = i + 128)
	{
		var w = group64(bytes, i, 80);
		for(var k = 16; k < 80; k++){
			w[k] = int64(0, 0);
			int64_right_rotate(r1, w[k - 2], 19);
			int64_right_rotate(r2, w[k - 2], 61);
			int64_right_shift(r3, w[k - 2], 6);
			s1.l = r1.l ^ r2.l ^ r3.l;
			s1.h = r1.h ^ r2.h ^ r3.h;

			int64_right_rotate(r1, w[k - 15], 1);
			int64_right_rotate(r2, w[k - 15], 8);
			int64_right_shift(r3, w[k - 15], 7);
			s0.l = r1.l ^ r2.l ^ r3.l;
			s0.h = r1.h ^ r2.h ^ r3.h;

			int64_add4(w[k], s1, w[k - 7], s0, w[k - 16]);
		}

		int64_copy(a, h0);
		int64_copy(b, h1);
		int64_copy(c, h2);
		int64_copy(d, h3);
		int64_copy(e, h4);
		int64_copy(f, h5);
		int64_copy(g, h6);
		int64_copy(h, h7);

		for(var n = 0; n < 80; n++){
			//计算T1
			Ch.l = (e.l & f.l) ^ (~e.l & g.l);
			Ch.h = (e.h & f.h) ^ (~e.h & g.h);

			int64_right_rotate(r1, e, 14);
			int64_right_rotate(r2, e, 18);
			int64_right_rotate(r3, e, 41);
			gamma1.l = r1.l ^ r2.l ^ r3.l;
			gamma1.h = r1.h ^ r2.h ^ r3.h;
			int64_add5(T1, h, gamma1, Ch, K[n], w[n]);

			//计算T2
			int64_right_rotate(r1, a, 28);
			int64_right_rotate(r2, a, 34);
			int64_right_rotate(r3, a, 39);
			gamma0.l = r1.l ^ r2.l ^ r3.l;
			gamma0.h = r1.h ^ r2.h ^ r3.h;

			Maj.l = (a.l & b.l) ^ (a.l & c.l) ^ (b.l & c.l);
			Maj.h = (a.h & b.h) ^ (a.h & c.h) ^ (b.h & c.h);
			int64_add(T2, gamma0, Maj);

			int64_copy(h, g);
			int64_copy(g, f);
			int64_copy(f, e);
			int64_add(e, d, T1);
			int64_copy(d, c);
			int64_copy(c, b);
			int64_copy(b, a);
			int64_add(a, T1, T2);
		}

		int64_add(h0, h0, a);
		int64_add(h1, h1, b);
		int64_add(h2, h2, c);
		int64_add(h3, h3, d);
		int64_add(h4, h4, e);
		int64_add(h5, h5, f);
		int64_add(h6, h6, g);
		int64_add(h7, h7, h);
	}

	return hexOutput64([h0, h1, h2, h3, h4, h5]);
}

function sha512(input)
{
	var bytes = handleInputInt64(input);
	if(bytes == null){
		return "";
	}

	var K = [
		int64(0x428a2f98, 0xd728ae22), int64(0x71374491, 0x23ef65cd), int64(0xb5c0fbcf, 0xec4d3b2f), int64(0xe9b5dba5, 0x8189dbbc), 
		int64(0x3956c25b, 0xf348b538), int64(0x59f111f1, 0xb605d019), int64(0x923f82a4, 0xaf194f9b), int64(0xab1c5ed5, 0xda6d8118), 
		int64(0xd807aa98, 0xa3030242), int64(0x12835b01, 0x45706fbe), int64(0x243185be, 0x4ee4b28c), int64(0x550c7dc3, 0xd5ffb4e2), 
		int64(0x72be5d74, 0xf27b896f), int64(0x80deb1fe, 0x3b1696b1), int64(0x9bdc06a7, 0x25c71235), int64(0xc19bf174, 0xcf692694),
		int64(0xe49b69c1, 0x9ef14ad2), int64(0xefbe4786, 0x384f25e3), int64(0x0fc19dc6, 0x8b8cd5b5), int64(0x240ca1cc, 0x77ac9c65), 
		int64(0x2de92c6f, 0x592b0275), int64(0x4a7484aa, 0x6ea6e483), int64(0x5cb0a9dc, 0xbd41fbd4), int64(0x76f988da, 0x831153b5),
		int64(0x983e5152, 0xee66dfab), int64(0xa831c66d, 0x2db43210), int64(0xb00327c8, 0x98fb213f), int64(0xbf597fc7, 0xbeef0ee4), 
		int64(0xc6e00bf3, 0x3da88fc2), int64(0xd5a79147, 0x930aa725), int64(0x06ca6351, 0xe003826f), int64(0x14292967, 0x0a0e6e70),
		int64(0x27b70a85, 0x46d22ffc), int64(0x2e1b2138, 0x5c26c926), int64(0x4d2c6dfc, 0x5ac42aed), int64(0x53380d13, 0x9d95b3df), 
		int64(0x650a7354, 0x8baf63de), int64(0x766a0abb, 0x3c77b2a8), int64(0x81c2c92e, 0x47edaee6), int64(0x92722c85, 0x1482353b),
		int64(0xa2bfe8a1, 0x4cf10364), int64(0xa81a664b, 0xbc423001), int64(0xc24b8b70, 0xd0f89791), int64(0xc76c51a3, 0x0654be30), 
		int64(0xd192e819, 0xd6ef5218), int64(0xd6990624, 0x5565a910), int64(0xf40e3585, 0x5771202a), int64(0x106aa070, 0x32bbd1b8),
		int64(0x19a4c116, 0xb8d2d0c8), int64(0x1e376c08, 0x5141ab53), int64(0x2748774c, 0xdf8eeb99), int64(0x34b0bcb5, 0xe19b48a8), 
		int64(0x391c0cb3, 0xc5c95a63), int64(0x4ed8aa4a, 0xe3418acb), int64(0x5b9cca4f, 0x7763e373), int64(0x682e6ff3, 0xd6b2b8a3),
		int64(0x748f82ee, 0x5defb2fc), int64(0x78a5636f, 0x43172f60), int64(0x84c87814, 0xa1f0ab72), int64(0x8cc70208, 0x1a6439ec), 
		int64(0x90befffa, 0x23631e28), int64(0xa4506ceb, 0xde82bde9), int64(0xbef9a3f7, 0xb2c67915), int64(0xc67178f2, 0xe372532b),
		int64(0xca273ece, 0xea26619c), int64(0xd186b8c7, 0x21c0c207), int64(0xeada7dd6, 0xcde0eb1e), int64(0xf57d4f7f, 0xee6ed178), 
		int64(0x06f067aa, 0x72176fba), int64(0x0a637dc5, 0xa2c898a6), int64(0x113f9804, 0xbef90dae), int64(0x1b710b35, 0x131c471b),
		int64(0x28db77f5, 0x23047d84), int64(0x32caab7b, 0x40c72493), int64(0x3c9ebe0a, 0x15c9bebc), int64(0x431d67c4, 0x9c100d4c), 
		int64(0x4cc5d4be, 0xcb3e42b6), int64(0x597f299c, 0xfc657e2a), int64(0x5fcb6fab, 0x3ad6faec), int64(0x6c44198c, 0x4a475817)
	];

	var h0 = int64(0x6a09e667, 0xf3bcc908);
	var h1 = int64(0xbb67ae85, 0x84caa73b);
	var h2 = int64(0x3c6ef372, 0xfe94f82b);
	var h3 = int64(0xa54ff53a, 0x5f1d36f1);
	var h4 = int64(0x510e527f, 0xade682d1);
	var h5 = int64(0x9b05688c, 0x2b3e6c1f);
	var h6 = int64(0x1f83d9ab, 0xfb41bd6b);
	var h7 = int64(0x5be0cd19, 0x137e2179);

	var a  = int64(0, 0);
	var b  = int64(0, 0);
	var c  = int64(0, 0);
	var d  = int64(0, 0);
	var e  = int64(0, 0);
	var f  = int64(0, 0);
	var g  = int64(0, 0);
	var h  = int64(0, 0);

	var r1 = int64(0, 0);
	var r2 = int64(0, 0);
	var r3 = int64(0, 0);
	var s0 = int64(0, 0);
	var s1 = int64(0, 0);

	var Ch = int64(0, 0);
	var Maj= int64(0, 0);
	var T1 = int64(0, 0);
	var T2 = int64(0, 0);

	var gamma0 = int64(0, 0);
	var gamma1 = int64(0, 0);

	for(var i = 0; i < bytes.length; i = i + 128)
	{
		var w = group64(bytes, i, 80);
		for(var k = 16; k < 80; k++){
			w[k] = int64(0, 0);
			int64_right_rotate(r1, w[k - 2], 19);
			int64_right_rotate(r2, w[k - 2], 61);
			int64_right_shift(r3, w[k - 2], 6);
			s1.l = r1.l ^ r2.l ^ r3.l;
			s1.h = r1.h ^ r2.h ^ r3.h;

			int64_right_rotate(r1, w[k - 15], 1);
			int64_right_rotate(r2, w[k - 15], 8);
			int64_right_shift(r3, w[k - 15], 7);
			s0.l = r1.l ^ r2.l ^ r3.l;
			s0.h = r1.h ^ r2.h ^ r3.h;

			int64_add4(w[k], s1, w[k - 7], s0, w[k - 16]);
		}

		int64_copy(a, h0);
		int64_copy(b, h1);
		int64_copy(c, h2);
		int64_copy(d, h3);
		int64_copy(e, h4);
		int64_copy(f, h5);
		int64_copy(g, h6);
		int64_copy(h, h7);

		for(var n = 0; n < 80; n++){
			//计算T1
			Ch.l = (e.l & f.l) ^ (~e.l & g.l);
			Ch.h = (e.h & f.h) ^ (~e.h & g.h);

			int64_right_rotate(r1, e, 14);
			int64_right_rotate(r2, e, 18);
			int64_right_rotate(r3, e, 41);
			gamma1.l = r1.l ^ r2.l ^ r3.l;
			gamma1.h = r1.h ^ r2.h ^ r3.h;
			int64_add5(T1, h, gamma1, Ch, K[n], w[n]);

			//计算T2
			int64_right_rotate(r1, a, 28);
			int64_right_rotate(r2, a, 34);
			int64_right_rotate(r3, a, 39);
			gamma0.l = r1.l ^ r2.l ^ r3.l;
			gamma0.h = r1.h ^ r2.h ^ r3.h;

			Maj.l = (a.l & b.l) ^ (a.l & c.l) ^ (b.l & c.l);
			Maj.h = (a.h & b.h) ^ (a.h & c.h) ^ (b.h & c.h);
			int64_add(T2, gamma0, Maj);

			int64_copy(h, g);
			int64_copy(g, f);
			int64_copy(f, e);
			int64_add(e, d, T1);
			int64_copy(d, c);
			int64_copy(c, b);
			int64_copy(b, a);
			int64_add(a, T1, T2);
		}

		int64_add(h0, h0, a);
		int64_add(h1, h1, b);
		int64_add(h2, h2, c);
		int64_add(h3, h3, d);
		int64_add(h4, h4, e);
		int64_add(h5, h5, f);
		int64_add(h6, h6, g);
		int64_add(h7, h7, h);
	}

	return hexOutput64([h0,h1, h2, h3, h4, h5, h6, h7]);
}


function sha512_224(input)
{
	var bytes = handleInputInt64(input);
	if(bytes == null){
		return "";
	}

	var K = [
		int64(0x428a2f98, 0xd728ae22), int64(0x71374491, 0x23ef65cd), int64(0xb5c0fbcf, 0xec4d3b2f), int64(0xe9b5dba5, 0x8189dbbc), 
		int64(0x3956c25b, 0xf348b538), int64(0x59f111f1, 0xb605d019), int64(0x923f82a4, 0xaf194f9b), int64(0xab1c5ed5, 0xda6d8118), 
		int64(0xd807aa98, 0xa3030242), int64(0x12835b01, 0x45706fbe), int64(0x243185be, 0x4ee4b28c), int64(0x550c7dc3, 0xd5ffb4e2), 
		int64(0x72be5d74, 0xf27b896f), int64(0x80deb1fe, 0x3b1696b1), int64(0x9bdc06a7, 0x25c71235), int64(0xc19bf174, 0xcf692694),
		int64(0xe49b69c1, 0x9ef14ad2), int64(0xefbe4786, 0x384f25e3), int64(0x0fc19dc6, 0x8b8cd5b5), int64(0x240ca1cc, 0x77ac9c65), 
		int64(0x2de92c6f, 0x592b0275), int64(0x4a7484aa, 0x6ea6e483), int64(0x5cb0a9dc, 0xbd41fbd4), int64(0x76f988da, 0x831153b5),
		int64(0x983e5152, 0xee66dfab), int64(0xa831c66d, 0x2db43210), int64(0xb00327c8, 0x98fb213f), int64(0xbf597fc7, 0xbeef0ee4), 
		int64(0xc6e00bf3, 0x3da88fc2), int64(0xd5a79147, 0x930aa725), int64(0x06ca6351, 0xe003826f), int64(0x14292967, 0x0a0e6e70),
		int64(0x27b70a85, 0x46d22ffc), int64(0x2e1b2138, 0x5c26c926), int64(0x4d2c6dfc, 0x5ac42aed), int64(0x53380d13, 0x9d95b3df), 
		int64(0x650a7354, 0x8baf63de), int64(0x766a0abb, 0x3c77b2a8), int64(0x81c2c92e, 0x47edaee6), int64(0x92722c85, 0x1482353b),
		int64(0xa2bfe8a1, 0x4cf10364), int64(0xa81a664b, 0xbc423001), int64(0xc24b8b70, 0xd0f89791), int64(0xc76c51a3, 0x0654be30), 
		int64(0xd192e819, 0xd6ef5218), int64(0xd6990624, 0x5565a910), int64(0xf40e3585, 0x5771202a), int64(0x106aa070, 0x32bbd1b8),
		int64(0x19a4c116, 0xb8d2d0c8), int64(0x1e376c08, 0x5141ab53), int64(0x2748774c, 0xdf8eeb99), int64(0x34b0bcb5, 0xe19b48a8), 
		int64(0x391c0cb3, 0xc5c95a63), int64(0x4ed8aa4a, 0xe3418acb), int64(0x5b9cca4f, 0x7763e373), int64(0x682e6ff3, 0xd6b2b8a3),
		int64(0x748f82ee, 0x5defb2fc), int64(0x78a5636f, 0x43172f60), int64(0x84c87814, 0xa1f0ab72), int64(0x8cc70208, 0x1a6439ec), 
		int64(0x90befffa, 0x23631e28), int64(0xa4506ceb, 0xde82bde9), int64(0xbef9a3f7, 0xb2c67915), int64(0xc67178f2, 0xe372532b),
		int64(0xca273ece, 0xea26619c), int64(0xd186b8c7, 0x21c0c207), int64(0xeada7dd6, 0xcde0eb1e), int64(0xf57d4f7f, 0xee6ed178), 
		int64(0x06f067aa, 0x72176fba), int64(0x0a637dc5, 0xa2c898a6), int64(0x113f9804, 0xbef90dae), int64(0x1b710b35, 0x131c471b),
		int64(0x28db77f5, 0x23047d84), int64(0x32caab7b, 0x40c72493), int64(0x3c9ebe0a, 0x15c9bebc), int64(0x431d67c4, 0x9c100d4c), 
		int64(0x4cc5d4be, 0xcb3e42b6), int64(0x597f299c, 0xfc657e2a), int64(0x5fcb6fab, 0x3ad6faec), int64(0x6c44198c, 0x4a475817)
	];

	var h0 = int64(0x8C3D37C8, 0x19544DA2);
	var h1 = int64(0x73E19966, 0x89DCD4D6);
	var h2 = int64(0x1DFAB7AE, 0x32FF9C82);
	var h3 = int64(0x679DD514, 0x582F9FCF);
	var h4 = int64(0x0F6D2B69, 0x7BD44DA8);
	var h5 = int64(0x77E36F73, 0x04C48942);
	var h6 = int64(0x3F9D85A8, 0x6A1D36C8);
	var h7 = int64(0x1112E6AD, 0x91D692A1);

	var a  = int64(0, 0);
	var b  = int64(0, 0);
	var c  = int64(0, 0);
	var d  = int64(0, 0);
	var e  = int64(0, 0);
	var f  = int64(0, 0);
	var g  = int64(0, 0);
	var h  = int64(0, 0);

	var r1 = int64(0, 0);
	var r2 = int64(0, 0);
	var r3 = int64(0, 0);
	var s0 = int64(0, 0);
	var s1 = int64(0, 0);

	var Ch = int64(0, 0);
	var Maj= int64(0, 0);
	var T1 = int64(0, 0);
	var T2 = int64(0, 0);

	var gamma0 = int64(0, 0);
	var gamma1 = int64(0, 0);

	for(var i = 0; i < bytes.length; i = i + 128)
	{
		var w = group64(bytes, i, 80);
		for(var k = 16; k < 80; k++){
			w[k] = int64(0, 0);
			int64_right_rotate(r1, w[k - 2], 19);
			int64_right_rotate(r2, w[k - 2], 61);
			int64_right_shift(r3, w[k - 2], 6);
			s1.l = r1.l ^ r2.l ^ r3.l;
			s1.h = r1.h ^ r2.h ^ r3.h;

			int64_right_rotate(r1, w[k - 15], 1);
			int64_right_rotate(r2, w[k - 15], 8);
			int64_right_shift(r3, w[k - 15], 7);
			s0.l = r1.l ^ r2.l ^ r3.l;
			s0.h = r1.h ^ r2.h ^ r3.h;

			int64_add4(w[k], s1, w[k - 7], s0, w[k - 16]);
		}

		int64_copy(a, h0);
		int64_copy(b, h1);
		int64_copy(c, h2);
		int64_copy(d, h3);
		int64_copy(e, h4);
		int64_copy(f, h5);
		int64_copy(g, h6);
		int64_copy(h, h7);

		for(var n = 0; n < 80; n++){
			//计算T1
			Ch.l = (e.l & f.l) ^ (~e.l & g.l);
			Ch.h = (e.h & f.h) ^ (~e.h & g.h);

			int64_right_rotate(r1, e, 14);
			int64_right_rotate(r2, e, 18);
			int64_right_rotate(r3, e, 41);
			gamma1.l = r1.l ^ r2.l ^ r3.l;
			gamma1.h = r1.h ^ r2.h ^ r3.h;
			int64_add5(T1, h, gamma1, Ch, K[n], w[n]);

			//计算T2
			int64_right_rotate(r1, a, 28);
			int64_right_rotate(r2, a, 34);
			int64_right_rotate(r3, a, 39);
			gamma0.l = r1.l ^ r2.l ^ r3.l;
			gamma0.h = r1.h ^ r2.h ^ r3.h;

			Maj.l = (a.l & b.l) ^ (a.l & c.l) ^ (b.l & c.l);
			Maj.h = (a.h & b.h) ^ (a.h & c.h) ^ (b.h & c.h);
			int64_add(T2, gamma0, Maj);

			int64_copy(h, g);
			int64_copy(g, f);
			int64_copy(f, e);
			int64_add(e, d, T1);
			int64_copy(d, c);
			int64_copy(c, b);
			int64_copy(b, a);
			int64_add(a, T1, T2);
		}

		int64_add(h0, h0, a);
		int64_add(h1, h1, b);
		int64_add(h2, h2, c);
		int64_add(h3, h3, d);
		int64_add(h4, h4, e);
		int64_add(h5, h5, f);
		int64_add(h6, h6, g);
		int64_add(h7, h7, h);
	}

	return hexOutput([h0.h,h0.l,h1.h,h1.l,h2.h,h2.l,h3.h]);
}

function sha512_256(input)
{
	var bytes = handleInputInt64(input);
	if(bytes == null){
		return "";
	}

	var K = [
		int64(0x428a2f98, 0xd728ae22), int64(0x71374491, 0x23ef65cd), int64(0xb5c0fbcf, 0xec4d3b2f), int64(0xe9b5dba5, 0x8189dbbc), 
		int64(0x3956c25b, 0xf348b538), int64(0x59f111f1, 0xb605d019), int64(0x923f82a4, 0xaf194f9b), int64(0xab1c5ed5, 0xda6d8118), 
		int64(0xd807aa98, 0xa3030242), int64(0x12835b01, 0x45706fbe), int64(0x243185be, 0x4ee4b28c), int64(0x550c7dc3, 0xd5ffb4e2), 
		int64(0x72be5d74, 0xf27b896f), int64(0x80deb1fe, 0x3b1696b1), int64(0x9bdc06a7, 0x25c71235), int64(0xc19bf174, 0xcf692694),
		int64(0xe49b69c1, 0x9ef14ad2), int64(0xefbe4786, 0x384f25e3), int64(0x0fc19dc6, 0x8b8cd5b5), int64(0x240ca1cc, 0x77ac9c65), 
		int64(0x2de92c6f, 0x592b0275), int64(0x4a7484aa, 0x6ea6e483), int64(0x5cb0a9dc, 0xbd41fbd4), int64(0x76f988da, 0x831153b5),
		int64(0x983e5152, 0xee66dfab), int64(0xa831c66d, 0x2db43210), int64(0xb00327c8, 0x98fb213f), int64(0xbf597fc7, 0xbeef0ee4), 
		int64(0xc6e00bf3, 0x3da88fc2), int64(0xd5a79147, 0x930aa725), int64(0x06ca6351, 0xe003826f), int64(0x14292967, 0x0a0e6e70),
		int64(0x27b70a85, 0x46d22ffc), int64(0x2e1b2138, 0x5c26c926), int64(0x4d2c6dfc, 0x5ac42aed), int64(0x53380d13, 0x9d95b3df), 
		int64(0x650a7354, 0x8baf63de), int64(0x766a0abb, 0x3c77b2a8), int64(0x81c2c92e, 0x47edaee6), int64(0x92722c85, 0x1482353b),
		int64(0xa2bfe8a1, 0x4cf10364), int64(0xa81a664b, 0xbc423001), int64(0xc24b8b70, 0xd0f89791), int64(0xc76c51a3, 0x0654be30), 
		int64(0xd192e819, 0xd6ef5218), int64(0xd6990624, 0x5565a910), int64(0xf40e3585, 0x5771202a), int64(0x106aa070, 0x32bbd1b8),
		int64(0x19a4c116, 0xb8d2d0c8), int64(0x1e376c08, 0x5141ab53), int64(0x2748774c, 0xdf8eeb99), int64(0x34b0bcb5, 0xe19b48a8), 
		int64(0x391c0cb3, 0xc5c95a63), int64(0x4ed8aa4a, 0xe3418acb), int64(0x5b9cca4f, 0x7763e373), int64(0x682e6ff3, 0xd6b2b8a3),
		int64(0x748f82ee, 0x5defb2fc), int64(0x78a5636f, 0x43172f60), int64(0x84c87814, 0xa1f0ab72), int64(0x8cc70208, 0x1a6439ec), 
		int64(0x90befffa, 0x23631e28), int64(0xa4506ceb, 0xde82bde9), int64(0xbef9a3f7, 0xb2c67915), int64(0xc67178f2, 0xe372532b),
		int64(0xca273ece, 0xea26619c), int64(0xd186b8c7, 0x21c0c207), int64(0xeada7dd6, 0xcde0eb1e), int64(0xf57d4f7f, 0xee6ed178), 
		int64(0x06f067aa, 0x72176fba), int64(0x0a637dc5, 0xa2c898a6), int64(0x113f9804, 0xbef90dae), int64(0x1b710b35, 0x131c471b),
		int64(0x28db77f5, 0x23047d84), int64(0x32caab7b, 0x40c72493), int64(0x3c9ebe0a, 0x15c9bebc), int64(0x431d67c4, 0x9c100d4c), 
		int64(0x4cc5d4be, 0xcb3e42b6), int64(0x597f299c, 0xfc657e2a), int64(0x5fcb6fab, 0x3ad6faec), int64(0x6c44198c, 0x4a475817)
	];

	var h0 = int64(0x22312194, 0xFC2BF72C);
	var h1 = int64(0x9F555FA3, 0xC84C64C2);
	var h2 = int64(0x2393B86B, 0x6F53B151);
	var h3 = int64(0x96387719, 0x5940EABD);
	var h4 = int64(0x96283EE2, 0xA88EFFE3);
	var h5 = int64(0xBE5E1E25, 0x53863992);
	var h6 = int64(0x2B0199FC, 0x2C85B8AA);
	var h7 = int64(0x0EB72DDC, 0x81C52CA2); 

	var a  = int64(0, 0);
	var b  = int64(0, 0);
	var c  = int64(0, 0);
	var d  = int64(0, 0);
	var e  = int64(0, 0);
	var f  = int64(0, 0);
	var g  = int64(0, 0);
	var h  = int64(0, 0);

	var r1 = int64(0, 0);
	var r2 = int64(0, 0);
	var r3 = int64(0, 0);
	var s0 = int64(0, 0);
	var s1 = int64(0, 0);

	var Ch = int64(0, 0);
	var Maj= int64(0, 0);
	var T1 = int64(0, 0);
	var T2 = int64(0, 0);

	var gamma0 = int64(0, 0);
	var gamma1 = int64(0, 0);

	for(var i = 0; i < bytes.length; i = i + 128)
	{
		var w = group64(bytes, i, 80);
		for(var k = 16; k < 80; k++){
			w[k] = int64(0, 0);
			int64_right_rotate(r1, w[k - 2], 19);
			int64_right_rotate(r2, w[k - 2], 61);
			int64_right_shift(r3, w[k - 2], 6);
			s1.l = r1.l ^ r2.l ^ r3.l;
			s1.h = r1.h ^ r2.h ^ r3.h;

			int64_right_rotate(r1, w[k - 15], 1);
			int64_right_rotate(r2, w[k - 15], 8);
			int64_right_shift(r3, w[k - 15], 7);
			s0.l = r1.l ^ r2.l ^ r3.l;
			s0.h = r1.h ^ r2.h ^ r3.h;

			int64_add4(w[k], s1, w[k - 7], s0, w[k - 16]);
		}

		int64_copy(a, h0);
		int64_copy(b, h1);
		int64_copy(c, h2);
		int64_copy(d, h3);
		int64_copy(e, h4);
		int64_copy(f, h5);
		int64_copy(g, h6);
		int64_copy(h, h7);

		for(var n = 0; n < 80; n++){
			//计算T1
			Ch.l = (e.l & f.l) ^ (~e.l & g.l);
			Ch.h = (e.h & f.h) ^ (~e.h & g.h);

			int64_right_rotate(r1, e, 14);
			int64_right_rotate(r2, e, 18);
			int64_right_rotate(r3, e, 41);
			gamma1.l = r1.l ^ r2.l ^ r3.l;
			gamma1.h = r1.h ^ r2.h ^ r3.h;
			int64_add5(T1, h, gamma1, Ch, K[n], w[n]);

			//计算T2
			int64_right_rotate(r1, a, 28);
			int64_right_rotate(r2, a, 34);
			int64_right_rotate(r3, a, 39);
			gamma0.l = r1.l ^ r2.l ^ r3.l;
			gamma0.h = r1.h ^ r2.h ^ r3.h;

			Maj.l = (a.l & b.l) ^ (a.l & c.l) ^ (b.l & c.l);
			Maj.h = (a.h & b.h) ^ (a.h & c.h) ^ (b.h & c.h);
			int64_add(T2, gamma0, Maj);

			int64_copy(h, g);
			int64_copy(g, f);
			int64_copy(f, e);
			int64_add(e, d, T1);
			int64_copy(d, c);
			int64_copy(c, b);
			int64_copy(b, a);
			int64_add(a, T1, T2);
		}

		int64_add(h0, h0, a);
		int64_add(h1, h1, b);
		int64_add(h2, h2, c);
		int64_add(h3, h3, d);
		int64_add(h4, h4, e);
		int64_add(h5, h5, f);
		int64_add(h6, h6, g);
		int64_add(h7, h7, h);
	}

	return hexOutput64([h0, h1, h2, h3]);
}


var keccak_f = function(state)
{
	var RC = [
		int64(0x00000000, 0x00000001),int64(0x00000000, 0x00008082),
		int64(0x80000000, 0x0000808A),int64(0x80000000, 0x80008000),
		int64(0x00000000, 0x0000808B),int64(0x00000000, 0x80000001),
		int64(0x80000000, 0x80008081),int64(0x80000000, 0x00008009),
		int64(0x00000000, 0x0000008A),int64(0x00000000, 0x00000088),
		int64(0x00000000, 0x80008009),int64(0x00000000, 0x8000000A),
		int64(0x00000000, 0x8000808B),int64(0x80000000, 0x0000008B),
		int64(0x80000000, 0x00008089),int64(0x80000000, 0x00008003),
		int64(0x80000000, 0x00008002),int64(0x80000000, 0x00000080),
		int64(0x00000000, 0x0000800A),int64(0x80000000, 0x8000000A),
		int64(0x80000000, 0x80008081),int64(0x80000000, 0x00008080),
		int64(0x00000000, 0x80000001),int64(0x80000000, 0x80008008)
	];

	var ROUND_COUNT = 24;

	var x = 0;
	var y = 0;
	var h = 0;
	var l = 0;
	var tmp = int64(0, 0);

	for(var n = 0; n < ROUND_COUNT; n++){
		//Θ step
		var C = new Array(5);
		var D = new Array(5);
		for(x = 0; x < 5; x++){
			h = state[x][0].h ^ state[x][1].h ^ state[x][2].h ^ state[x][3].h ^  state[x][4].h;
			l = state[x][0].l ^ state[x][1].l ^ state[x][2].l ^ state[x][3].l ^  state[x][4].l;
			C[x] = int64(h, l);
		}
		for(x = 0; x < 5; x++){
			int64_left_rotate(tmp, C[ (x + 1) % 5], 1);
			h = C[(x + 4) % 5].h ^ tmp.h;
			l = C[(x + 4) % 5].l ^ tmp.l;
			D[x] = int64(h, l);
			for(y = 0; y < 5; y++){
				h = state[x][y].h ^ D[x].h;
				l = state[x][y].l ^ D[x].l;
				state[x][y].h = h;
				state[x][y].l = l;
			}
		}

		//ρ step and π step
		x = 1;
		y = 0;
		var current = int64(0, 0);
		int64_copy(current, state[x][y]);
		for(var t = 0; t < 24; t++){
			int64_left_rotate(tmp, current, Math.floor((t + 1) * (t + 2) / 2) % 64);
			var tX = x;
			x = y;
			y = (tX * 2 + y * 3) % 5;
			int64_copy(current, state[x][y]);
			int64_copy(state[x][y], tmp);
		}

		//χ step
		for(y = 0; y < 5; y++){
			for(x = 0; x < 5; x++){
				int64_copy(C[x], state[x][y]);
			}


			for(x = 0; x < 5; x++){
				h = state[x][y].h ^ (~C[(x + 1) % 5].h) & C[(x + 2) % 5].h;
				l = state[x][y].l ^ (~C[(x + 1) % 5].l) & C[(x + 2) % 5].l;
				state[x][y].h = h;
				state[x][y].l = l;
			}
		}

		//ι step
		state[0][0].h ^= RC[n].h;
		state[0][0].l ^= RC[n].l;
	}
}

var state_xor = function(state, index, val)
{
	var z = index % 8;
	var y = Math.floor(index / 40);
	var x = Math.floor(index / 8) % 5;
	var int64Value = state[x][y];
	var byteArray = int64Value.toByteArray();
	byteArray[z] ^= val;
	int64Value.fromByteArray(byteArray);
}

var state_to_byte_array = function(state)
{
	var arr = [];
	for(var y = 0; y < 5; y++){
		for(var x = 0; x < 5; x++){
			state[x][y].toGetByteArrayWithArray(arr)
		}
	}
	return arr;
}

var hexOutput_8_little_endian = function(arr)
{
	var output = new Array();
	for(var i = 0; i < arr.length; i++)
	{
		var n = arr[i];
		var s = hex_char[n >>> 4] + hex_char[n & 0x0F];
		output.push(s);
	}
	return output.join('');
}

var print_state = function(state)
{
	for(var x = 0; x < 5; x++){
		for(var y = 0; y < 5; y++){
			console.log("(" + x + "," + y + ")=", state[x][y].toString());
		}
	}
}

var keccak = function(input, c, pad)
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
		return;
	}

	var c  = c * 2;
	var r  = 1600 - c;
	var r_size = r / 8;
	var output_size = c / 2 / 8;

	var state = [
		[int64(0, 0),int64(0, 0),int64(0, 0),int64(0, 0),int64(0, 0)],
		[int64(0, 0),int64(0, 0),int64(0, 0),int64(0, 0),int64(0, 0)],
		[int64(0, 0),int64(0, 0),int64(0, 0),int64(0, 0),int64(0, 0)],
		[int64(0, 0),int64(0, 0),int64(0, 0),int64(0, 0),int64(0, 0)],
		[int64(0, 0),int64(0, 0),int64(0, 0),int64(0, 0),int64(0, 0)]
	]

	var pt = 0;
	for(var i = 0; i < bytes.length; i++){
		state_xor(state, pt, bytes[i]);
		pt += 1;
		if(pt == r_size){
			keccak_f(state);
			pt = 0;
		}
	}

	state_xor(state, pt, pad);
	state_xor(state, r_size - 1, 0x80);
	keccak_f(state);
	//print_state(state);

	var byteArray = state_to_byte_array(state);
	var outputArray = byteArray.slice(0, output_size);

	return hexOutput_8_little_endian(outputArray);
}

function sha3_224(input)
{
	return keccak(input, 224, 0x06);
}

function sha3_256(input)
{
	return keccak(input, 256, 0x06);
}

function sha3_384(input)
{
	return keccak(input, 384, 0x06);
}

function sha3_512(input)
{
	return keccak(input, 512, 0x06);
}