const toolInput = document.getElementById('toolinput');
const generated = document.getElementById('generated');
const fileupload = document.getElementById('uploadfile');

let settings;
fetch('mappings/mctopdown.json').then((response) => {
    response.json().then((obj) => {
        settings = obj;

        // Display JSON in the textarea
        toolInput.value = JSON.stringify(obj, null, '    ');

        // Load the default image
        const img = new Image();
        img.src = settings.inputimage.default;
        img.onload = () => {
            // Generate canvases
            generate(settings, img);
        }
    })
})

const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
});

fileupload.onchange = (event) => {
    toBase64(event.target.files[0]).then((base64data) => {
        const img = new Image();
        img.src = base64data;
        img.onload = () => {
            generate(settings, img)
        }
    });
}

function generate(settings, img) {
    // Clear previous generated contents
    generated.innerHTML = '';

    // Show the input image
    generated.appendChild(img)
    
    settings.pastes.forEach((singleCanvas) => {
        const cvs = document.createElement('canvas');
        const ctx = cvs.getContext('2d');
    
        cvs.width = settings.canvas.width;
        cvs.height= settings.canvas.height;
        ctx.imageSmoothingEnabled = settings.canvas.smooth;

        singleCanvas.forEach((p) => {
            if (typeof p == 'object') {
                ctx.save()
                ctx.translate(p.dx + p.dw / 2, p.dy + p.dh / 2)

                let width;
                let height;
                if (Math.abs(p.dr % 2) == 1) {
                    width = p.dh;
                    height= p.dw;
                } else {
                    width = p.dw;
                    height= p.dh;
                }
                ctx.rotate(p.dr * Math.PI / 2)
                ctx.drawImage(img, p.sx, p.sy, p.sw, p.sh, -width / 2, -height / 2, width, height)
                ctx.restore()
            }
        })

        generated.appendChild(cvs);
    })

}