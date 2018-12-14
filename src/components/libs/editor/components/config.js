// https://www.cnblogs.com/Tirisfal/p/5548424.html
const defaultConfig = {
  uiColor: '#B3C0D1',
  width: '100%',
  height: 300,
  toolbarCanCollapse: true,
  toolbar: [{
      name: 'document',
      items: ['Source', '-', 'NewPage', 'Preview', '-', 'Templates']
    },
    {
      name: 'clipboard',
      items: ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo']
    },
    {
      name: 'editing',
      items: ['Find', 'Replace', 'Selection']
    },
    {
      name: 'basicstyles',
      items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat']
    },
    '/',
    {
      name: 'paragraph',
      items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl']
    },
    {
      name: 'links',
      items: ['Link', 'Unlink', 'Anchor']
    },
    {
      name: 'insert',
      items: ['Table', 'Image']
    },
    '/',
    {
      name: 'styles',
      items: ['Styles', 'Format', 'Font', 'FontSize']
    },
    {
      name: 'colors',
      items: ['TextColor', 'BGColor']
    },
    {
      name: 'tools',
      items: ['Maximize', 'ShowBlocks']
    }
  ],
  baseFloatZIndex: 500,
  image_previewText: '图片预览',
  language: 'zh-cn',
  allowedContent: true
}
export default defaultConfig
