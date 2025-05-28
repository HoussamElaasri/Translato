var translator_text = document.getElementsByClassName("translator-container-text")[0]
var translator_image = document.getElementsByClassName("translator-container-image")[0]
var translator_voice = document.getElementsByClassName("translator-container-voice")[0]
var input_text = document.getElementById("input-text")
var output_text = document.getElementById("output-text")
const voiceRecorder = document.getElementById("voiceRecorder")



let recognition
let isRecognitionInitialized = false



input_text.setAttribute("onkeyup", "apitranslate()")
input_text.placeholder = "Type here..."
translator_image.style.display = "none"
translator_voice.style.display = "none"




async function translateMyMemory(text, fromLang, toLang) {
    const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${fromLang}|${toLang}`)
    const data = await response.json()
    return data.responseData.translatedText
}

async function apitranslate() {
    let input_lang_option = document.getElementById("input_lang_option").value
    let output_lang_option = document.getElementById("output_lang_option").value

    if (output_lang_option == "ar") {
        output_text.style.textAlign = "right"
    }
    else {
        output_text.style.textAlign = "left"
    }
    if (input_lang_option == "ar") {
        input_text.style.textAlign = "right"
    }
    else {
        input_text.style.textAlign = "left"
    }
    var input_val = input_text.value
    const translated = await translateMyMemory(input_val, input_lang_option, output_lang_option)
    output_text.value = translated
    console.log("apitranslate called")

    

}

document.getElementById("output_lang_option").addEventListener("change", () => {
    apitranslate()
})


function cleartext() {
    input_text.value = ""
    output_text.value = ""
}

function textTranslator() {
    translator_image.style.display = "none"
    translator_voice.style.display = "none"
    input_text.placeholder = "Type here..."
    input_text.setAttribute("onkeyup", "apitranslate()")
    cleartext()
}




function voiceTranslator() {
    translator_image.style.display = "none"
    translator_voice.style.display = "flex"
    input_text.placeholder = "Modify text..."
    cleartext()

    input_text.removeAttribute("onkeyup")

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    if (!recognition) recognition = new SpeechRecognition()


    let input_lang_option = document.getElementById("input_lang_option").value

    recognition.lang = input_lang_option
    console.log("language selected : " + recognition.lang)

    recognition.interimResults = true
    recognition.continuous = false

    recognition.onstart = () => {
        console.log("REC START")
    }
    recognition.onend = () => {
        console.log("REC END")
    }


    recognition.onresult = (event) => {
        var transcript = event.results[0][0].transcript
        console.log("CONTENT:", transcript)
        input_text.value = transcript
        apitranslate()

    }
    recognition.onerror = (event) => {
        console.log("Error in voice recognition: " + event.error)
    }



    voiceRecorder.addEventListener("click", async () => {
        const ok = await checkMicrophonePermission()
        if (!ok) return

        let input_lang_option = document.getElementById("input_lang_option").value

        switch (input_lang_option) {
            case "en":
                recognition.lang = "en-US"
                break
            case "fr":
                recognition.lang = "fr-FR"
                break
            case "ar":
                recognition.lang = "ar-SA"
                break
            default:
                recognition.lang = "en-US"
        }

        recognition.start()
    })
}




async function checkMicrophonePermission() {
    try {
        const status = await navigator.permissions.query({ name: 'microphone' })
        if (status.state === 'denied') {
            alert('Please enable the microphone from browser settings.')
            return false
        }
        return true
    } catch (err) {
        return true
    }
}


function imageTranslator() {
    translator_image.style.display = "flex"
    translator_voice.style.display = "none"
    input_text.placeholder = "Modify text..."
    let status = document.getElementById("uploadText")
    status.innerText = "Click to upload an image"

    cleartext()
    const imageinput = document.getElementById("imageUpload")
    
    imageinput.onchange = () => {
        if (!imageinput.files.length) {
            alert("Please upload an image")
            return
        }
        
        let language = document.getElementById("input_lang_option").value
        var lang
        switch(language){
            case "en":
                lang = "eng"
                break
            
            case "fr":
                lang = "fra"
                break
            
            case "ar":
                lang = "ara"
                break
            default :
                alert("you should choose a language !")
                return
       }
        console.log(`lang est : ${lang}`)
        const image = imageinput.files[0]

        Tesseract.recognize(
            image,
            lang,
            {
                logger: m => status.textContent = `${Math.round(m.progress * 100)}%`
            }
        ).then(({ data: { text } }) => {
            input_text.value = text
            status.textContent = "Done!, Click to upload an image"
            apitranslate()
        }).catch(err => {
            status.textContent = "Error, Click to upload an image " + err.message
        })
    }

}




document.getElementById("swapbtn").addEventListener("click", () => {
    
    const inputLang = document.getElementById("input_lang_option")
    const outputLang = document.getElementById("output_lang_option")
    const tempLang = inputLang.value
    inputLang.value = outputLang.value
    outputLang.value = tempLang

    
    const tempText = input_text.value
    input_text.value = output_text.value
    output_text.value = tempText

    
})






