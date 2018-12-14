(function() {
    CKEDITOR.plugins.add("audio", {
        requires: ["dialog"],
        init: function(a) {
            a.addCommand("audio", new CKEDITOR.dialogCommand("audio"));
            a.ui.addButton("audio", {
                label: "插入音频",			//调用dialog时显示的名称
                command: "audio",
                icon: this.path + "images/audio.png"	//在toolbar中的图标

            });
            CKEDITOR.dialog.add("audio", this.path + "dialogs/audio.js")
        }
    });

})();