function onWndLoad(agreeCallback, disagreeCallback, onBack) {

    var slider = document.querySelector('.slider');
    var sliders = slider.children;

    const init1stChild = slider.firstChild;

    var initX = null;
    var transX = 0;
    var rotZ = 0;
    var transY = 0;

    var curSlide = null;

    var Z_DIS = 120;
    var Y_DIS = -65;
    var COLOR_BLUR = [33, 95, 100];
    var TRANS_DUR = 0.4;

    var bottomSlide = null;

    function init() {

        var z = 0, y = 0;

        for (var i = sliders.length - 1; i >= 0; i--) {
            sliders[i].style.backgroundColor = `rgb(255 255 255 / ${COLOR_BLUR[i]}%)`
            sliders[i].style.transform = 'translateZ(' + z + 'px) translateY(' + y + 'px)';

            z -= Z_DIS;
            y += Y_DIS;
        }
        attachEvents(slider.lastElementChild);
        
    }
    function attachEvents(elem) {
        if (!elem) {
            return;
        }
        curSlide = elem;

        curSlide.addEventListener('mousedown', slideMouseDown, false);
        curSlide.addEventListener('touchstart', slideMouseDown, false);
    }
    init();
    document.getElementById("back").addEventListener("click", onBack, false);
    
    function slideMouseDown(e) {
        if (e.touches) {
            initX = e.touches[0].clientX;
        }
        else {
            initX = e.pageX;
        }

        curSlide.style.backgroundColor = "#dfdfdf";
        curSlide.style.transition = "background-color 2s";

        document.addEventListener('mousemove', slideMouseMove, false);
        document.addEventListener('touchmove', slideMouseMove, false);

        document.addEventListener('mouseup', slideMouseUp, false);
        document.addEventListener('touchend', slideMouseUp, false);
    }
    var prevSlide = null;

    // Event when moving the card
    function slideMouseMove(e) {
        e.preventDefault();
        var mouseX;

        if (e.touches) {
            mouseX = e.touches[0].clientX;
        }
        else {
            mouseX = e.pageX;
        }

        transX += mouseX - initX;

        rotZ = transX / 50;
        transY = Math.abs(transX / 4);
        const max = curSlide.offsetWidth;

        const addY = Math.abs((transX / max) * Y_DIS);

        curSlide.style.transition = 'none';
        curSlide.style.backgroundColor = `rgb(255 255 255 / 80%)`
        curSlide.style.webkitTransform = 'translateX(' + transX + 'px)' + ' rotateZ(' + rotZ + 'deg)' + ' translateY(' + transY + 'px)';
        curSlide.style.transform = 'translateX(' + transX + 'px)' + ' rotateZ(' + rotZ + 'deg)' + ' translateY(' + transY + 'px)';
        var j = 1;
        //remains elements
        for (var i = sliders.length - 2; i >= 0; i--) {
            sliders[i].style.webkitTransform = `translateY(${Y_DIS * j + addY}px) translateZ(${-Z_DIS * j + addY}px)`;
            sliders[i].style.transform = `translateY(${Y_DIS * j + addY}px) translateZ(${-Z_DIS * j + addY}px)`;
            sliders[i].style.transition = 'none';
            sliders[i].style.backgroundColor = `rgb(255 255 255 / ${COLOR_BLUR[sliders.length - j]}%)`
            j++;
        }

        initX = mouseX;
        prevSlide = curSlide;
        // 
    }

    function changeSlide() {
        if (Math.abs(transX) >= curSlide.offsetWidth / 2) {
            bottomSlide = prevSlide;

            document.getElementById("back").removeEventListener('click', backToTop, false)
            document.getElementById("back").removeEventListener("click", onBack, false);
            const id = curSlide.getElementsByClassName("slide")[0]?.id;
            if (transX < 0) {
                disagreeCallback(curSlide, id);
            } else {
                agreeCallback(curSlide, id);
            }

            document.removeEventListener('mousemove', slideMouseMove, false);
            document.removeEventListener('touchmove', slideMouseMove, false);

            curSlide.style.transition = 'ease 0.2s';
            curSlide.style.opacity = 0;

            slider.insertBefore(prevSlide, slider.firstChild);
            attachEvents(slider.lastElementChild);
            prevSlide.style.display = "none"
            prevSlide.style.transition = 'none';
            prevSlide.style.opacity = '1';

            document.getElementById("back").addEventListener('click', backToTop, false)
        }
    }
    function slideMouseUp() {
        
        changeSlide();
        transX = 0;
        rotZ = 0;
        transY = 0;

        curSlide.style.transition = 'cubic-bezier(0,1.95,.49,.73) ' + TRANS_DUR + 's';
        curSlide.style.backgroundColor = "#ffffff"
        curSlide.style.webkitTransform = 'translateX(' + transX + 'px)' + 'rotateZ(' + rotZ + 'deg)' + ' translateY(' + transY + 'px)';
        curSlide.style.transform = 'translateX(' + transX + 'px)' + 'rotateZ(' + rotZ + 'deg)' + ' translateY(' + transY + 'px)';

        let id = curSlide.id;
        //remains elements
        var j = 1;
        for (var i = sliders.length - 2; i >= 0; i--) {
            sliders[i].style.transition = 'cubic-bezier(0,1.95,.49,.73) ' + TRANS_DUR / (j + 0.9) + 's';
            sliders[i].style.webkitTransform = 'translateX(' + transX + 'px)' + 'rotateZ(' + rotZ + 'deg)' + ' translateY(' + (Y_DIS * j) + 'px)' + ' translateZ(' + (-Z_DIS * j) + 'px)';
            sliders[i].style.transform = 'translateX(' + transX + 'px)' + 'rotateZ(' + rotZ + 'deg)' + ' translateY(' + (Y_DIS * j) + 'px)' + ' translateZ(' + (-Z_DIS * j) + 'px)';
            sliders[i].style.backgroundColor = `rgb(255 255 255 / ${COLOR_BLUR[sliders.length - j - 1]}%)`
            j++;
        }

        document.removeEventListener('mouseup', slideMouseUp, false);
        document.removeEventListener('touchend', slideMouseUp, false);
    }

    function backToTop(e) {
        e.preventDefault();
        transX = 0;
        rotZ = 0;
        transY = 0;
        
        insertAfter(bottomSlide, slider.lastElementChild);

        bottomSlide.style.transition = 'cubic-bezier(0,1.95,.49,.73) ' + TRANS_DUR + 's';
        bottomSlide.style.backgroundColor = "#ffffff"
        bottomSlide.style.webkitTransform = 'translateX(' + transX + 'px)' + 'rotateZ(' + rotZ + 'deg)' + ' translateY(' + transY + 'px)';
        bottomSlide.style.transform = 'translateX(' + transX + 'px)' + 'rotateZ(' + rotZ + 'deg)' + ' translateY(' + transY + 'px)';
        bottomSlide.style.display = 'block';
        bottomSlide.style.opacity = 1;

        

        //remains elements
        var j = 1;
        for (var i = sliders.length - 2; i >= 1; i--) {
            sliders[i].style.transition = 'cubic-bezier(0,1.95,.49,.73) ' + TRANS_DUR / (j + 0.9) + 's';
            sliders[i].style.webkitTransform = 'translateX(' + transX + 'px)' + 'rotateZ(' + rotZ + 'deg)' + ' translateY(' + (Y_DIS * j) + 'px)' + ' translateZ(' + (-Z_DIS * j) + 'px)';
            sliders[i].style.transform = 'translateX(' + transX + 'px)' + 'rotateZ(' + rotZ + 'deg)' + ' translateY(' + (Y_DIS * j) + 'px)' + ' translateZ(' + (-Z_DIS * j) + 'px)';
            sliders[i].style.backgroundColor = `rgb(255 255 255 / ${COLOR_BLUR[sliders.length - j - 1]}%)`
            j++;
        }
        bottomSlide = slider.firstChild;
        if (bottomSlide == init1stChild) {
            document.getElementById("back").removeEventListener('click', backToTop, false)
            document.getElementById("back").addEventListener("click", onBack, false);
        }
        init();

    }

    function insertAfter(newNode, existingNode) {
        existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
    }
}

export function agree(e) {
    let coordX = 1;

    const eventStart = new MouseEvent("touchstart", {
        view: window,
        bubbles: true,
        cancelable: true,
    });

    const event = new MouseEvent("touchend", {
        view: window,
        bubbles: true,
        cancelable: true,
    });


    function move() {
        coordX += 10;

        let ev = new MouseEvent("touchmove", {
            view: window,
            bubbles: true,
            cancelable: true,
            clientX: e.clientX + coordX,
            clientY: e.clientY,
        });

        e.target.dispatchEvent(ev);
        if (coordX < 100) {
            setTimeout(() => {
                move();
            }, 10);
        } else {
            e.target.dispatchEvent(event); 
        }
    }

    e.target.dispatchEvent(eventStart)
    move();
    
    
}

export function disagree(e) {
    let coordX = 1;

    const eventStart = new MouseEvent("touchstart", {
        view: window,
        bubbles: true,
        cancelable: true,
    });

    const event = new MouseEvent("touchend", {
        view: window,
        bubbles: true,
        cancelable: true,
    });


    function moveBack() {
        coordX += 30;
        let ev = new MouseEvent("touchmove", {
            view: window,
            bubbles: true,
            cancelable: true,
            clientX: - coordX,
            clientY: e.clientY,
        });

        e.target.dispatchEvent(ev);
        if (coordX < 500) {
            setTimeout(() => {
                moveBack();
            }, 10);
        } else {
            e.target.dispatchEvent(event); 
        }
    }

    e.target.dispatchEvent(eventStart)
    moveBack();
    
    
}

export default onWndLoad;