const messagesDiv = document.getElementById("messages");
const socket = new WebSocket("ws://192.168.0.74:9000");

socket.onopen = (event) => {
    console.log("Connection established");
}

socket.onclose = (event) => {
    if (event.wasClean) {
        // Clean disconnection, no error
        console.log(`Connection closed cleanly, code: ${event.code}, reason: ${event.reason}`);
    } else {
        // Sudden disconnection or error
        console.error(`Connection closed unexpectedly, code: ${event.code}, reason: ${event.reason}`);
    }
};


socket.onmessage = (event) => {
    const documents = JSON.parse(event.data);

    messagesDiv.innerHTML = '';

    documents.forEach((documentData, index) => {
        const cardDiv = document.createElement("div");
        cardDiv.className = "card mb-3";

        const cardBodyDiv = document.createElement("div");
        cardBodyDiv.className = "card-body";

        const cardTitle = document.createElement("h5");
        cardTitle.className = "card-title";
        cardTitle.textContent = `Ticket ${index + 1}`;

        cardBodyDiv.appendChild(cardTitle);

        // Create an unordered list for document fields
        const fieldList = document.createElement("ul");
        fieldList.className = "list-group";

        for (const key in documentData) {
            if (key !== "id") {
                const listItem = document.createElement("li");
                listItem.className = "list-group-item";
                listItem.innerHTML = `<strong>${key}:</strong> ${documentData[key]}`;
                fieldList.appendChild(listItem);
            }
        }

        cardBodyDiv.appendChild(fieldList);

        // Create a form for deletion
        const deleteForm = document.createElement("form");
        deleteForm.style.display = "inline";
        const deleteButton = document.createElement("button");
        deleteButton.className = "btn btn-danger";
        deleteButton.type = "button";
        deleteButton.textContent = "🗑";
        deleteButton.addEventListener("click", () => {
            const documentId = documentData.id; // Replace 'id' with the actual key used for document IDs
            socket.send(JSON.stringify({ action: "delete", id: documentId }));
        });
        deleteForm.appendChild(deleteButton);

        cardBodyDiv.appendChild(deleteForm);

        cardDiv.appendChild(cardBodyDiv);
        messagesDiv.appendChild(cardDiv);
    });
};

function sendDataToServer() {
    const form = document.getElementById("todo-form");

    const formData = new FormData(form);
    const formDataObject = {};

    formData.forEach((value, key) => {
        formDataObject[key] = value;
    });

    const now = new Date();
    formDataObject["timestamp"] = now.toLocaleString();

    formDataObject["Author"] = "Marco";

    formDataObject["id"] = Math.random().toString(36).substr(2, 9);

    const jsonData = JSON.stringify(formDataObject);

    socket.send(jsonData);
    form.reset();
}
