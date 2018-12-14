/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
	$.extend(config, {
		toolbar: 'Basic',
		uiColor: '#9AB8F3',
		width: "100%",
		height: 300,
		toolbarCanCollapse: true, 		// 允许工具栏收缩
		toolbar : [
		           { name: 'document', 		items: [ 'Source', '-', 'NewPage', 'Preview', '-', 'Templates' ] },
		           { name: 'clipboard', 	items: [ 'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo' ] },
		           { name: 'editing', 		items: [ 'Find', 'Replace', 'Selection'] },
		           { name: 'basicstyles', 	items: [ 'Bold','Italic','Underline','Strike','Subscript','Superscript','-','RemoveFormat' ] },
		           '/',
		           { name: 'paragraph', 	items: [ 'NumberedList','BulletedList','-','Outdent','Indent','-','Blockquote','CreateDiv','-','JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock','-','BidiLtr','BidiRtl' ] },
		           { name: 'links', 		items: [ 'Link','Unlink','Anchor' ] },
		           { name: 'insert', 		items: [ 'Table', "Image" ] },
		           '/',
		           { name: 'styles', 		items: [ 'Styles','Format','Font','FontSize' ] },
		           { name: 'colors', 		items: [ 'TextColor','BGColor' ] },
		           { name: 'tools', 		items: [ 'Maximize', 'ShowBlocks','-','About' ] }
		           ],
		baseFloatZIndex: 500,			// z-index
		image_previewText : "图片预览",
		filebrowserImageUploadUrl : fullPath + "image/ckeditorUpload",
		language : "zh-cn",
		allowedContent : true
	});
};
