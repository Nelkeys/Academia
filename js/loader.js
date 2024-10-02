document.addEventListener('DOMContentLoaded', function () {
    window.addEventListener('load', function () {
        setTimeout(function () {
            document.querySelector('.loading-logo').style.display = 'none';
            document.querySelector('header').style.display = 'block';
            document.querySelector('.intro').style.display = 'block';
            document.querySelector('.freq').style.display = 'flex';
            document.querySelector('form').style.display = 'flex';  
        }, 1000);
    });
});
