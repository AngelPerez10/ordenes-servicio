window.onload = function () {
    const canvas = document.getElementById('signatureCanvas');
    const ctx = canvas.getContext('2d');
    let drawing = false;

    // Iniciar el dibujo
    canvas.addEventListener('mousedown', function (e) {
        drawing = true;
        ctx.beginPath();
        ctx.moveTo(e.offsetX, e.offsetY);
    });

    // Dibujar mientras el ratón esté presionado
    canvas.addEventListener('mousemove', function (e) {
        if (drawing) {
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();
        }
    });

    // Terminar el dibujo
    canvas.addEventListener('mouseup', function () {
        drawing = false;
    });

    // Limpiar el canvas
    document.getElementById('clearSignature').addEventListener('click', function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    // Convertir la firma a imagen al enviar el formulario
    document.getElementById('ordenForm').addEventListener('submit', function (e) {
        const signatureData = canvas.toDataURL(); // Convertir el canvas a una URL de imagen en base64
        const signatureInput = document.createElement('input');
        signatureInput.type = 'hidden';
        signatureInput.name = 'firma_cliente'; // El nombre que usarás en el backend
        signatureInput.value = signatureData; // Guardar la firma en base64
        this.appendChild(signatureInput);
    });
};
