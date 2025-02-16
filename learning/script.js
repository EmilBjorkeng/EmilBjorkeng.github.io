var links = document.getElementsByTagName('a');
var colors = [ '#0060aa', '#245c4f', '#D57309', '#000000', '#bd1845', '#3B5863', '#D5D218' ];

if (/Android|iPhone/i.test(navigator.userAgent)) {
    for (let i = 0; i < links.length; i++) {
        let elem = links[i];
        let name = elem.innerHTML;
        elem.innerHTML = '';
        let color = colors[i];

        let div = document.createElement('div');
        div.style.width = '90%';
        div.style.aspectRatio = '1/1';
        div.style.margin = '1rem auto';
        div.style.backgroundColor = color;

        div.innerText = name;
        div.style.color = 'white';
        div.style.fontSize = '2.8rem';
        div.style.fontFamily = 'Arial';

        div.style.display = 'flex';
        div.style.justifyContent = 'center';
        div.style.alignItems = 'center';

        elem.style.textDecoration = 'none';
        elem.appendChild(div);
    }
}