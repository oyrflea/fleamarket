src="//cdn.quilljs.com/1.3.6/quill.js"

var toolbarOptions = [
    [{ header: [1, 2, false] }],
    ['bold', 'italic', 'underline'],
    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'align': [] }],
    ['image']
];
var quill = new Quill('#editor-container', {
    modules: {
        toolbar: toolbarOptions
    },
    placeholder: '공지사항을 입력하세요',
    theme: 'snow'
});