---
layout: post
title:  "使用 FileReference 类（转）"
date:   2015-05-08 16:04
categories: AS3
---

###1.FileReferenceList 类
FileReference 对象表示客户端或服务器计算机上的数据文件。  
通过 FileReference 类的方法可使应用程序本地加载和保存数据文件，以及与远程服务器之间传输文件数据。  
FileReference 类为加载、传输和保存数据文件提供了两种不同的方法。  

自从引入 FileReference 类，该类就包括 browse() 方法、upload() 方法和 download() 方法。  
使用 browse() 方法使用户可以选择文件。  
使用 upload() 方法可以将文件数据传输到远程服务器。  
使用 download() 方法可以从服务器检索数据并将其保存在本地文件中。  

从 Flash Player 10 和 Adobe AIR 1.5 开始，FileReference 类包括 load() 和 save() 方法。  
load() 和 save() 这两种方法允许您直接访问和保存本地文件。  
这些方法的用法类似于 URLLoader 和 Loader 类中的同名方法。  

注： File 类（用于扩展 FileReference 类）和 FileStream 类提供了其他的函数用以使用文件和本地文件系统。仅 AIR 支持 File 和 FileStream 类，而 Flash Player 不支持这两个类。
Adobe 推荐的资源


###2.载入和保存本地文件

每个 FileReference 对象都代表本地计算机上的一个数据文件。FileReference 类的属性包含有关文件大小、类型、名称、文件扩展名、创建者、创建日期和修改日期的信息。

注： 仅 Mac OS 支持 creator 属性。所有其他平台都会返回 null。
注： 仅 Adobe AIR 支持 extension 属性。
可以通过以下两种方式之一创建 FileReference 类的实例：

使用 new 运算符，如下面的代码所示：

```AS3
import flash.net.FileReference; 
var fileRef:FileReference = new FileReference();
```

调用 FileReferenceList.browse() 方法，该方法将打开一个对话框，提示用户选择一个或多个要上载的文件。如果用户成功选择了一个或多个文件，则创建一个 FileReference 对象数组。

在创建完 FileReference 对象后，您便可以进行以下操作：

1)调用 FileReference.browse() 方法: 该方法将打开一个对话框，提示用户从本地文件系统中选择一个文件。这种情况通常在后续调用 FileReference.upload() 方法或 FileReference.load() 方法之前执行。  
2)调用 FileReference.upload() 方法: 可将文件上载到远程服务器。  
3)调用 FileReference.load() 方法: 可以打开本地文件。  
4)调用 FileReference.download() 方法: download() 方法将打开一个对话框，让用户选择用于保存新文件的位置。然后从服务器下载数据，并将数据存储在新文件中。  
5)调用 FileReference.load() 方法 : 此方法使用 browse() 方法开始从之前所选的文件中加载数据。直到 browse() 操作完成（用户选择了文件）时，才能调用 load() 方法。  
6)调用 FileReference.save() 方法 : 此方法将打开一个对话框，提示用户在本地文件系统上选择一个文件位置。然后此方法将数据保存到该指定位置。  

**注： 一次只能执行一个 browse()、download() 或 save() 操作，因为在任何时刻都只能打开一个对话框。**

除非发生以下情况之一，否则不会定义 FileReference 对象属性（如 name、size 或 modificationDate）:  
1)已调用 FileReference.browse() 方法或 FileReferenceList.browse() 方法，并且用户已经使用对话框选择了文件。
2)已调用 FileReference.download() 方法，并且用户已经使用对话框指定了新的文件位置。

注： 当执行下载时，在下载完成前只填充 FileReference.name 属性。下载完文件后，所有属性都将可用。
在执行对 FileReference.browse()、FileReferenceList.browse()、FileReference.download()、FileReference.load() 或 FileReference.save() 方法的调用时，大多数播放器将继续播放 SWF 文件，其中包括调度事件和执行代码。

对于上载和下载操作，SWF 文件只能访问自己的域（包括由策略文件指定的任何域）内的文件。如果包含文件的服务器与启动上载或下载的 SWF 文件不在同一个域中，则需要在该服务器上放置策略文件。



###3.从文件加载数据

使用 FileReference.load() 方法可以将数据从本地文件加载到内存中。  

<b>
注： 代码必须先调用 FileReference.browse() 方法，让用户选择要加载的文件。
此限制不适用于在应用程序安全沙箱的 Adobe AIR 中运行的内容。
调用 FileReference.load() 方法后，该方法立即就会返回，但并不能立即得到所加载的数据。  
FileReference 对象在加载过程的每个步骤中都会调度事件以调用侦听器方法。
</b>

FileReference 对象在加载过程中将调度以下事件。
1)open 事件 (Event.OPEN)：在加载操作开始时调度。  
2)progress 事件 (ProgressEvent.PROGRESS)：以字节为单位从文件读取数据时定期调度。  
3)complete 事件 (Event.COMPLETE)：加载操作成功完成时调度。  
4)ioError 事件 (IOErrorEvent.IO_ERROR)：如果由于在打开文件或从文件读取数据时发生输入/输出错误而使加载过程失败，则调度此事件。  

FileReference 对象调度 complete 事件后，即可将所加载的数据作为 FileReference 对象的 data 属性中的 ByteArray 进行访问。

下面的示例演示如何提示用户选择一个文件，然后从该文件将数据加载到内存中：

```AS3
package 
{ 
    import flash.display.Sprite; 
    import flash.events.*;  
    import flash.net.FileFilter; 
    import flash.net.FileReference; 
    import flash.net.URLRequest; 
    import flash.utils.ByteArray; 
 
    public class FileReferenceExample1 extends Sprite 
    { 
        private var fileRef:FileReference; 
        public function FileReferenceExample1() 
        { 
            fileRef = new FileReference(); 
            fileRef.addEventListener(Event.SELECT, onFileSelected); 
            fileRef.addEventListener(Event.CANCEL, onCancel); 
            fileRef.addEventListener(IOErrorEvent.IO_ERROR, onIOError); 
            fileRef.addEventListener(SecurityErrorEvent.SECURITY_ERROR, 
                        onSecurityError); 
            var textTypeFilter:FileFilter = new FileFilter("Text Files (*.txt, *.rtf)", 
                        "*.txt;*.rtf"); 
            fileRef.browse([textTypeFilter]); 
        } 
        public function onFileSelected(evt:Event):void 
        { 
            fileRef.addEventListener(ProgressEvent.PROGRESS, onProgress); 
            fileRef.addEventListener(Event.COMPLETE, onComplete); 
            fileRef.load(); 
        } 
 
        public function onProgress(evt:ProgressEvent):void 
        { 
            trace("Loaded " + evt.bytesLoaded + " of " + evt.bytesTotal + " bytes."); 
        } 
 
        public function onComplete(evt:Event):void 
        { 
            trace("File was successfully loaded."); 
            trace(fileRef.data); 
        } 
 
        public function onCancel(evt:Event):void 
        { 
            trace("The browse request was canceled by the user."); 
        } 
 
        public function onIOError(evt:IOErrorEvent):void 
        { 
            trace("There was an IO Error."); 
        } 
        public function onSecurityError(evt:Event):void 
        { 
            trace("There was a security error."); 
        } 
    } 
}

```

step1: 示例代码首先创建名为 fileRef 的 FileReference 对象，然后调用其 browse() 方法。  
step2: browse() 方法将打开一个对话框，提示用户选择文件。  
step3: 选择文件后，代码会调用 onFileSelected() 方法。  
step4: 此方法添加针对 progress 和 complete 事件的侦听器，然后调用 FileReference 对象的 load() 方法。  
step5: 示例中的其他处理函数方法只是输出消息以报告加载操作的进度。  
step6: 加载完成后，应用程序会使用 trace() 方法显示所加载文件的内容。  

在 Adobe AIR 中，FileStream 类提供了读取本地文件中的数据的附加功能。请参阅读取和写入文件。

###4.将数据保存到本地文件

使用 FileReference.save() 方法可以将数据保存到本地文件。
该方法在开始时会打开一个对话框，让用户输入新文件名以及用于保存文件的位置。
在用户选择文件名和位置后，数据会写入到新文件中。
在成功保存文件之后，将使用本地文件的属性填充 FileReference 对象的属性。

注： 只有在响应用户启动的事件（如鼠标单击或按键事件）时，您的代码才会调用 FileReference.save() 方法。否则将引发错误。此限制不适用于在应用程序安全沙箱的 Adobe AIR 中运行的内容。
调用 FileReference.save() 方法之后，该方法会立即返回。FileReference 对象随后在文件保存过程的每个步骤中调度事件以调用侦听器方法。

FileReference 对象在文件保存过程中可以调度以下事件:  
1)select 事件 (Event.SELECT)：在用户为要保存的新文件指定位置和文件名时调度。  
2)cancel 事件 (Event.CANCEL)：在用户单击对话框中的“取消”按钮时调度。   
3)open 事件 (Event.OPEN)：在保存操作开始时调度。   
4)progress 事件 (ProgressEvent.PROGRESS)：以字节为单位向文件  保存数据时定期调度。   
5)complete 事件 (Event.COMPLETE)：保存操作成功完成时调度。 
6)ioError 事件 (IOErrorEvent.IO_ERROR)：如果由于尝试向文件保存数据时发生输入/输出错误而使保存过程失败，则调度此事件。   

FileReference.save() 方法的 data 参数中传递的对象类型决定着向文件写入数据的方式：
1)如果是字符串值，则使用 UTF-8 编码将其另存为文本文件。 
2)如果是 XML 对象，则以 XML 格式将其写入到文件，并保留所有格式设置。 
3)如果是 ByteArray 对象，则将其内容直接写入文件，不经过转换。 
4)如果是其他某些对象，则 FileReference.save() 方法调用该对象的 toString() 方法，然后将生成的字符串值保存到 UTF-8 文本文件中。如果无法调用该对象的 toString() 方法，则会引发错误。 


如果 data 参数的值为 null，则会引发错误。 
下面的代码扩展了前面针对 FileReference.load() 方法的示例。从文件中读取数据后，此示例将提示用户提供文件名，然后将数据保存到新文件中：

```AS3
package 
{ 
    import flash.display.Sprite; 
    import flash.events.*;  
    import flash.net.FileFilter; 
    import flash.net.FileReference; 
    import flash.net.URLRequest; 
    import flash.utils.ByteArray; 
 
    public class FileReferenceExample2 extends Sprite 
    { 
        private var fileRef:FileReference; 
        public function FileReferenceExample2() 
        { 
            fileRef = new FileReference(); 
            fileRef.addEventListener(Event.SELECT, onFileSelected); 
            fileRef.addEventListener(Event.CANCEL, onCancel); 
            fileRef.addEventListener(IOErrorEvent.IO_ERROR, onIOError); 
            fileRef.addEventListener(SecurityErrorEvent.SECURITY_ERROR, 
                        onSecurityError); 
            var textTypeFilter:FileFilter = new FileFilter("Text Files (*.txt, *.rtf)", 
                        "*.txt;*.rtf"); 
            fileRef.browse([textTypeFilter]); 
        } 
        public function onFileSelected(evt:Event):void 
        { 
            fileRef.addEventListener(ProgressEvent.PROGRESS, onProgress); 
            fileRef.addEventListener(Event.COMPLETE, onComplete); 
            fileRef.load(); 
        } 
 
        public function onProgress(evt:ProgressEvent):void 
        { 
            trace("Loaded " + evt.bytesLoaded + " of " + evt.bytesTotal + " bytes."); 
        } 
        public function onCancel(evt:Event):void 
        { 
            trace("The browse request was canceled by the user."); 
        } 
        public function onComplete(evt:Event):void 
        { 
            trace("File was successfully loaded."); 
            fileRef.removeEventListener(Event.SELECT, onFileSelected); 
            fileRef.removeEventListener(ProgressEvent.PROGRESS, onProgress); 
            fileRef.removeEventListener(Event.COMPLETE, onComplete); 
            fileRef.removeEventListener(Event.CANCEL, onCancel); 
            saveFile(); 
        } 
        public function saveFile():void 
        { 
            fileRef.addEventListener(Event.SELECT, onSaveFileSelected); 
            fileRef.save(fileRef.data,"NewFileName.txt"); 
        } 
 
        public function onSaveFileSelected(evt:Event):void 
        { 
            fileRef.addEventListener(ProgressEvent.PROGRESS, onSaveProgress); 
            fileRef.addEventListener(Event.COMPLETE, onSaveComplete); 
            fileRef.addEventListener(Event.CANCEL, onSaveCancel); 
        } 
 
        public function onSaveProgress(evt:ProgressEvent):void 
        { 
            trace("Saved " + evt.bytesLoaded + " of " + evt.bytesTotal + " bytes."); 
        } 
         
        public function onSaveComplete(evt:Event):void 
        { 
            trace("File saved."); 
            fileRef.removeEventListener(Event.SELECT, onSaveFileSelected); 
            fileRef.removeEventListener(ProgressEvent.PROGRESS, onSaveProgress); 
            fileRef.removeEventListener(Event.COMPLETE, onSaveComplete); 
            fileRef.removeEventListener(Event.CANCEL, onSaveCancel); 
        } 
 
        public function onSaveCancel(evt:Event):void 
        { 
            trace("The save request was canceled by the user."); 
        } 
 
        public function onIOError(evt:IOErrorEvent):void 
        { 
            trace("There was an IO Error."); 
        } 
        public function onSecurityError(evt:Event):void 
        { 
            trace("There was a security error."); 
        } 
    } 
}
```

从文件加载所有数据后，代码将调用 onComplete() 方法。 
onComplete() 方法删除针对加载事件的侦听器，然后调用 saveFile() 方法。 
saveFile() 方法调用 FileReference.save() 方法。 
FileReference.save() 方法会打开一个新对话框，让用户输入新文件名和用于保存文件的位置。 
其余事件侦听器方法在文件保存过程完成之前跟踪该过程的进度。 

在 Adobe AIR 中，FileStream 类提供了将数据写入本地文件的附加功能。请参阅读取和写入文件。 

###5.将文件上载至服务器

要将文件上载到服务器，需要首先调用 browse() 方法，以允许用户选择一个或多个文件。
接下来，当调用 FileReference.upload() 方法时，将所选文件传输到服务器。
如果用户使用 FileReferenceList.browse() 方法选择了多个文件，则 Flash Player 会创建所选文件的数组，称为 FileReferenceList.fileList。
随后便可使用 FileReference.upload() 方法分别上载每个文件。

<b>
注： 使用 FileReference.browse() 方法时，您只能上载单个文件。
要允许用户上载多个文件，请使用 FileReferenceList.browse() 方法。
默认情况下，系统文件选取器对话框允许用户从本地计算机选取任何文件类型。
开发人员可以通过使用 FileFilter 类并将文件过滤器实例数组传递给 browse() 方法来指定一个或多个自定义文件类型过滤器：
</b>

```AS3
var imageTypes:FileFilter = new FileFilter("Images (*.jpg, *.jpeg, *.gif, *.png)", "*.jpg; *.jpeg; *.gif; *.png"); 
var textTypes:FileFilter = new FileFilter("Text Files (*.txt, *.rtf)", "*.txt; *.rtf"); 
var allTypes:Array = new Array(imageTypes, textTypes); 
var fileRef:FileReference = new FileReference(); 
fileRef.browse(allTypes);
```

用户在系统文件选取器中选择文件并单击“打开”按钮后，会调度 Event.SELECT 事件。
如果使用 FileReference.browse() 方法选择要上载的文件，下列代码会将文件发送到 Web 服务器：

```AS3
var fileRef:FileReference = new FileReference(); 
fileRef.addEventListener(Event.SELECT, selectHandler); 
fileRef.addEventListener(Event.COMPLETE, completeHandler); 
try 
{ 
    var success:Boolean = fileRef.browse(); 
} 
catch (error:Error) 
{ 
    trace("Unable to browse for files."); 
} 
function selectHandler(event:Event):void 
{ 
    var request:URLRequest = new URLRequest("http://www.[yourdomain].com/fileUploadScript.cfm") 
    try 
    { 
        fileRef.upload(request); 
    } 
    catch (error:Error) 
    { 
        trace("Unable to upload file."); 
    } 
} 
function completeHandler(event:Event):void 
{ 
    trace("uploaded"); 
}
```

通过使用 URLRequest.method 和 URLRequest.data 属性以 POST 或 GET 方法发送变量，可以用 FileReference.upload() 方法将数据发送到服务器。
尝试使用 FileReference.upload() 方法上载文件时，将调度以下事件： 
1)open 事件 (Event.OPEN)：在上载操作开始时调度。 
2)progress 事件 (ProgressEvent.PROGRESS)：以字节为单位上载文件中的数据时定期调度。 
3)complete 事件 (Event.COMPLETE)：上载操作成功完成时调度。  
4)httpStatus 事件 (HTTPStatusEvent.HTTP_STATUS)：上载过程因 HTTP 错误而失败时调度。  
5)httpResponseStatus 事件 (HTTPStatusEvent.HTTP_RESPONSE_STATUS)：如果调用 upload() 或 uploadUnencoded() 方法时尝试通过 HTTP 访问数据，并且 Adobe AIR 可以检测并返回请求的状态代码，则调度此事件。 
6)securityError 事件 (SecurityErrorEvent.SECURITY_ERROR)：上载操作因违反安全规则而失败时调度。  
7)uploadCompleteData 事件 (DataEvent.UPLOAD_COMPLETE_DATA)：成功上载并从服务器接收数据之后调度。  
8)ioError 事件 (IOErrorEvent.IO_ERROR)：由于下列任何原因导致上载过程失败时调度:  
  (8.1)当 Flash Player 正在读取、写入或传输文件时发生输入/输出错误。
  (8.2)SWF 尝试将文件上载到要求身份验证（如用户名和密码）的服务器。
  (8.3)在上载期间，Flash Player 不提供用户用于输入密码的方法。
  (8.4)url 参数包含无效协议。FileReference.upload() 方法必须使用 HTTP 或 HTTPS。

Flash Player 不对需要身份验证的服务器提供完全支持。
只有使用浏览器插件或 Microsoft ActiveX® 控件在浏览器中运行的 SWF 文件才可以提供一个对话框，来提示用户输入用户名和密码以进行身份验证，并且仅用于下载操作。对于使用插件或 ActiveX 控件进行的上载操作，或者使用独立或外部播放器进行的上载/下载操作，文件传输会失败。
若要以 ColdFusion 创建服务器脚本以接受来自 Flash Player 的文件上载，可以使用类似于以下内容的代码：

```XML
<cffile action="upload" filefield="Filedata" destination="#ExpandPath('./')#" nameconflict="OVERWRITE" />
```

此 ColdFusion 代码上载 Flash Player 发送的文件，并将其保存到 ColdFusion 模板所在的目录中以覆盖具有相同名称的任何文件。
上面的代码显示接受文件上载所需的最低代码量；不应在生产环境中使用此脚本。
理想情况下，添加数据验证可以确保用户仅上载接受的文件类型（例如图像），而不是上载可能危险的服务器端脚本。

下面的代码使用 PHP 说明文件上载，并且包含数据验证。该脚本将上载目录中的上载文件数限制为 10，确保文件小于 200 KB，并且只允许 JPEG、GIF 或 PNG 文件上载和保存到文件系统。

```PHP
<?php 
$MAXIMUM_FILESIZE = 1024 * 200; // 200KB 
$MAXIMUM_FILE_COUNT = 10; // keep maximum 10 files on server 
echo exif_imagetype($_FILES['Filedata']); 
if ($_FILES['Filedata']['size'] <= $MAXIMUM_FILESIZE) 
{ 
    move_uploaded_file($_FILES['Filedata']['tmp_name'], "./temporary/".$_FILES['Filedata']['name']); 
    $type = exif_imagetype("./temporary/".$_FILES['Filedata']['name']); 
    if ($type == 1 || $type == 2 || $type == 3) 
    { 
        rename("./temporary/".$_FILES['Filedata']['name'], "./images/".$_FILES['Filedata']['name']); 
    } 
    else 
    { 
        unlink("./temporary/".$_FILES['Filedata']['name']); 
    } 
} 
$directory = opendir('./images/'); 
$files = array(); 
while ($file = readdir($directory)) 
{ 
    array_push($files, array('./images/'.$file, filectime('./images/'.$file))); 
} 
usort($files, sorter); 
if (count($files) > $MAXIMUM_FILE_COUNT) 
{ 
    $files_to_delete = array_splice($files, 0, count($files) - $MAXIMUM_FILE_COUNT); 
    for ($i = 0; $i < count($files_to_delete); $i++) 
    { 
        unlink($files_to_delete[$i][0]); 
    } 
} 
print_r($files); 
closedir($directory); 
 
function sorter($a, $b) 
{ 
    if ($a[1] == $b[1]) 
    { 
        return 0; 
    } 
    else 
    { 
        return ($a[1] < $b[1]) ? -1 : 1; 
    } 
} 
?>
```

可以使用 POST 或 GET 请求方法将附加变量传递到上载脚本。要将附加 POST 变量发送到上载脚本，可以使用下面的代码：

```AS3
var fileRef:FileReference = new FileReference(); 
fileRef.addEventListener(Event.SELECT, selectHandler); 
fileRef.addEventListener(Event.COMPLETE, completeHandler); 
fileRef.browse(); 
function selectHandler(event:Event):void 
{ 
    var params:URLVariables = new URLVariables(); 
    params.date = new Date(); 
    params.ssid = "94103-1394-2345"; 
    var request:URLRequest = new URLRequest("http://www.yourdomain.com/FileReferenceUpload/fileupload.cfm"); 
    request.method = URLRequestMethod.POST; 
    request.data = params; 
    fileRef.upload(request, "Custom1"); 
} 
function completeHandler(event:Event):void 
{ 
    trace("uploaded"); 
}
```

上面的示例创建一个将传递到远程服务器端脚本的 URLVariables 对象。
在早期版本的 ActionScript 中，可以通过在查询字符串中传递值来将变量传递到服务器上载脚本。
在 ActionScript 3.0 中，可以使用 URLRequest 对象将变量传递到远程脚本，该对象允许您使用 POST 或 GET 方法传递数据；因此，可以更轻松和更清晰地传递较大数据集。
为了指定是使用 GET 还是使用 POST 请求方法来传递变量，可以将 URLRequest.method 属性相应设置为 URLRequestMethod.GET 或 URLRequestMethod.POST。

在 ActionScript 3.0 中，还可以通过向 upload() 方法提供第二个参数来覆盖默认 Filedata 上载文件字段名称，如上面的示例所示（该示例使用 Custom1 替换默认值 Filedata）。

默认情况下，Flash Player 不尝试发送测试上载，虽然您可以通过将值 true 作为第三个参数传递给 upload() 方法来覆盖此默认行为。测试上载的目的是检查实际文件上载是否会成功，如果需要服务器身份，还会检查服务器身份验证是否会成功。

注： 目前，只在基于 Windows 的 Flash Player 上进行测试上载。
处理文件上载的服务器脚本应收到包含下列元素的 HTTP POST 请求：

Content-Type，其值为 multipart/form-data。

Content-Disposition，其 name 属性设置为“Filedata”，filename 属性设置为原始文件的名称。
您可以通过在 FileReference.upload() 方法中传递 uploadDataFieldName 参数的值来指定自定义 name 属性。

文件的二进制内容。

下面是一个 HTTP POST 请求范例：

```
POST /handler.asp HTTP/1.1 
Accept: text/* 
Content-Type: multipart/form-data; 
boundary=----------Ij5ae0ae0KM7GI3KM7ei4cH2ei4gL6 
User-Agent: Shockwave Flash 
Host: www.mydomain.com 
Content-Length: 421 
Connection: Keep-Alive 
Cache-Control: no-cache 
 
------------Ij5ae0ae0KM7GI3KM7ei4cH2ei4gL6  
Content-Disposition: form-data; name="Filename" 
 
sushi.jpg  
------------Ij5ae0ae0KM7GI3KM7ei4cH2ei4gL6 
Content-Disposition: form-data; name="Filedata"; filename="sushi.jpg" 
Content-Type: application/octet-stream 
 
Test File  
------------Ij5ae0ae0KM7GI3KM7ei4cH2ei4gL6 
Content-Disposition: form-data; name="Upload" 
 
Submit Query 
------------Ij5ae0ae0KM7GI3KM7ei4cH2ei4gL6 
(actual file data,,,)
下面的 HTTP POST 请求范例发送三个 POST 变量：api_sig、api_key 和 auth_token，并使用自定义上载数据字段名的值"photo"：

POST /handler.asp HTTP/1.1 
Accept: text/* 
Content-Type: multipart/form-data; 
boundary=----------Ij5ae0ae0KM7GI3KM7ei4cH2ei4gL6 
User-Agent: Shockwave Flash 
Host: www.mydomain.com 
Content-Length: 421 
Connection: Keep-Alive 
Cache-Control: no-cache 
 
------------Ij5GI3GI3ei4GI3ei4KM7GI3KM7KM7 
Content-Disposition: form-data; name="Filename" 
 
sushi.jpg 
------------Ij5GI3GI3ei4GI3ei4KM7GI3KM7KM7 
Content-Disposition: form-data; name="api_sig" 
 
XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX 
------------Ij5GI3GI3ei4GI3ei4KM7GI3KM7KM7 
Content-Disposition: form-data; name="api_key" 
 
XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX 
------------Ij5GI3GI3ei4GI3ei4KM7GI3KM7KM7 
Content-Disposition: form-data; name="auth_token" 
 
XXXXXXXXXXXXXXXXXXXXXXX 
------------Ij5GI3GI3ei4GI3ei4KM7GI3KM7KM7 
Content-Disposition: form-data; name="photo"; filename="sushi.jpg" 
Content-Type: application/octet-stream 
 
(actual file data,,,) 
------------Ij5GI3GI3ei4GI3ei4KM7GI3KM7KM7 
Content-Disposition: form-data; name="Upload" 
 
Submit Query 
------------Ij5GI3GI3ei4GI3ei4KM7GI3KM7KM7--
```
*/

###6.从服务器下载文件

您可以让用户使用 FileReference.download() 方法从服务器下载文件。
该方法使用两个参数：request 和 defaultFileName:  
第一个参数是 URLRequest 对象，该对象包含要下载的文件的 URL。 
第二个参数是可选的，使用该参数可以指定出现在下载文件对话框中的默认文件名。 
如果省略第二个参数 defaultFileName，则使用指定 URL 中的文件名。

下面的代码从 SWF 文件所在的目录下载名为 index.xml 的文件：

```AS3
var request:URLRequest = new URLRequest("index.xml"); 
var fileRef:FileReference = new FileReference(); 
fileRef.download(request);
```

若要将默认名称设置为 currentnews.xml 而非 index.xml，请指定 defaultFileName 参数，如下面的片断所示：

```AS3
var request:URLRequest = new URLRequest("index.xml"); 
var fileToDownload:FileReference = new FileReference(); 
fileToDownload.download(request, "currentnews.xml");
```

如果服务器文件名不直观或是由服务器生成的，重命名文件会很有帮助。
另外，在使用服务器端脚本下载文件（而不是直接下载文件）时，最好明确指定 defaultFileName 参数。
例如，如果有基于传递给它的 URL 变量下载特定文件的服务器端脚本，则需要指定 defaultFileName 参数。
否则，下载文件的默认名称即是服务器端脚本的名称。

可以使用 download() 方法将数据发送至服务器，方法是将参数追加到要分析的服务器脚本的 URL。
下面的 ActionScript 3.0 片断基于传递给 ColdFusion 脚本的参数下载文档：

```AS3
package 
{ 
    import flash.display.Sprite; 
    import flash.net.FileReference; 
    import flash.net.URLRequest; 
    import flash.net.URLRequestMethod; 
    import flash.net.URLVariables; 
 
    public class DownloadFileExample extends Sprite 
    { 
        private var fileToDownload:FileReference; 
        public function DownloadFileExample() 
        { 
            var request:URLRequest = new URLRequest(); 
            request.url = "http://www.[yourdomain].com/downloadfile.cfm"; 
            request.method = URLRequestMethod.GET; 
            request.data = new URLVariables("id=2"); 
            fileToDownload = new FileReference(); 
            try 
            { 
                fileToDownload.download(request, "file2.txt"); 
            } 
            catch (error:Error) 
            { 
                trace("Unable to download file."); 
            } 
        } 
    } 
}
```

下面的代码显示了 ColdFusion 脚本 download.cfm，该脚本根据 URL 变量的值从服务器下载两个文件之一: 

```XML
<cfparam name="URL.id" default="1" /> 
<cfswitch expression="#URL.id#"> 
    <cfcase value="2"> 
        <cfcontent type="text/plain" file="#ExpandPath('two.txt')#" deletefile="No" /> 
    </cfcase> 
    <cfdefaultcase> 
        <cfcontent type="text/plain" file="#ExpandPath('one.txt')#" deletefile="No" /> 
    </cfdefaultcase> 
</cfswitch>
```

使用 FileReferenceList 类，用户可以选择一个或多个要上载到服务器端脚本的文件。
文件上载是由 FileReference.upload() 方法处理的，必须对用户选择的每个文件调用此方法。

下面的代码创建两个 FileFilter 对象（imageFilter 和 textFilter），并在一个数组中将它们传递到 FileReferenceList.browse() 方法。
这导致操作系统文件对话框显示两个可能的文件类型过滤器。

```AS3
var imageFilter:FileFilter = new FileFilter("Image Files (*.jpg, *.jpeg, *.gif, *.png)", "*.jpg; *.jpeg; *.gif; *.png"); 
var textFilter:FileFilter = new FileFilter("Text Files (*.txt, *.rtf)", "*.txt; *.rtf"); 
var fileRefList:FileReferenceList = new FileReferenceList(); 
try 
{ 
    var success:Boolean = fileRefList.browse(new Array(imageFilter, textFilter)); 
} 
catch (error:Error)  
{ 
    trace("Unable to browse for files."); 
}
```

允许用户使用 FileReferenceList 类选择并上载一个或多个文件与使用 FileReference.browse() 选择文件是相同的，但 FileReferenceList 允许选择多个文件。
上载多个文件时，要求您使用 FileReference.upload() 上载每个所选的文件，如以下代码所示： 

```AS3
var fileRefList:FileReferenceList = new FileReferenceList(); 
fileRefList.addEventListener(Event.SELECT, selectHandler); 
fileRefList.browse(); 
 
function selectHandler(event:Event):void 
{ 
    var request:URLRequest = new URLRequest("http://www.[yourdomain].com/fileUploadScript.cfm"); 
    var file:FileReference; 
    var files:FileReferenceList = FileReferenceList(event.target); 
    var selectedFileArray:Array = files.fileList; 
    for (var i:uint = 0; i < selectedFileArray.length; i++) 
    { 
        file = FileReference(selectedFileArray[i]); 
        file.addEventListener(Event.COMPLETE, completeHandler); 
        try 
        { 
            file.upload(request); 
        } 
        catch (error:Error) 
        { 
            trace("Unable to upload files."); 
        } 
    } 
} 
function completeHandler(event:Event):void 
{ 
    trace("uploaded"); 
}
```
由于 Event.COMPLETE 事件会添加到数组中每个单独的 FileReference 对象中，因此，Flash Player 在每个文件完成上载时都会调用 completeHandler() 方法。