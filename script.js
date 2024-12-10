let pdfDoc = null;
let currentPage = 1;
const canvasLeft = document.createElement('canvas');
const canvasRight = document.createElement('canvas');
const ctxLeft = canvasLeft.getContext('2d');
const ctxRight = canvasRight.getContext('2d');

document.querySelector('.page-left').appendChild(canvasLeft);
document.querySelector('.page-right').appendChild(canvasRight);

document.getElementById('file').addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (file) {
    document.querySelector('.file-name').textContent = file.name;
    const fileReader = new FileReader();
    fileReader.onload = function() {
      const typedArray = new Uint8Array(this.result);
      pdfjsLib.getDocument(typedArray).promise.then(function(pdf) {
        pdfDoc = pdf;
        currentPage = 1;
        renderPages();
      });
    };
    fileReader.readAsArrayBuffer(file);
  }
});

document.getElementById('prev').addEventListener('click', function() {
  if (currentPage > 1) {
    currentPage -= 2;
    renderPages();
  }
});

document.getElementById('next').addEventListener('click', function() {
  if (currentPage < pdfDoc.numPages) {
    currentPage += 2;
    renderPages();
  }
});

document.querySelector('.hover-left-top').addEventListener('click', function() {
  if (currentPage > 1) {
    currentPage -= 2;
    renderPages();
  }
});

document.querySelector('.hover-right-top').addEventListener('click', function() {
  if (currentPage < pdfDoc.numPages) {
    currentPage += 2;
    renderPages();
  }
});

document.querySelector('.hover-left-bottom').addEventListener('click', function() {
  if (currentPage > 1) {
    currentPage -= 2;
    renderPages();
  }
});

document.querySelector('.hover-right-bottom').addEventListener('click', function() {
  if (currentPage < pdfDoc.numPages) {
    currentPage += 2;
    renderPages();
  }
});

function renderPages() {
  renderPage(currentPage, canvasLeft, ctxLeft, document.querySelector('.page-left'));
  if (currentPage + 1 <= pdfDoc.numPages) {
    renderPage(currentPage + 1, canvasRight, ctxRight, document.querySelector('.page-right'));
  } else {
    ctxRight.clearRect(0, 0, canvasRight.width, canvasRight.height);
  }
}

function renderPage(pageNum, canvas, ctx, container) {
  pdfDoc.getPage(pageNum).then(function(page) {
    const viewport = page.getViewport({ scale: 1 });
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const scale = Math.min(containerWidth / viewport.width, containerHeight / viewport.height);
    const scaledViewport = page.getViewport({ scale: scale });

    canvas.height = scaledViewport.height;
    canvas.width = scaledViewport.width;

    const renderContext = {
      canvasContext: ctx,
      viewport: scaledViewport
    };
    page.render(renderContext);
  });
}