const socket = io()

socket.on("message", (message) => {
    console.log(message);
})

//Chat elements
const $messageForm = document.querySelector("#message-form")
const $sendMessageButton = document.querySelector("#send-message")
const $messageInput = document.querySelector("#message")
const $messages = document.querySelector("#messages")

//Templates
const messageTemplate = document.querySelector("#message-template").innerHTML

//Location elements
const $sendLocationButton = document.querySelector("#send-location")

$messageForm.addEventListener("submit", (e) => {
    e.preventDefault()
    
    socket.emit("sendMessage", $messageInput.value, (error) => {
        $sendMessageButton.removeAttribute("disabled")
        $messageInput.value = ""
        $messageInput.focus()
        if (error) {
            return console.log(error)
        }
        console.log("The message was delivered!")
    })   
})

socket.on("broadcastMessage", (message) => {
    console.log(message);
    const html = Mustache.render(messageTemplate, {message})
    $messages.insertAdjacentHTML("beforeend", html)
})

$sendLocationButton.addEventListener("click", () => {
    if (!navigator.geolocation) {
        return alert("Geolocation not supported")
    }

    $sendLocationButton.setAttribute("disabled", "disabled")

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit("sendLocation", {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            $sendLocationButton.removeAttribute("disabled")
            console.log("Location shared!")
        })
    })
})