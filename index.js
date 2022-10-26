
const start_button = document.getElementById("submit_input")
const input_text = document.getElementById("inputs")
const output_text = document.getElementById("output")
const clear_all = document.getElementById("clear")
const pause = document.getElementById("pause")
const resume = document.getElementById("resume")
const fast_forward = document.getElementById("forward")
const ranger = document.getElementById("range")
const light = document.getElementById("light")
const dark = document.getElementById("dark")
const info = document.getElementById("info")

info.addEventListener("click",()=>{

alert(`Welcome to Text analyzer.
After you type text, choose speed and then click on the Send button.
At any time you can pause, resume or simply stop output by clicking on Restart button.
With click on button End you can stop current output and see result.
At the end program will recognize language and also show you some information about your text.
Have a nice day :)`)

})
resume.disabled = true;
pause.disabled = true;
fast_forward.disabled = true;
clear_all.addEventListener("click", () => window.location.reload())
ranger.classList.remove("hidden")

light.addEventListener("click",()=>{
    document.getElementById("body").classList.add("dark_mode")
    light.classList.add("hidden")
    dark.classList.remove("hidden")
})
dark.addEventListener("click",()=>{
    document.getElementById("body").classList.remove("dark_mode")
    dark.classList.add("hidden")
    light.classList.remove("hidden")
})

resume.addEventListener("click", () => {
    current_index = document.getElementById("output").innerHTML.replaceAll("<br>","\n").length
    write_text_in_div(text_from_user.split(""),ranger.value ,current_index)
    resume.disabled = true
    pause.disabled = false
    return
})
let lines =1;
start_button.addEventListener("click", () => {
    resume.disabled = true;
pause.disabled = false;
ranger.classList.add("hidden")
    document.getElementById("output_container").classList.remove("hidden")
    document.getElementById("timer").classList.remove("hidden")
    document.getElementById("text_area").classList.add("hidden")
    output_text.innerHTML = ""
    text_from_user = input_text.value.replaceAll('\n', '#')
    
    text_from_user.split("").map((x)=>{
        if(x=="#") lines++

    })

    
    setTimeout(() => write_text_in_div(text_from_user,ranger.value), 200);
    input_text.value = ""
})


const next_input_timer = () => {

    let now = 10000;
    let next_input_timer = setInterval(() => {
        now -= 1000
        if (now == -1000) {
            document.getElementById("output_container").classList.add("hidden")
            document.getElementById("timer").classList.add("hidden")
            document.getElementById("text_area").classList.remove("hidden")
            clearInterval(next_input_timer)         
            window.location.reload()
        }
        else {
            let minutes = Math.floor(now / 60000);
            let seconds = (now) / 1000 - Math.floor(minutes * 60);
            if (seconds < 10) {
                document.getElementById("timer").innerHTML = `Time to restart: ${minutes}min 0${seconds}s`
            }
            else if (seconds >= 10) {
                document.getElementById("timer").innerHTML = `Time to restart: ${minutes}min ${seconds}s `
            }
        }
     
    }, 1000);

    start_button.addEventListener("click", () => {
        clearInterval(next_input_timer)
    })

}

function rangeSlide(value) {
  if(value == 400) {
        document.getElementById('rangeValue').innerHTML = "Fast";
    }
    else if(value == 800){
        document.getElementById('rangeValue').innerHTML = "Normal";
    }
    else if(value == 1200){
        document.getElementById('rangeValue').innerHTML = "Slow";
    }
    else if(value == 1600){
        document.getElementById('rangeValue').innerHTML = "Dino";
    }
    else if(value == 2000){
        document.getElementById('rangeValue').innerHTML = "Sloth";
    }
   
}
function write_text_in_div(array, typing_speed, starting_index = 0) {
    start_button.disabled = true
    pause.disabled = false;
    let i = starting_index
    let current_index = 0;
    let time = setInterval(() => {

        if (i == array.length) {
            next_input_timer()
            clearInterval(time);
            pause.disabled = true
            resume.disabled = true
            start_button.disabled = false
            const length = document.getElementById("output").innerHTML.replace("<br>","").length
            api("text",document.getElementById("output").innerHTML,length)         
            return
        }
        else {
            if (array[i] == "#") output_text.innerHTML += `<br>`
            else output_text.innerHTML += `${array[i]}`      
        }
        i++;
        
        fast_forward.addEventListener("click", ()=>{
           console.log(array);
          clearInterval(time)
          document.getElementById("output").innerHTML = ""
          document.getElementById("output").innerHTML = array.replace("#","<br>")
          next_input_timer()

          return
        
        })
    }, typing_speed);
    pause.addEventListener("click", () => {
        current_index = i
        console.log(current_index);
        pause.disabled = true
        resume.disabled = false
        clearInterval(time);
        return
    })

}
