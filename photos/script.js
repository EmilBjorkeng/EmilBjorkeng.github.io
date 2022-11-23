const main = document.getElementsByTagName('main')[0];

function focus(num) {
    removeFocus()
    let picture = main.children[num].children[0];
    let div = document.createElement('div');
    let img = document.createElement("img");
    img.src = picture.src;
    div.classList = "focus";
    div.appendChild(img)
    document.body.appendChild(div)
}

function removeFocus() {
    let focus = document.getElementsByClassName('focus'); 
    Array.from(focus).forEach(elem => {
        elem.remove();
    });
}

document.body.addEventListener("click", (click) => {
    if (click.target == main || click.target.classList == "menu") {
        removeFocus();
    }
});