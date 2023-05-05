// Elements on the page
const toolInput = document.getElementById('toolinput');
const generated = document.getElementById('generated');
const fileupload = document.getElementById('uploadfile');

// Load the mappings file
let mappings;
fetch('mappings/mctopdown.json').then((response) => {
    response.json().then((obj) => {
        mappings = obj;

        // Display JSON in the textarea
        toolInput.value = JSON.stringify(obj, null, '    ');

        // Load the default image
        const img = new Image();
        img.src = mappings.inputimage.default;
        img.onload = () => {
            // Generate canvases
            generate(mappings, img);
        }
    })
})

// Converts a file from a file upload into an image that can be used on HTMLCanvas
const fileToBase64Img = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        const img = new Image()
        img.src = reader.result;
        img.onload = () => {
            resolve(img)
        };
    };
    reader.onerror = reject;
});

// Every time a file is uploaded, it will be read and a new output is generated
fileupload.onchange = (event) => {
    fileToBase64Img(event.target.files[0]).then((img) => {
        generate(mappings, img)
    });
}

function generate(mappings, img) {
    // Clear previous generated contents
    generated.innerHTML = '';

    // Show the input image
    generated.appendChild(img)
    
    // One setting can have multiple outputs as defined in the JSON
    mappings.pastes.forEach((singleCanvas) => {
        const cvs = document.createElement('canvas');
        const ctx = cvs.getContext('2d');
    
        cvs.width = mappings.canvas.width;
        cvs.height= mappings.canvas.height;

        // Keep pixelated look
        ctx.imageSmoothingEnabled = mappings.canvas.smooth;

        singleCanvas.forEach((p) => {
            if (typeof p == 'object') {
                ctx.save()

                // Don't draw directly at destination coordinates, translate instead for rotation
                ctx.translate(p.dx + p.dw / 2, p.dy + p.dh / 2)

                let width;
                let height;
                if (Math.abs(p.dr % 2) == 1) {
                    // Use swapped destination dimensions if the image is rotated 90°
                    width = p.dh;
                    height= p.dw;
                } else {
                    width = p.dw;
                    height= p.dh;
                }
                // p.dr defines the 
                ctx.rotate(p.dr * Math.PI / 2)

                // Draw from the source image onto the canvas
                ctx.drawImage(img, p.sx, p.sy, p.sw, p.sh, -width / 2, -height / 2, width, height)

                ctx.restore()
            }
        })

        // Show the generated 
        generated.appendChild(cvs);
    })

}