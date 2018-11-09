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

var mask1 = [128, 64, 32, 16, 8, 4, 2, 1]

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

var leftRotate = function(array, n)
{
	for(var i = 0; i < n; i++){
		var first = array.shift();
		array.push(first);
	}
}

var generateKey = function(inputKeys)
{
	var keys = Array(56);
	for(var i = 0; i < 56; i++){
		var idx = pc1[i];
		//console.log(idx, Math.floor(idx / 8), idx % 8, inputKeys[Math.floor(idx / 8)], inputKeys[Math.floor(idx / 8)] & mask1[(idx - 1) % 8]);
		var cur = (inputKeys[Math.floor(idx / 8)] & mask1[idx - Math.floor(idx / 8) * 8] > 0) ? 1 : 0;
		keys[i] = cur;
	}

	console.log(keys);

	var lParts = keys.slice(0, 28);
	var rParts = keys.slice(28, 56);
	var outputKeys = Array(16);
	for(var i = 0; i < 16; i++){
		var k = [0, 0, 0, 0, 0, 0, 0, 0]
		leftRotate(lParts, leftRotateTable[i]);
		leftRotate(rParts, leftRotateTable[i]);
		for(var n = 0; n < 48; n++){
			var idx1 = Math.floor(n / 6);
			var idx2 = pc2[n];
			var cur = (idx2 < 28) ? lParts[idx2] : rParts[idx2 - 28];
			k[idx1] = k[idx1] << 1 | cur;
		}
		outputKeys[i] = k;
	}
	return outputKeys;
}

generateKey([0b00010011, 0b00110100, 0b01010111, 0b01111001, 0b10011011, 0b10111100, 0b11011111, 0b11110001]);
//console.log(generateKey([0b00010011, 0b00110100, 0b01010111, 0b01111001, 0b10011011, 0b10111100, 0b11011111, 0b11110001]));