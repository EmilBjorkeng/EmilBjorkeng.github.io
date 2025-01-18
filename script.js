function bannerScroll() {
    var height = window.innerHeight
        || document.documentElement.clientHeight
        || document.body.clientHeight;

        window.scrollTo({
        top: height,
        left: 0,
        behavior: "smooth"
    });
}

// Enable the transition on change but not on load
var content = document.getElementsByClassName("content")[0];
content.style.transitionDuration  = ".5s";