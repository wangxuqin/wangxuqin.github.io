---
layout: page
title:  "常用色彩模型转换算法"
date:   2015-06-03 10:10
categories: common
---

**色彩模型**  
颜色的描述是通过建立了色彩模型来实现的，不同的色彩模型对应于不同的处理目的。

CIE(国际照明委员会)在进行大量的色彩测试实验的基础上提出了一些列的颜色模型：
(1)RGB模型：红(R)、绿(G)、蓝(B)三基色混合
(2)HSI模型：色度(H)、饱和度(S)、亮度(I)
(3)YUV模型：亮度(Y)、色度(UV)
(4)YCbCr模型：亮度(Y)、色度(CbCr)
...
各种不同的颜色模型之间可以通过数学方法转换。

**RGB->HSL**

```javascript
var_R = ( R / 255 )                     //RGB from 0 to 255
var_G = ( G / 255 )
var_B = ( B / 255 )

var_Min = min( var_R, var_G, var_B )    //Min. value of RGB
var_Max = max( var_R, var_G, var_B )    //Max. value of RGB
del_Max = var_Max - var_Min             //Delta RGB value

L = ( var_Max + var_Min ) / 2

if ( del_Max == 0 )                     //This is a gray, no chroma...
{
   H = 0                                //HSL results from 0 to 1
   S = 0
}
else                                    //Chromatic data...
{
   if ( L < 0.5 ) S = del_Max / ( var_Max + var_Min )
   else           S = del_Max / ( 2 - var_Max - var_Min )

   del_R = ( ( ( var_Max - var_R ) / 6 ) + ( del_Max / 2 ) ) / del_Max
   del_G = ( ( ( var_Max - var_G ) / 6 ) + ( del_Max / 2 ) ) / del_Max
   del_B = ( ( ( var_Max - var_B ) / 6 ) + ( del_Max / 2 ) ) / del_Max

   if      ( var_R == var_Max ) H = del_B - del_G
   else if ( var_G == var_Max ) H = ( 1 / 3 ) + del_R - del_B
   else if ( var_B == var_Max ) H = ( 2 / 3 ) + del_G - del_R

   if ( H < 0 ) H += 1
   if ( H > 1 ) H -= 1
}
```

**RGB<-HSL**

```javascript
if ( S == 0 )                       //HSL from 0 to 1
{
   R = L * 255                      //RGB results from 0 to 255
   G = L * 255
   B = L * 255
}
else
{
   if ( L < 0.5 ) var_2 = L * ( 1 + S )
   else           var_2 = ( L + S ) - ( S * L )

   var_1 = 2 * L - var_2

   R = 255 * Hue_2_RGB( var_1, var_2, H + ( 1 / 3 ) ) 
   G = 255 * Hue_2_RGB( var_1, var_2, H )
   B = 255 * Hue_2_RGB( var_1, var_2, H - ( 1 / 3 ) )
}

Hue_2_RGB( v1, v2, vH )             //Function Hue_2_RGB
{
   if ( vH < 0 ) vH += 1
   if ( vH > 1 ) vH -= 1
   if ( ( 6 * vH ) < 1 ) return ( v1 + ( v2 - v1 ) * 6 * vH )
   if ( ( 2 * vH ) < 1 ) return ( v2 )
   if ( ( 3 * vH ) < 2 ) return ( v1 + ( v2 - v1 ) * ( ( 2 / 3 ) - vH ) * 6 )
   return ( v1 )
}
```

**RGB->HSV**  

```javascript
var_R = ( R / 255 )                     //RGB from 0 to 255
var_G = ( G / 255 )
var_B = ( B / 255 )

var_Min = min( var_R, var_G, var_B )    //Min. value of RGB
var_Max = max( var_R, var_G, var_B )    //Max. value of RGB
del_Max = var_Max - var_Min             //Delta RGB value 

V = var_Max

if ( del_Max == 0 )                     //This is a gray, no chroma...
{
   H = 0                                //HSV results from 0 to 1
   S = 0
}
else                                    //Chromatic data...
{
   S = del_Max / var_Max

   del_R = ( ( ( var_Max - var_R ) / 6 ) + ( del_Max / 2 ) ) / del_Max
   del_G = ( ( ( var_Max - var_G ) / 6 ) + ( del_Max / 2 ) ) / del_Max
   del_B = ( ( ( var_Max - var_B ) / 6 ) + ( del_Max / 2 ) ) / del_Max

   if      ( var_R == var_Max ) H = del_B - del_G
   else if ( var_G == var_Max ) H = ( 1 / 3 ) + del_R - del_B
   else if ( var_B == var_Max ) H = ( 2 / 3 ) + del_G - del_R

   if ( H < 0 ) H += 1
   if ( H > 1 ) H -= 1
}
```

**HSV->RGB**  

```javascript
if ( S == 0 )                       //HSV from 0 to 1
{
   R = V * 255
   G = V * 255
   B = V * 255
}
else
{
   var_h = H * 6
   if ( var_h == 6 ) var_h = 0      //H must be < 1
   var_i = int( var_h )             //Or ... var_i = floor( var_h )
   var_1 = V * ( 1 - S )
   var_2 = V * ( 1 - S * ( var_h - var_i ) )
   var_3 = V * ( 1 - S * ( 1 - ( var_h - var_i ) ) )

   if      ( var_i == 0 ) { var_r = V     ; var_g = var_3 ; var_b = var_1 }
   else if ( var_i == 1 ) { var_r = var_2 ; var_g = V     ; var_b = var_1 }
   else if ( var_i == 2 ) { var_r = var_1 ; var_g = V     ; var_b = var_3 }
   else if ( var_i == 3 ) { var_r = var_1 ; var_g = var_2 ; var_b = V     }
   else if ( var_i == 4 ) { var_r = var_3 ; var_g = var_1 ; var_b = V     }
   else                   { var_r = V     ; var_g = var_1 ; var_b = var_2 }

   R = var_r * 255                  //RGB results from 0 to 255
   G = var_g * 255
   B = var_b * 255
}
```

**RGB->XYZ**

```javascript
var_R = ( R / 255 )        //R from 0 to 255
var_G = ( G / 255 )        //G from 0 to 255
var_B = ( B / 255 )        //B from 0 to 255

if ( var_R > 0.04045 ) var_R = ( ( var_R + 0.055 ) / 1.055 ) ^ 2.4
else                   var_R = var_R / 12.92
if ( var_G > 0.04045 ) var_G = ( ( var_G + 0.055 ) / 1.055 ) ^ 2.4
else                   var_G = var_G / 12.92
if ( var_B > 0.04045 ) var_B = ( ( var_B + 0.055 ) / 1.055 ) ^ 2.4
else                   var_B = var_B / 12.92

var_R = var_R * 100
var_G = var_G * 100
var_B = var_B * 100

//Observer. = 2°, Illuminant = D65
X = var_R * 0.4124 + var_G * 0.3576 + var_B * 0.1805
Y = var_R * 0.2126 + var_G * 0.7152 + var_B * 0.0722
Z = var_R * 0.0193 + var_G * 0.1192 + var_B * 0.9505
```

**RGB<-XYZ**

```javascript
var_X = X / 100        //X from 0 to  95.047      (Observer = 2°, Illuminant = D65)
var_Y = Y / 100        //Y from 0 to 100.000
var_Z = Z / 100        //Z from 0 to 108.883

var_R = var_X *  3.2406 + var_Y * -1.5372 + var_Z * -0.4986
var_G = var_X * -0.9689 + var_Y *  1.8758 + var_Z *  0.0415
var_B = var_X *  0.0557 + var_Y * -0.2040 + var_Z *  1.0570

if ( var_R > 0.0031308 ) var_R = 1.055 * ( var_R ^ ( 1 / 2.4 ) ) - 0.055
else                     var_R = 12.92 * var_R
if ( var_G > 0.0031308 ) var_G = 1.055 * ( var_G ^ ( 1 / 2.4 ) ) - 0.055
else                     var_G = 12.92 * var_G
if ( var_B > 0.0031308 ) var_B = 1.055 * ( var_B ^ ( 1 / 2.4 ) ) - 0.055
else                     var_B = 12.92 * var_B

R = var_R * 255
G = var_G * 255
B = var_B * 255
```

**RGB->CMY**

```javascript
//RGB values from 0 to 255
//CMY results from 0 to 1

C = 1 - ( R / 255 )
M = 1 - ( G / 255 )
Y = 1 - ( B / 255 )
```

**RGB<-CMY**

```javascript
//CMY values from 0 to 1
//RGB results from 0 to 255

R = ( 1 - C ) * 255
G = ( 1 - M ) * 255
B = ( 1 - Y ) * 255
```

更多公式：http://www.easyrgb.com/index.php?X=MATH