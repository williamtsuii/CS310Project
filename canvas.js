var canvas = new fabric.Canvas('imageCanvas', {
    backgroundColor: 'rgb(240,240,240)'
});

var imageLoader = document.getElementById('imageLoader');
imageLoader.addEventListener('change', handleImage, false);

function handleImage(e) {
    var reader = new FileReader();
    reader.onload = function (event) {
        var img = new Image();
        img.onload = function () {
            var imgInstance = new fabric.Image(img, {
                scaleX: 1,
                scaleY: 1
            })
            canvas.add(imgInstance);
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);
}

var imageSaver = document.getElementById('imageSaver');
imageSaver.addEventListener('click', saveImage, false);

function saveImage(e) {
    this.href = canvas.toDataURL({
        format: 'png',
        quality: 1.0
    });
    this.download = 'test.png'
}