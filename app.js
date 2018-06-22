// console.log("app.js")
let output;

WebMidi.enable(function (err) {

    if (err) {
      console.log("WebMidi could not be enabled.", err);
    } else {
    //   console.log("WebMidi enabled!");
    }
    
  });

WebMidi.enable(function (err) {
    // console.log(WebMidi.inputs);
    // console.log(WebMidi.outputs);
    output = WebMidi.getOutputByName("MadMapper In");
    // console.log(output)
});



let scanner;
let counter = 0;
let init = () =>{
    console.log("init")
    let cloth1 = document.getElementById("cloth-1");
    let test = document.getElementById("test");
    // console.log("button",cloth1)
    cloth1.addEventListener("click",function(){
        console.log("1")
        output.playNote("F3");
    })

    scanner = new Instascan.Scanner({ video: document.getElementById('preview'),refractoryPeriod: 5000, });
    scanner.addListener('scan', function (content) {
        console.log(content);
        if(content == "64"){
            output.playNote("F3");
            counter++;
            test.innerHTML = "works "+counter+" times";
        }
      });
      Instascan.Camera.getCameras().then(function (cameras) {
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


