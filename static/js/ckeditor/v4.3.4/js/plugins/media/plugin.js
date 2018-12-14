(function() {
    CKEDITOR.plugins.add("media", {
        requires: ["dialog"],
        init: function(a) {
            a.addCommand("media", new CKEDITOR.dialogCommand("media"));
            a.ui.addButton("media", {
                label: "插入视频",			//调用dialog时显示的名称
                command: "media",
                icon: this.path + "images/media.gif"	//在toolbar中的图标

            });
            CKEDITOR.dialog.add("media", this.path + "dialogs/media.js")
        }
    });

})();