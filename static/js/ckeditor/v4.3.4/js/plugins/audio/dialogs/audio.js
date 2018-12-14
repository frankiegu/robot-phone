( function(){
	
	var Audio = {
		defaults : {
			audioType : ["audio/mpeg", "audio/mp3", "audio/wav"],
			audioSize : 5*1024*1024,
			audioCallback: null
		},
		util : {
			calType : function( fileExt ){
				if( ( "|" + Audio.defaults.audioType.join( "|" ) + "|" ).indexOf( "|" + fileExt + "|", 0) > -1 ){
					return true;
				} else {
					alert( "仅支持 " + Audio.defaults.audioType.join( "," ) + "类型音频" );
					return false;
				}
			},
			calSize : function( fileSize ){
				var getOverSize = function(fileSize){
					if(!fileSize)	return "0Byte";
					var p = [1024*1024, 1024, 1], i = 0,
						s = ["MB", "KB", "Byte"], r;
					while(true){
						if((r = fileSize/p[i]) >= 1 || i++ >= p.length){
							break;
						} 	
					}
					return Math.round(r) + s[i] + "";
				}
				if( fileSize > Audio.defaults.audioSize ){
					alert("文件不能大于" + getOverSize(Audio.defaults.audioSize) + "");
					return false;
				} else {
					return true;
				}
			} 
		}
	};
	var Upload = {
		defaults : {
			requestDone : false,
			relativePath : "",
			isUpload: false,
			mask: null,
			ieMode : (function(){
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
			}())
		},
		util: {
			createIframe: function(id, uri, func){
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
	            	Upload.util.uploadCallback(null, frameId, func);
	            }
	            if(window.attachEvent){
	            	io.attachEvent('onload', callback);
	            }
	            else{
	            	io.addEventListener('load', callback, false);
	            }  
	            return io;  
			},
			mask: function(){
				var ac = document.getElementById("cke_audioContainer"),
					loading = document.createElement("img"),
					mask = Upload.defaults.mask;
				mask = document.createElement("div");
				mask.style.position = "absolute";
				mask.style.left = "0px";
				mask.style.top = "0px";
				mask.style.width = ac.clientWidth + "px";
				mask.style.height = ac.clientHeight + "px";
				mask.style.background = "#ccc";
				mask.style.opacity = "0.5";
				ac.appendChild(mask);
				
				loading.style.position = "relative";
				loading.style.left = (ac.clientWidth - 32)/2 + "px";
				loading.style.top = (ac.clientHeight - 32)/2 + "px";
				loading.src = Upload.defaults.relativePath + "images/loading.gif";
				mask.appendChild(loading);
				Upload.defaults.isUpload = true;
				Upload.defaults.mask = mask;
			},
			unmask: function(){
				if(Upload.defaults.mask){
					Upload.defaults.mask.parentNode.removeChild(Upload.defaults.mask);
					Upload.defaults.mask = null;
				}
				Upload.defaults.isUpload = false;
			},
			uploadCallback: function(isTimeout, id, callback){
				 var io = document.getElementById(id),
				 	xml = {};
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
		    		   Upload.util.unmask();
		    	   }
		    	   if( xml || isTimeout == "timeout"){    
		    		   Upload.defaults.requestDone = true;
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
			    	        		   var ad = document.getElementById("cke_audio");
			    	        		   ad.setAttribute("src", json.data);
			    	        		   ad.setAttribute("controls", "controls");
			    	        	   }else{
		    	        			   alert("文件上传失败，原因：" + json.data);
		    	        		   }
			    	        	   
			    	        	   if(callback){
			    	        		   try {
			    	        			   callback.call(null, json.data, ad.getAttribute("sourceType"));
										} catch (e) {
										}
			    	        	   }
			    	        	   Upload.util.unmask();
			    	           }
			    	       } else {
			    	    	   alert("上传文件失败");
			    	    	   Upload.util.unmask();
			    	       }
		    	       } catch(e) {
		    	    	   status = "error";
		    	    	   alert("上传文件失败");
		    	    	   Upload.util.unmask();
		    	       };                
		               jQuery(io).unbind();
		    	       xml = {};
	   	            };
			},
			removeIframe : function(id){
		    	var iframe = document.getElementById(id);
		    	iframe.parentNode.removeChild(iframe);
			},
			audioSubmit: function(obj){
				var af = document.getElementById("cke_audioForm"),
					fileInp = obj.previousSibling.previousSibling.previousSibling;
				if(fileInp.value){
					if(fileInp.files){
						for ( var i = 0, l = fileInp.files.length; i < l; i++) {
							if(Audio.util.calType(fileInp.files[i].type.toLowerCase()) !== true){
								return false;
							} else if(Audio.util.calSize(fileInp.files[i].size) !== true){
								return false;
							}
						} 
					}else {
						alert("您当前使用的浏览器不支持html5特性，请切换浏览器!");
						return false;
					}
					Upload.util.mask();
					obj.parentNode.submit();
				}
				return false;
			},
			audioUrlSubmit: function(obj, callback){
				var urlInp = obj.previousSibling.previousSibling.previousSibling,
					url;
				if(!urlInp.value || !(url = urlInp.value.replace(/\s*/, ''))){
					alert("请输入URL!");
					return false;
				}
				urlInp.value = url;
				var ad = document.getElementById("cke_audio");
     		    ad.setAttribute("src", url);
     		    ad.setAttribute("controls", "controls");
     		   if(Audio.defaults.audioCallback){
        		   try {
        			   Audio.defaults.audioCallback.call(null, url, ad.sourceType);
					} catch (e) {
					}
        	   }
			},
			clearPrevious: function(){
				var ad = document.getElementById("cke_audio"),
					aui = document.getElementById("cke_audioUrlInp");
				if(ad){
					ad.removeAttribute("src");
					ad.removeAttribute("controls");
				}
				aui.value = "";
			},
			changeAudioSource: function(obj){
				var val = obj.value,
					ad = document.getElementById("cke_audio")
					audio = {
						"audioForm" : document.getElementById("cke_audioForm"),
						"audioUrl" : document.getElementById("cke_audioUrl")
					};
				for(var e in audio){
					audio[e].style.display = "none";
				}
				audio[val].style.display = "block";
				ad.setAttribute("sourceType", val);
			}
		}
	};
	
	window.Upload = Upload;
	
	
	
	CKEDITOR.dialog.add( "audio", 
	function( editor ){
		Audio.defaults.audioCallback = editor.config.media && editor.config.audio.audioCallback || null;
		var iframe = Upload.util.createIframe("cke_audioIframe", false, audioCallback),
			html = 	"<div id='cke_audioContainer' style='width: 100%; height: 100%; position: relative;'>" +
						'<div style="width: 98%; margin-left: 1%; margin-top: 5px;">' + 
							'<span>媒体来源</span><br />' +
							'<select id="cke_audioSource" style="border: solid 1px #ccc;" onchange="Upload.util.changeAudioSource(this)">' + 
								'<option value="audioForm">本地上传</option>' +
								'<option value="audioUrl">外部URL</option>' +
							'</select>' +
						'</div> <br />' +
						'<div id="cke_audioUrl" style="display: none;">' + 
							'<span>输入音频URL</span><br /><br />' +
							'<input type="text" id="cke_audioUrlInp" name="cke_audioUrlInp" style="width: 100%;" class="cke_dialog_ui_input_text" /><br /><br />' +
							'<a id="cke_audioUrlBtn" onclick="Upload.util.audioUrlSubmit(this); return false;" href="javascript: void(0);" title="确定" class="cke_dialog_ui_fileButton cke_dialog_ui_button">' +
								'<span class="cke_dialog_ui_button">&nbsp;&nbsp;确定&nbsp;&nbsp;</span>' + 
							'</a>' +
						'</div>' +
						'<form id="cke_audioForm" action="' + ((editor.config.audio && editor.config.audio.audioUrl) || "") + '" method="post" enctype="multipart/form-data" target="cke_audioIframe">' +
							'<span>选择音频文件</span><br /><br />' +
							'<input type="file" style="width: 100%;" name="audioUpload" /><br /><br />' +
							'<a id="cke_audioSubmit" onclick="Upload.util.audioSubmit(this); return false;" href="javascript: void(0);" title="上传到服务器" class="cke_dialog_ui_fileButton cke_dialog_ui_button">' +
								'<span class="cke_dialog_ui_button">上传到服务器</span>' + 
							'</a>' +
						'</form><br />' +
						'<div id="cke_audioPrevious" style="width: 98%; min-height: 200px; max-height: 350px; margin: 5px 1%; padding: 10px border: 2px solid RGB(234,234,242);">' +
							'<audio id="cke_audio" width="100%" style="width: 100%; border: 1px solid #ccc;" preload="metadata" sourceType="audioForm">您的浏览器不支持音频播放器</video>' +
						'</div>' +
					"</div>";
		if(editor.config.audio){
			if(editor.config.audio.audioType){
				Audio.defaults.audioType = editor.config.audio.audioType; 
			}
			if(editor.config.audio.audioSize){
				Audio.defaults.audioSize = editor.config.audio.audioSize; 
			}
		}
//		Upload.util.clearPrevious();
		Upload.defaults.relativePath = editor.plugins.audio.path;
		return {
	            title: "音频属性",
	            minWidth: "540",
	            minHeight:"350",
	            resize: false,
	            contents: [{
	                id: "cke_audio1",
	                label: "",
	                title: "",
	                expand: true,
	                padding: 0,
	                elements: [{
	                    type: "html",
	                    html: Upload.defaults.ieMode !== true ? "" : html
	                }]
	            }],
	            onOk: function() {
	            	if(Upload.defaults.ieMode === true){
	            		//点击确定按钮后的操作
	                    //editor.insertHtml("编辑器追加内容");
	                	var ad = document.getElementById("cke_audio"),
	                		ap = document.getElementById("cke_audioPrevious");
	                	if(!ad){
	                		alert("请选择音频文件!");
	                		return false;
	                	} else {
	                		if(!ad.src){
	                			alert("请选择音频文件!");
	                			return false;
	                		}
	                		if(Upload.defaults.isUpload !== false){
	                			alert("请等待文件上传完成!");
	                			return false;
	                		}
	                	}
	                	ad.removeAttribute("id");
	                	var html = ap.innerHTML;
	                	ad.setAttribute("id", "cke_audio");
	                	Upload.util.clearPrevious();
	                	editor.insertHtml(html);
	                	return true;
	            	}
	            },
	            onCancel: function(){
	            	if(Upload.defaults.ieMode === true){
	                	Upload.util.unmask();
	                	Upload.util.clearPrevious();
	            	}
	            }
	        };
		
	} );
	
}() );