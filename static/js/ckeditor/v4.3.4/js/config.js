/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here. For example:
	// config.language = 'fr';
	// config.uiColor = '#AADC6E';
	 config.language = 'zh-cn';							// 语言
	 config.resize_enabled = false;					// 禁止拖拽
	  config.autoUpdateElement = true;			//  当提交包含有此编辑器的表单时，是否自动更新元素内的数据
	  config.baseHref = '';									// 设置是使用绝对目录还是相对目录，为空为相对目录
	  config.baseFloatZIndex = 100;				//	编辑器的z-index值
	  config.keystrokes = [								// 设置快捷键

       [ CKEDITOR.ALT + 121 /*F10*/, 'toolbarFocus' ], //获取焦点

        [ CKEDITOR.ALT + 122 /*F11*/, 'elementsPathFocus' ], //元素焦点

       [ CKEDITOR.SHIFT + 121 /*F10*/, 'contextMenu' ], //文本菜单

       [ CKEDITOR.CTRL + 90 /*Z*/, 'undo' ], //撤销

        [ CKEDITOR.CTRL + 89 /*Y*/, 'redo' ], //重做

        [ CKEDITOR.CTRL + CKEDITOR.SHIFT + 90 /*Z*/, 'redo' ], //

        [ CKEDITOR.CTRL + 76 /*L*/, 'link' ], //链接

        [ CKEDITOR.CTRL + 66 /*B*/, 'bold' ], //粗体

        [ CKEDITOR.CTRL + 73 /*I*/, 'italic' ], //斜体

        [ CKEDITOR.CTRL + 85 /*U*/, 'underline' ], //下划线

        [ CKEDITOR.ALT + 109 /*-*/, 'toolbarCollapse' ]

    ]
    //是否对编辑区域进行渲染 plugins/editingblock/plugin.js

    config.editingBlock = true;
		 //编辑器中回车产生的标签

    config.enterMode = CKEDITOR.ENTER_P; //可选：CKEDITOR.ENTER_BR或CKEDITOR.ENTER_DIV

    //是否使用HTML实体进行输出 plugins/entities/plugin.js

    config.entities = true;
 //是否转换一些难以显示的字符为相应的HTML字符 plugins/entities/plugin.js

    config.entities_greek = true;
//是否转换一些拉丁字符为HTML plugins/entities/plugin.js

    config.entities_latin = true;
//使用搜索时的高亮色 plugins/find/plugin.js

    config.find_highlight = {

        element : 'span',

        styles : { 'background-color' : '#ff0', 'color' : '#00f' }

    };
config.tabSpaces = 4;



};
