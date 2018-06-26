let btnObj = {
    Adarash: {
        "id": 0,
        "note": "B3",
        "name": "Adarash",
        "duration": 35,
        "isPlaying": false
    },
    Alex: {
        "id": 1,
        "note": "C3",
        "name": "Alex",
        "duration": 102,
        "isPlaying": false
    },
    Shindy: {
        "id": 2,
        "note": "D3",
        "name": "Shindy",
        "duration": 63,
        "isPlaying": false
    },
    Nicole: {
        "id": 3,
        "note": "E3",
        "name": "Nicole",
        "duration": 100,
        "isPlaying": false
    },
    Gail: {
        "id": 4,
        "note": "F3",
        "name": "Gail",
        "duration": 48,
        "isPlaying": false
    },
    Bill: {
        "id": 5,
        "note": "B4",
        "name": "Bill",
        "duration": 26,
        "isPlaying": false
    },
    Judy: {
        "id": 6,
        "note": "C4",
        "name": "Judy",
        "duration": 34,
        "isPlaying": false
    },
    Jim: {
        "id": 7,
        "note": "D4",
        "name": "Jim",
        "duration": 53,
        "isPlaying": false
    },
    Rudi: {
        "id": 8,
        "note": "E4",
        "name": "Rudi",
        "duration": 43,
        "isPlaying": false
    },
    Terrick: {
        "id": 9,
        "note": "F4",
        "name": "Terrick",
        "duration": 56,
        "isPlaying": false
    },
    Jaycee: {
        "id": 10,
        "note": "G4",
        "name": "Jaycee",
        "duration": 59,
        "isPlaying": false
    },
    Althea: {
        "id": 11,
        "note": "B5",
        "name": "Althea",
        "duration": 32,
        "isPlaying": false
    },
    Essy: {
        "id": 12,
        "note": "C5",
        "name": "Essy",
        "duration": 32,
        "isPlaying": false
    },
    Jasmine: {
        "id": 13,
        "note": "D5",
        "name": "Jasmine",
        "duration": 56,
        "isPlaying": false
    },
    TEST: {
        "id": 13,
        "note": "A5",
        "name": "TEST",
        "duration": 5,
        "isPlaying": false
    }

}

let output;
let index = 0;

//MIDI protocal
WebMidi.enable(function (err) {

    if (err) {
        console.log("WebMidi could not be enabled.", err);
    } else {
        console.log("WebMidi enabled!");
    }

});

WebMidi.enable(function (err) {

    console.log("INPUTS: ", WebMidi.inputs);
    console.log("OUTPUS: ", WebMidi.outputs);
    output = WebMidi.getOutputByName("MadMapper In");
    console.log("Choose MadMapper as Output!")


    let midiOutput = document.createElement("select");
    WebMidi.outputs.forEach((e) => {
        printOnScreen("Found midi output: " + e.name)
        let option = document.createElement("option")
        option.text = e.name
        midiOutput.add(option)
    })

    let outputDom = document.getElementById("outputList")
    outputDom.appendChild(midiOutput)

    midiOutput.addEventListener("change", function () {
        let name = midiOutput.value
        output = WebMidi.getOutputByName(name);
        printOnScreen("You selecet: " + output)

    })

});



let scanner;
let init = () => {
    buttonBinding()

    scanner = new Instascan.Scanner({
        video: document.getElementById('preview'),
        refractoryPeriod: 5000,
    });

    scanner.addListener('scan', function (content) {
        console.log("Scan Found: ", content);
        printOnScreen("Scan found: " + content)
        Object.keys(btnObj).forEach((key) => {
            if (content == btnObj[key].note) {
                sendNoteWithDuration(key)
            }
        })
    });

    Instascan.Camera.getCameras().then(function (cameras) {
        console.log("CAMERAS: ", cameras)
        let cameraList = document.createElement("select");

        cameras.forEach((e) => {
            printOnScreen("Found camera: " + e.name)
            let option = document.createElement("option")
            option.text = e.name
            cameraList.add(option)
        })

        //for dropdrow twst
        let option = document.createElement("option")
        option.text = "No Cam"
        cameraList.add(option)

        let cameraDom = document.getElementById("cameraList")
        cameraDom.appendChild(cameraList)

        cameraList.addEventListener("change", function () {
            let cam = cameraList.value
            printOnScreen("You selecet: " + cam)
            cameras.forEach((e) => {
                if (e.name == cam) {
                    scanner.start(e)

                }
            })
            if (cam == "No Cam") {
                scanner.stop()
            }

        })

        if (cameras.length > 0) {
            scanner.start(cameras[cameras.length - 1]);
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

    Object.keys(btnObj).forEach((key) => {
        //add button to DOM body
        let btn = document.createElement("button")
        let btnText = document.createTextNode(`${btnObj[key].name}: ${btnObj[key].note}`)
        btn.appendChild(btnText)
        btn.className = "btn"
        btn.id = btnObj[key].note
        btnParent.appendChild(btn)

        //bind button with eventListener
        btn.addEventListener("click", function () {
            sendNoteWithDuration(key)
        })
    })
}



let sendNoteWithDuration = (key) => {

    let note = btnObj[key].note
    let length = btnObj[key].duration * 1000
    let name = btnObj[key].name

    //check is playing or not
    if (!btnObj[key].isPlaying) {
        output.playNote(note, 10, {
            duration: length,
            velocity: 127
        }) //channel 10
        printOnScreen(`<span class="play">Play ${name}: ${note}</span>, stop it after ${length/1000}s`)

        btnObj[key].isPlaying = true

        setTimeout(function () {
            btnObj[key].isPlaying = false
            printOnScreen(`<span class="stop">Stop ${name}: ${note}</span>`)
        }, length)

    } else {
        printOnScreen(`${name}: ${note} is playing, send nothing`)
    }

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
    if (index > 40) {
        removeItem()
    }

}

let removeItem = () => {
    let list = document.getElementById("status").getElementsByTagName('li')
    console.log(list)
    let last = list[list.length - 1]
    last.parentNode.removeChild(last)
}