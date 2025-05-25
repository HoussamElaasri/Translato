var translator_text = document.getElementsByClassName("translator-container-text")[0]
var translator_image = document.getElementsByClassName("translator-container-image")[0]
var translator_voice = document.getElementsByClassName("translator-container-voice")[0]
var input_text = document.getElementById("input-text")
var output_text = document.getElementById("output-text")

translator_image.style.display = "none"
translator_voice.style.display = "none"

function cleartext(){
    input_text.value = ""
    output_text.value = ""
}

function textTranslator(){
    translator_image.style.display = "none"
    translator_voice.style.display = "none"
    cleartext()
}

function voiceTranslator(){
    translator_image.style.display = "none"
    translator_voice.style.display = "flex"

    cleartext()
}

function imageTranslator(){
    translator_image.style.display = "flex"
    translator_voice.style.display = "none"
    cleartext()
}
