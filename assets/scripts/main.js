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

        item_node.addEventListener('click', function(){
            moveAddon(this, "inactive")
        });
    }

    for (let i = 0; i < inactive.length; i++) {
        var item_node = document.createElement("div")
        item_node.classList.add("column-item")
        var header_node = document.createElement("h3")
        header_node.textContent = inactive[i]
        item_node.appendChild(header_node)
        document.getElementById("inactive-column").appendChild(item_node)

        item_node.addEventListener('click', function(){
            moveAddon(this, "active")
        });

    }
    
}

function moveAddon(item_node, to) {
    if (to == "active") {
        var opposite = "inactive"
    } else {
        var opposite = "active"
    }

    var item_node_clone = item_node.cloneNode(true)
    document.getElementById(to+"-column").appendChild(item_node_clone)
    document.getElementById(opposite+"-column").removeChild(item_node)

    item_node_clone.addEventListener('click', function(){
        moveAddon(item_node_clone, opposite)
    });
    
    pywebview.api.moveAddon([item_node_clone.innerText, to])

    alertify.success(item_node_clone.children[0].innerText + " was moved to " + to)
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

//ANIMATIONS
function doPulse(column_type) {
    $("#" + column_type).addClass("column-content-pulse-animated")
    $("#" + column_type).on("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function(){
        $(this).removeClass("column-content-pulse-animated");
   });
}