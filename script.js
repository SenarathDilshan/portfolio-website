const chatbotToggler = document.getElementById('chatbot-toggler');
const chatbot = document.querySelector('.chatbot');
const closeBtn = document.getElementById('close-btn');
const chatbox = document.querySelector('.chatbox');


chatbotToggler.addEventListener('click', () => {
  document.body.classList.toggle('show-chatbot');
});

closeBtn.addEventListener('click', () => {
  document.body.classList.remove('show-chatbot');
});


document.getElementById('send-btn').addEventListener('click', function(event) {
  event.preventDefault();

  const input = document.getElementById('chat-input').value;

  // Display the user's message in the chatbox
  const userMessage = document.createElement('li');
  userMessage.className = 'chat-outgoing';
  userMessage.innerHTML = `<p>${input}</p>`;
  chatbox.appendChild(userMessage);

  // Display a waiting message
  const waitingMessage = document.createElement('li');
  waitingMessage.className = 'chat-incoming';
  waitingMessage.innerHTML = `<span><i class="fa-solid fa-robot"></i></span><p>Processing...</p>`;
  chatbox.appendChild(waitingMessage);

  // First API call
  fetch('https://dilshansenarath-llm2.hf.space/gradio_api/call/predict', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      data: [input]
    })
  })
  .then(response => response.json())
  .then(data => {
    const eventId = data.event_id; // Assuming the response contains an event_id

    // Second API call using the event_id
    fetch(`https://dilshansenarath-llm2.hf.space/gradio_api/call/predict/${eventId}`)
      .then(response => response.text())
      .then(htmlContent => {
        // Extract the message from the response
        const messageMatch = htmlContent.match(/data:\s*\[\"(.*?)\"\]/);
        let message = '';
        if (messageMatch && messageMatch[1]) {
          message = messageMatch[1];
        }

        // Remove the waiting message
        chatbox.removeChild(waitingMessage);

        // Display the bot's response in the chatbox
        const botMessage = document.createElement('li');
        botMessage.className = 'chat-incoming';
        botMessage.innerHTML = `<span><i class="fa-solid fa-robot"></i></span><p>${message}</p>`;
        chatbox.appendChild(botMessage);
        console.log(botMessage);
        console.log(message);
      })
      .catch(error => {
        // Remove the waiting message
        chatbox.removeChild(waitingMessage);

        const errorMessage = document.createElement('li');
        errorMessage.className = 'chat-incoming';
        errorMessage.innerHTML = `<span><i class="fa-solid fa-robot"></i></span><p>Error: ${error}</p>`;
        chatbox.appendChild(errorMessage);
      });
  })
  .catch(error => {
    // Remove the waiting message
    chatbox.removeChild(waitingMessage);

    const errorMessage = document.createElement('li');
    errorMessage.className = 'chat-incoming';
    errorMessage.innerHTML = `<span><i class="fa-solid fa-robot"></i></span><p>Error: ${error}</p>`;
    chatbox.appendChild(errorMessage);
  });

  // Clear the input field
  document.getElementById('chat-input').value = '';
});
