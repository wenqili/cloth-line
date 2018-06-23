let btnArr = ["F3", "B3", "C3", "D3", "E3"]
let output;
let index = 0;

WebMidi.enable(function (err) {

    if (err) {
        console.log("WebMidi could not be enabled.", err);
    } else {
        console.log("WebMidi enabled!");
    }

});

WebMidi.enable(function (err) {
   
    console.log("INPUTS: ",WebMidi.inputs);
    console.log("OUTPUS: ",WebMidi.outputs);
    output = WebMidi.getOutputByName("MadMapper In");
    console.log("Choose MadMapper as Output!")

});



let scanner;
let init = () => {
    buttonBinding()

    scanner = new Instascan.Scanner({
        video: document.getElementById('preview'),
        refractoryPeriod: 5000,
    });

    scanner.addListener('scan', function (content) {
        console.log("Scan Found: ",content);
        printOnScreen("Scan found: " + content)
        btnArr.forEach((e) => {
            if (content == e) {
                sendNoteOn(e)
            }
        })
    });

    Instascan.Camera.getCameras().then(function (cameras) {
        console.log("CAMERAS: ",cameras)
        if (cameras.length > 0) {
            scanner.start(cameras[0]);
        } else {
            console.error('No cameras found.');
        }
    }).catch(function (e) {
        console.error(e);
    });

}

document.addEventListener('DOMContentLoaded', init, false);


let buttonBinding = () => {
    let btnParent = document.getElementById("btn-container")
    for (var i = 0; i < btnArr.length; i++) {
        let btn = document.createElement("button")
        let btnText = document.createTextNode(btnArr[i])
        btn.appendChild(btnText)
        btn.className = "btn"
        btn.id = btnArr[i]
        btnParent.appendChild(btn)

        let index = i
        btn.addEventListener("click", function () {
            sendNoteOn(btnArr[index])
        })

    }
}

let sendNoteOn = (note) => {
    console.log("Send NoteOn", note)
    resetNote()
    output.playNote(note)
    printOnScreen("send NoteOn: " + note)
}

let resetNote = () => {
    btnArr.forEach((e) => {
        output.stopNote(e)
    })
}

let printOnScreen = (str) => {
    index++
    let textList = document.createElement("li")
    textList.innerHTML = index + " ~ " + str
    let textParent = document.getElementById("status")
    textParent.prepend(textList)
    if (index > 10) {
        removeItem()
    }

}

let removeItem = () => {
    let list = document.getElementById("status").getElementsByTagName('li')
    console.log(list)
    let last = list[list.length - 1]
    last.parentNode.removeChild(last)
}