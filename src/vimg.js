/**
 * VImg - HTML Image (.vimg) Viewer 
 * @author Maciej Dębowski
 */

(async function() {
    const _vimg = { version: '1.0.0', deprecated: false };
    window._vimg = _vimg;

    document.querySelectorAll("v-img").forEach(async function(el) {
        const src = el.getAttribute("src");
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        el.appendChild(canvas);

        const buffer = await (await fetch(`${window.location.origin}/${src}`)).text();
        const bufferElements = buffer.split(";");

        const width = bufferElements[0], height = bufferElements[1];

        canvas.width = width;
        canvas.height = height;

        bufferElements.splice(2, bufferElements.length - 1).forEach(function(tile, key) {
            const y = Math.floor(key / width);
            const x = key % width;

            ctx.fillStyle = tile
            ctx.fillRect(x, y, 1, 1);
        })
    });

    document.querySelectorAll("v-gif").forEach(async function(el) {
        const src = el.getAttribute("src");
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        el.appendChild(canvas);

        const buffer = await (await fetch(`${window.location.origin}/${src}`)).text();
        const bufferElements = buffer.split(";");

        const width = bufferElements[0], height = bufferElements[1], fps = bufferElements[2];

        canvas.width = width;
        canvas.height = height;

        const frames = buffer.split("framestart")

        frames.splice(0, 1)
        frames.forEach((x, key) => frames[key] = x.replace(/\r\n/g, ""))
        
        frames.forEach((frame, key) => {
            setTimeout(() => {
                ctx.clearRect(0, 0, 10000, 10000)

                const bufferElements = frame.split(";");
                bufferElements.splice(0, 1)

                bufferElements.forEach((tile, key) => {
                    const y = Math.floor(key / width);
                    const x = key % width;

                    ctx.fillStyle = tile
                    ctx.fillRect(x, y, 1, 1);
                })
            }, key * 1000 / fps)
        })
    });
})();