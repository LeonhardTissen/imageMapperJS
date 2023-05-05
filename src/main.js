const toolInput = document.getElementById('toolinput');
const generated = document.getElementById('generated');


fetch('mappings/mctopdown.json').then((response) => {
    response.json().then((obj) => {
        toolInput.value = JSON.stringify(obj, null, '    ');
        const img = new Image();
        img.src = obj.inputimage.default;
        img.onload = () => {
            generate(obj, img);
        }
    })
})

function generate(settings, img) {
    generated.appendChild(img)
    
    settings.pastes.forEach((singleCanvas) => {
        const cvs = document.createElement('canvas');
        const ctx = cvs.getContext('2d');
    
        cvs.width = settings.canvas.width;
        cvs.height= settings.canvas.height;
        ctx.imageSmoothingEnabled = settings.canvas.smooth;

        singleCanvas.forEach((p) => {
            if (typeof p == 'object') {
                ctx.translate(p.dx + p.dw / 2, p.dy + p.dh / 2)
                if (Math.abs(p.dr % 2) == 1) {
                    const temp = p.dh;
                    p.dh = p.dw;
                    p.dw = temp;
                }
                ctx.rotate(p.dr * Math.PI / 2)
                ctx.drawImage(img, p.sx, p.sy, p.sw, p.sh, -p.dw / 2, -p.dh / 2, p.dw, p.dh)
                ctx.setTransform(1, 0, 0, 1, 0, 0);
            }
        })

        generated.appendChild(cvs);
    })

}