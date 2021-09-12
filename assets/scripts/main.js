window.addEventListener('pywebviewready', function() {
    setTimeout(function(){
        pywebview.api.prestart().then(function(data){
            if (data[0]) {
                showPathPage()
            } else {
                showMainPage()
                loadAddons(data[1]).then(hideLoading())
            }
        })
    }, 0)
})

function showPathPage() {
    $(".path-page").css("display", "flex")
}

function showMainPage() {
    $(".main-page").css("display", "flex")
}

function openFileDialog() {
    pywebview.api.openFileDialog().then(function(addonPath){
        $("#addonpathfield").text(addonPath)
    });
}

function Go() {
    selectedPath = $("#addonpathfield").text()
    if (selectedPath.endsWith("garrysmod\\addons")) {
        showLoading()
        pywebview.api.initialStart()
        setTimeout(function(){
            showMainPage()
        }, 1000)
    } else {
        alertify.error('Bad addons folder path...');
    }
}


async function loadAddons(addons) {
    var active = addons[0]
    var inactive = addons[1]


    for (let i = 0; i < active.length; i++) {
        var item_node = document.createElement("div")
        item_node.classList.add("column-item")
        var header_node = document.createElement("h3")
        header_node.textContent = active[i]
        item_node.appendChild(header_node)
        document.getElementById("active-column").appendChild(item_node)
    }

    for (let i = 0; i < inactive.length; i++) {
        var item_node = document.createElement("div")
        item_node.classList.add("column-item")
        var header_node = document.createElement("h3")
        header_node.textContent = inactive[i]
        item_node.appendChild(header_node)
        document.getElementById("inactive-column").appendChild(item_node)
    }
    
}

function moveAddon(name, to) {
    
}

//LOADING
function showLoading() {
    $(".loading").css("display", "flex")
    $(".loading").css("opacity", "1")
    setTimeout(function(){
        $(".path-page").css("display", "none")
        $(".main-page").css("display", "none")
    }, 800)
}

function hideLoading() {
    $(".loading").css("opacity", "0")
    setTimeout(function() {
        $(".loading").css("display", "none")
    }, 700)
}


//BUTTONS
function exitButton() {
    pywebview.api.quit()
}

function rungmod() {
    pywebview.api.rungmod()
}

function openexplorer() {
    pywebview.api.openexplorer()
}