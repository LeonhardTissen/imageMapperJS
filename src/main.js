const toolInput = document.getElementById('toolinput');
const generated = document.getElementById('generated');

const img = new Image();
img.src = 'images/steve.png';

img.onload = () => {
    fetch('mappings/mctopdown.json').then((response) => {
        response.json().then((obj) => {
            toolInput.value = JSON.stringify(obj, null, '    ');
            generate(obj);
        })
    })
}

function generate(settings) {
    const cvs = document.createElement('canvas');
    const ctx = cvs.getContext('2d');

    cvs.width = settings.canvas.width;
    cvs.height= settings.canvas.height;
    ctx.imageSmoothingEnabled = settings.canvas.smooth;
    
    settings.pastes.forEach((p) => {
        ctx.drawImage(img, p.sx, p.sy, p.sw, p.sh, p.dx, p.dy, p.dw, p.dh)
    })

    generated.appendChild(cvs);
}