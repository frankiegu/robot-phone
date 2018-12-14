(function() {
	var frameId 	= "cke_mediaIframe",		// 视频文件iframe的id
		frameImgId 	= "cke_mediaImgIframe",		// 视频图片文件iframe的id
		xml 		= {},					// 回写文本
		isUpload	= false,				// 当前是否正处于文件上传状态
		relativePath="",					// 当前文件的相对路径
		defaults = {
			mediaType : ["video/mp4", "video/3gpp"],			// 默认支持的视频流文件类型
			mediaSize : 10*1024*1024,							// 默认的视频流文件大小
			mediaImgType: ["image/jpg", "image/jpeg", "image/png", "image/gif", "image/bmp"],	// 默认支持的视频图片文件类型
			mediaImgSize: 1024*1024								// 默认的视频图片文件大小
		},
	requestDone = false,					// 服务器响应是否已完成
	mediaCallback = null,					// 视频上传完成回掉函数
		/**
		 * 创建iframe
		 * @param id iframe的id
		 * @param uri iframe的url
		 * @param func 绑定执行成功的回掉函数
		 */
		createUploadIframe = function(id, uri, func){	
	            var frameId = id;
	            if(window.ActiveXObject) {
	            	var io = document.createElement('iframe');
	            	io.id = io.name = frameId;
	                if(typeof uri== 'boolean'){
	                    io.src = 'javascript:false';
	                }
	                else if(typeof uri== 'string'){
	                    io.src = uri;
	                }
	            }
	            else {
	                var io = document.createElement('iframe');
	                io.id = frameId;
	                io.name = frameId;
	            }
	            io.style.position = 'absolute';
	            io.style.top = '-1000px';
	            io.style.left = '-1000px';

	            document.body.appendChild(io);
	            var callback = function(){
	            	uploadCallback(null, frameId, func);
	            }
	            if(window.attachEvent){
	            	io.attachEvent('onload', callback);
	            }
	            else{
	            	io.addEventListener('load', callback, false);
	            }  
	            return io;   
	    },
	    /**
	     * iframe载入的回掉函数，用于服务器响应后获取返回的数据
	     * @param isTimeout 是否请求超时
	     * @param id iframe的id
	     * @param callback 成功响应的回掉函数
	     */
	    uploadCallback = function(isTimeout, id, callback){
	    	   // Wait for a response to come back 
	    	   var io = document.getElementById(id);
	    	   try {    
	    		   if(io.contentWindow){
	    			   xml.responseText = io.contentWindow.document.body?io.contentWindow.document.body.innerHTML:null;
	    	           xml.responseXML = io.contentWindow.document.XMLDocument?io.contentWindow.document.XMLDocument:io.contentWindow.document;
		    	   }else if(io.contentDocument){
		    		   xml.responseText = io.contentDocument.document.body?io.contentDocument.document.body.innerHTML:null;
		    	       xml.responseXML = io.contentDocument.document.XMLDocument?io.contentDocument.document.XMLDocument:io.contentDocument.document;
		    	   }      
	    	   }catch(e) {
	    		   alert("上传文件失败");
	    		   mediaUnmask();
	    	   }
	    	   if( xml || isTimeout == "timeout"){    
	    		   requestDone = true;
	    	       var status;
	    	       try {
		    	       status = isTimeout != "timeout" ? "success" : "error";
		    	       // Make sure that the request was successful or notmodified
		    	       if( status != "error" ){
		    	    	   // process the data (runs the xml through httpData regardless of callback)
		    	           var data = xml.responseText;                        
		    	           if(data !== undefined && data !== null && data !== false && data !== "false" && data !== ""){
		    	        	   var json = eval("(" + data + ")");
		    	        	   if(json && json.status == "success"){
		    	        		   if(id == frameId){
			    	        		   var 	mv = document.getElementById("cke_mediaVideo"),
				    	        	   		mi = document.getElementById("cke_mediaImgForm");
			    	        		   
			    	        			   mv.innerHTML = "<source src='" + json.data + "' type='video/mp4' />";
					    	        	   mi.style.display = "block";
			    	        	   } else if(id == frameImgId){
			    	        		   var mv = document.getElementById("cke_mediaVideo");
			    	        		   mv.poster = json.data;
			    	        	   }
		    	        	   }else{
	    	        			   alert("文件上传失败，原因：" + json.data);
	    	        		   }
		    	        	   
		    	        	   if(callback){
		    	        		   try {
		    	        			   callback.call(null, json.data, mv.getAttribute("sourceType"));
									} catch (e) {
									}	
		    	        	   }
		    	        	   mediaUnmask();
		    	           }
		    	       } else {
		    	    	   alert("上传文件失败");
		    	    	   mediaUnmask();
		    	       }
	    	       } catch(e) {
	    	    	   status = "error";
	    	    	   alert("上传文件失败");
	    	    	   mediaUnmask();
	    	       };                
	               jQuery(io).unbind();
	    	       xml = {};
   	            };
	    },
	/**
	 * 移除本地创建的iframes
	 */
	removeIframe = function(){
	    	var iframe = document.getElementById(frameId),
	    		iframeImg = document.getElementById(frameImgId);
	    	iframe.parentNode.removeChild(iframe);
	    	iframeImg.parentNode.removeChild(iframeImg);
	},
	/**
	 * 清空预览区域
	 */
	clearPrevious = function(){
		var mp = document.getElementById("cke_mediaPrevious"),
			mt = document.getElementById("cke_mediaType"),
			mui = document.getElementById("cke_mediaUrlInp"),
			video =	document.createElement("video");
		video.setAttribute("id", "cke_mediaVideo");
		video.setAttribute("controls", "controls");
		video.setAttribute("preload", "none");
		video.setAttribute("width", "100%");
		video.style.width = "100%";
		video.style.border = "1px solid #ccc";
		video.sourceType = "mediaForm";
		video.innerHTML = "";
		for ( var i = 0, l = mp.childNodes.length; i < l; i++) {
			mp.removeChild(mp.childNodes[i]);
		}
		mp.appendChild(video);
		mui.value = "";
	},
	/**
	 * 判断IE的文档模型和版本，必须支持HTML5的IE版本才可使用该插件功能
	 */
	ieMode = (function(){
		var isIE = navigator.userAgent.toLocaleLowerCase().indexOf('msie') !== -1,
		 	dm = document.documentMode;
		if(isIE){
			if(dm < 10){
				alert("您当前的IE版本过低(<10)，不支持html5特征，请使用其他浏览器打开!")
				return false;
			} else {
				if(document.compatMode === 'BackCompat'){
					alert("您当前的IE文档模型为怪异模式(quirks)，不支持html5特征，请切换其他模式或者使用其他浏览器打开!");
					return false;
				}
			}
		}
		return true;
	})(),
	/**
	 * 计算文件大小
	 * @param sizr 文件尺寸，单位Byte
	 */
	calSize = function(size){
		if(!size)	return "0Byte";
		var p = [1024*1024, 1024, 1], i = 0,
			s = ["MB", "KB", "Byte"], r;
		while(true){
			if((r = size/p[i]) >= 1 || i >= p.length){
				break;
			} 	
			i++;
		}
		return r + s[i] + "";
	},
	mask = null;
	
	window.mediaSubmit = function(obj){
		var fileInp = obj.previousSibling.previousSibling.previousSibling; 
		if(fileInp.value){
			if(fileInp.files){
				for ( var i = 0, l = fileInp.files.length; i < l; i++) {
					if(fileInp.name == "mediaUpload"){
						if(fileInp.files[i].size > defaults.mediaSize){
							alert("视频文件不能超过" + calSize(defaults.mediaSize) + "!");
							return false;
						} else if(("|" + defaults.mediaType.join("|") + "|").indexOf("|" + fileInp.files[i].type.toLowerCase() + "|") < 0){
							alert("仅支持" + defaults.mediaType.join(",") + "格式视频");
							return false;
						} 
					} else if(fileInp.name == "mediaImgUpload"){
						if(fileInp.files[i].size > defaults.mediaImgSize){
							alert("视频图片文件不能超过" + calSize(defaults.mediaImgSize) + "!");
							return false;
						} else if(("|" + defaults.mediaImgType.join("|") + "|").indexOf("|" + fileInp.files[i].type.toLowerCase() + "|") < 0){
							alert("仅支持" + defaults.mediaImgType.join(",") + "格式图片");
							return false;
						}
					}
				} 
			}else {
				alert("您当前使用的浏览器不支持html5特性，请切换浏览器!");
				return false;
			}
			window.mediaMask();
			obj.parentNode.submit();
		}
		return false;
	}
	window.mediaMask = function(){
		var mediaContainer = document.getElementById("cke_mediaContainer").parentNode;
		var loading = document.createElement("img");
		mask = document.createElement("div");
		mask.style.position = "absolute";
		mask.style.left = "10px";
		mask.style.top = "35px";
		mask.style.width = mediaContainer.clientWidth + "px";
		mask.style.height = mediaContainer.clientHeight + "px";
		mask.style.background = "#ccc";
		mask.style.opacity = "0.5";
		mediaContainer.appendChild(mask);
		
		loading.style.position = "relative";
		loading.style.left = (mediaContainer.clientWidth - 32)/2 + "px";
		loading.style.top = (mediaContainer.clientHeight - 32)/2 + "px";
		loading.src = relativePath + "images/loading.gif";
		mask.appendChild(loading);
		isUpload = true;
	}
	window.mediaUnmask = function(){
		if(mask){
			mask.parentNode.removeChild(mask);
			mask = null;
		}
		isUpload = false;
	}
	window.changeMediaSource = function(obj){
		var val = obj.value,
			mv = document.getElementById("cke_mediaVideo"),
			media = {
				"mediaForm" : document.getElementById("cke_mediaForm"),
				"mediaUrl" : document.getElementById("cke_mediaUrl") 
			};
		for(var e in media){
			media[e].style.display = "none";
		}
		media[val].style.display = "block";
		mv.setAttribute("sourceType", val);
	}
	window.mediaUrlSubmit = function(obj){
		var urlInp = obj.previousSibling.previousSibling.previousSibling;
		if(!urlInp.value || !urlInp.value.replace(/\s*/, '')){
			alert("请输入URL!");
			return false;
		}
		urlInp.value = urlInp.value.replace(/\s*/, '');
		var 	mv = document.getElementById("cke_mediaVideo"),
   				mi = document.getElementById("cke_mediaImgForm");
   
	    mv.innerHTML = "<source src='" + urlInp.value + "' type='video/mp4' />";
	    mi.style.display = "block";
	    if(mediaCallback){
 		   try {
 			  mediaCallback.call(null, urlInp.value, mv.sourceType);
			} catch (e) {
			}	
 	   }
	}
	
	/**
	 * 在config中配置
	 * media: {
			mediaUrl: (full_path || "/icity-portal-cms/") + "media/upload",
			mediaImgUrl: (full_path || "/icity-portal-cms/") + "media/cacheImg",
			mediaSize: 100*1024*1024,
			mediaImgSize: 1024*1024,
			mediaCallback: mediaCallback,
			mediaImgCallback: mediaImgCallback
		}
	 */
    CKEDITOR.dialog.add("media", 
    function(editor) {
    	mediaCallback = editor.config.media && editor.config.media.mediaCallback || null;
    	var iframe = createUploadIframe(frameId, false, mediaCallback),
    		iframeImg = createUploadIframe(frameImgId, false, editor.config.media && editor.config.media.mediaImgCallback || null),
    		html = 	
		    '<div id="cke_mediaContainer" style="width: 100%; height: 100%;">' + 
    		'<div style="width: 98%; margin: 5px 1%;">' +
				'<form id="cke_mediaForm" action="' + ((editor.config.media && editor.config.media.mediaUrl) || "") + '" method="post" enctype="multipart/form-data" target="' + frameId + '">' +
					'<span>选择视频文件</span><br /><br />' +
					'<input type="file" style="width: 100%;" name="mediaUpload" /><br /><br />' +
					'<a id="cke_mediaSubmit" onclick="mediaSubmit(this); return false;" href="javascript: void(0);" title="上传到服务器" class="cke_dialog_ui_fileButton cke_dialog_ui_button">' +
						'<span class="cke_dialog_ui_button">上传到服务器</span>' + 
					'</a>' +
				'</form><br />' +
				'<div id="cke_mediaUrl" style="display: none;">' +
					'<span>输入外部URL</span><br /><br />' +
					'<input type="text" id="cke_mediaUrlInp" name="cke_mediaUrlInp" style="width: 100%;" class="cke_dialog_ui_input_text" /><br /><br />' +
					'<a id="cke_mediaUrlBtn" onclick="mediaUrlSubmit(this); return false;" href="javascript: void(0);" title="确定" class="cke_dialog_ui_fileButton cke_dialog_ui_button">' +
						'<span class="cke_dialog_ui_button">&nbsp;&nbsp;确定&nbsp;&nbsp;</span>' + 
					'</a>' +
				'</div><br />' +
				'<form id="cke_mediaImgForm" action="' + ((editor.config.media && editor.config.media.mediaImgUrl) || "") + '" method="post" enctype="multipart/form-data" target="' + frameImgId + '" style="display: none;">' +
					'<span>选择视频图片</span><br /><br />' +
					'<input type="file" style="width: 100%;" name="mediaImgUpload" /><br /><br />' +
					'<a id="cke_mediaImgSubmit" onclick="mediaSubmit(this); return false;" href="javascript: void(0);" title="上传到服务器" class="cke_dialog_ui_fileButton cke_dialog_ui_button">' +
						'<span class="cke_dialog_ui_button">上传到服务器</span>' + 
					'</a>' +
				'</form>' +
			'</div>' + 
			'<div style="width: 20%; min-height: 200px; margin-left: 1%; margin-top: 5px; float: left;">' + 
				'<span>媒体来源</span><br />' +
				'<select id="cke_mediaSource" style="border: solid 1px #ccc;" onchange="changeMediaSource(this)">' + 
					'<option value="mediaForm">本地上传</option>' +
					'<option value="mediaUrl">外部URL</option>' +
				'</select><br /><br />' +
			'</div>' +
			'<div id="cke_mediaPrevious" style="width: 75%; min-height: 200px; max-height: 350px; margin: 5px 1%; padding: 10px border: 2px solid RGB(234,234,242); float: left;">' +
				'<video id="cke_mediaVideo" controls="controls" preload="none" width="100%" style="width: 100%; border: 1px solid #ccc;" sourceType="mediaForm" >&nbsp;</video>' +
			'</div>' +
			'</div>';
    	if(editor.config.media){
    		if(editor.config.media.mediaType){
        		defaults.mediaType = editor.config.media.mediaType; 
        	}
        	if(editor.config.media.mediaSize){
        		defaults.mediaSize = editor.config.media.mediaSize; 
        	}
        	if(editor.config.media.mediaImgType){
        		defaults.mediaImgType = editor.config.media.mediaImgType;
        	}
        	if(editor.config.media.mediaImgSize){
        		defaults.mediaImgSize = editor.config.media.mediaImgSize; 
        	}
    	}
    	relativePath = editor.plugins.media.path;
        return {
            title: "视频属性",
            minWidth: "540",
            minHeight:"350",
            resize: false,
            contents: [{
                id: "media1",
                label: "",
                title: "",
                expand: true,
                padding: 0,
                elements: [{
                    type: "html",
                    html: ieMode !== true ? "" : html
                }]
            }],
            onOk: function() {
            	if(ieMode === true){
            		//点击确定按钮后的操作
                    //editor.insertHtml("编辑器追加内容");
                	var mp = document.getElementById("cke_mediaPrevious"),
                		mv = document.getElementById("cke_mediaVideo");
                	if(!mv){
                		alert("请选择视频文件!");
                		return false;
                	} else {
                		if(!mv.childNodes || !mv.childNodes.length || !mv.childNodes[0].src){
                			alert("请选择视频文件!");
                			return false;
                		}else if(!mv.poster){
                			alert("请选择视频图片文件!");
                			return false;
                		}
                		if(isUpload !== false){
                			alert("请等待文件上传完成!");
                			return false;
                		}
                	}
                	mv.removeAttribute("id");
                	var html = mp.innerHTML;
                	mv.setAttribute("id", "cke_mediaVideo");
                	clearPrevious();
                	editor.insertHtml(html);
                	return true;
            	}
            },
            onCancel: function(){
            	if(ieMode === true){
            		clearPrevious();
                	window.mediaUnmask();
            	}
            }
        }
    })
})();