window.onload = function () {
    const encargadoCanvas = document.getElementById('firma_encargado_canvas');
    const clienteCanvas = document.getElementById('firma_cliente_canvas');
    const encargadoCtx = encargadoCanvas.getContext('2d');
    const clienteCtx = clienteCanvas.getContext('2d');

    let drawingEncargado = false;
    let drawingCliente = false;

    // Configuración inicial del contexto
    encargadoCtx.strokeStyle = 'black';
    encargadoCtx.lineWidth = 2;

    clienteCtx.strokeStyle = 'black';
    clienteCtx.lineWidth = 2;

    // Función para obtener las coordenadas reales del cursor
    function getCursorPosition(canvas, event) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }

    // Función para iniciar el dibujo
    function startDrawing(ctx, canvas, e) {
        const pos = getCursorPosition(canvas, e);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        return true;
    }

    // Función para dibujar en el lienzo
    function draw(ctx, canvas, e, drawing) {
        if (drawing) {
            const pos = getCursorPosition(canvas, e);
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
        }
    }

    // Eventos para el lienzo del encargado
    encargadoCanvas.addEventListener('mousedown', (e) => {
        drawingEncargado = startDrawing(encargadoCtx, encargadoCanvas, e);
    });

    encargadoCanvas.addEventListener('mousemove', (e) => {
        draw(encargadoCtx, encargadoCanvas, e, drawingEncargado);
    });

    encargadoCanvas.addEventListener('mouseup', () => {
        drawingEncargado = false;
    });

    // Eventos para el lienzo del cliente
    clienteCanvas.addEventListener('mousedown', (e) => {
        drawingCliente = startDrawing(clienteCtx, clienteCanvas, e);
    });

    clienteCanvas.addEventListener('mousemove', (e) => {
        draw(clienteCtx, clienteCanvas, e, drawingCliente);
    });

    clienteCanvas.addEventListener('mouseup', () => {
        drawingCliente = false;
    });

    // Limpiar lienzos
    document.getElementById('clearEncargadoSignature').addEventListener('click', () => {
        encargadoCtx.clearRect(0, 0, encargadoCanvas.width, encargadoCanvas.height);
    });

    document.getElementById('clearClienteSignature').addEventListener('click', () => {
        clienteCtx.clearRect(0, 0, clienteCanvas.width, clienteCanvas.height);
    });

    // Convertir firmas a imágenes antes de enviar
    document.getElementById('orderForm').addEventListener('submit', function (e) {
        e.preventDefault(); // Prevenir el envío del formulario para evitar recarga de página

        // Obtener las imágenes en formato base64
        const encargadoSignature = encargadoCanvas.toDataURL();
        const clienteSignature = clienteCanvas.toDataURL();

        // Crear campos ocultos en el formulario para enviar las imágenes
        const encargadoInput = document.createElement('input');
        encargadoInput.type = 'hidden';
        encargadoInput.name = 'firma_encargado';
        encargadoInput.value = encargadoSignature;
        this.appendChild(encargadoInput);

        const clienteInput = document.createElement('input');
        clienteInput.type = 'hidden';
        clienteInput.name = 'firma_cliente';
        clienteInput.value = clienteSignature;
        this.appendChild(clienteInput);

        // Enviar el formulario
        this.submit();
    });
};