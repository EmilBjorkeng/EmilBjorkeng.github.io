var chooseFile = document.getElementById("choose-file");
var imgPreview = document.getElementById("img-preview");
var textBox = document.getElementById('text-box');

chooseFile.addEventListener("change", function () {
    getImgData();
});

function getImgData() {
const files = chooseFile.files[0];
    if (files) {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(files);
        fileReader.addEventListener("load", function () {
            imgPreview.style.display = "block";
            imgPreview.innerHTML = '<img src="' + this.result + '" />';

            textBox.value = this.result;
        });
    }
}
textBox.value = "";