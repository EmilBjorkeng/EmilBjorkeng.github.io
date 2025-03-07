const chooseFile = document.getElementById('choose-file');
const imgPreview = document.getElementById('img-preview');
const textBox = document.getElementById('text-box');

chooseFile.addEventListener('change', () => {
    const files = chooseFile.files[0];
    if (files) {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(files);
        fileReader.addEventListener('load', function () {
            imgPreview.style.display = 'block';
            imgPreview.innerHTML = '<img src="' + this.result + '" />';

            textBox.value = this.result;
        });
    }
});
textBox.value = '';

textBox.addEventListener('input', (e) => {
    if (textBox.value === '') {
        imgPreview.style.display = 'none';
        return;
    }
    imgPreview.style.display = 'block';
    imgPreview.innerHTML = '<img src="' + textBox.value + '" />';
});