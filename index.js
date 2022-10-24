
const start_button = document.getElementById("submit_input")
const input_text = document.getElementById("inputs")
const output_text = document.getElementById("output")
const clear_all = document.getElementById("clear")
const pause = document.getElementById("pause")
const resume = document.getElementById("resume")

clear_all.addEventListener("click", () => window.location.reload())


resume.addEventListener("click", () => {
    current_index = document.getElementById("output").innerHTML.replaceAll("<br>","\n").length
    write_text_in_div(text_from_user.split(""), current_index)
    resume.disabled = true
    pause.disabled = false
    return
})


let lines =1;
start_button.addEventListener("click", () => {
    resume.disabled = true;
    document.getElementById("output_container").classList.remove("hidden")
    document.getElementById("timer").classList.remove("hidden")
    document.getElementById("text_area").classList.add("hidden")
    output_text.innerHTML = ""
    text_from_user = input_text.value.replaceAll('\n', '#')
    // console.log(text_from_user.split(""));
    text_from_user.split("").map((x)=>{
        console.log(x);
        if(x=="#") lines++

    })
    console.log(lines);
    
    setTimeout(() => write_text_in_div(text_from_user), 100);
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

function write_text_in_div(array, starting_index = 0) {
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
            api("text",document.getElementById("output").innerHTML)
            
            return
        }
        else {
            if(array[i] == "#") {
                
                output_text.innerHTML += `<br>`
            }
            else {

                output_text.innerHTML += `${array[i]}`
            }
        }
        i++;
    }, 700);

    pause.addEventListener("click", () => {
        current_index = i
        console.log(current_index);
        pause.disabled = true
        resume.disabled = false
        clearInterval(time);
        return
    })

}

const api = (type, text) => {

    const encodedParams = new URLSearchParams();
    encodedParams.append(`${type}`, `${text}`);

const options = {
    method: 'POST',
	headers: {
        'content-type': 'application/x-www-form-urlencoded',
		'X-RapidAPI-Key': 'd25e562c1cmshf8eb607ac286886p11a99bjsn214cfe206f9c',
		'X-RapidAPI-Host': 'text-sentiment.p.rapidapi.com'
	},
	body: encodedParams
};

fetch('https://text-sentiment.p.rapidapi.com/analyze', options)
.then(response => response.json())
.then(data => {
    console.log(data);
    if(!data.lang) {
        
        document.getElementById("analyze").innerHTML = `Number of lines: ${lines} <br> Language: Unkwnown
        <br>Positive: ${data.pos_percent} <br> Neutral: ${data.mid_percent} <br>Negative: ${data.neg_percent}`
    } else {
        document.getElementById("analyze").innerHTML = `Number of lines: ${lines} <br> Language: Unkwnown
        <br>Positive: ${data.pos_percent} <br> Neutral: ${data.mid_percent} <br>Negative: ${data.neg_percent}`

    }
    })
	.catch(err => {
        console.error(err)
        alert("There is error. Please try again")
        window.location.reload()
    });
}