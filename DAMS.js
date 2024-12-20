if (window.scriptAlreadyRunning) {
    console.warn("Script is already running! Do not run this script twice in the same session.");
} else {
    window.scriptAlreadyRunning = true;
    
// Version 1.1.4

    let EndMenuBind = false;
    let isInsertKeyPressed = true;
    let menuVisible = true;
    const customWindow = document.createElement("div");

    // Styles and setup for the custom window
    Object.assign(customWindow.style, {
        width: "240px",
        height: "400px",
        backgroundColor: "#3e4a59",
        position: "fixed",
        top: "10%",
        left: "80%",
        border: "10px solid #4b5a67",
        borderRadius: "5px",
        zIndex: 10000,
        display: "flex",
        flexDirection: "column",
        padding: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        overflow: "hidden",
    });

    // fun draggable stuff
    const dragBar = document.createElement("div");
    Object.assign(dragBar.style, {
        height: "20px",
        backgroundColor: "#2c3e50",
        cursor: "move",
        marginBottom: "10px",
        borderRadius: "3px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "#fff",
        fontWeight: "bold",
        userSelect: "none",
    });
    dragBar.textContent = "DAMS Ver 1.1.4";


    let isDragging = false, offsetX = 0, offsetY = 0;
    dragBar.addEventListener("mousedown", (e) => {
        isDragging = true;
        offsetX = e.clientX - customWindow.offsetLeft;
        offsetY = e.clientY - customWindow.offsetTop;
    });
    document.addEventListener("mousemove", (e) => {
        if (isDragging) {
            customWindow.style.left = `${e.clientX - offsetX}px`;
            customWindow.style.top = `${e.clientY - offsetY}px`;
        }
    });
    document.addEventListener("mouseup", () => {
        isDragging = false;
    });

    const areaStyles = {
        width: "100%",
        height: "25%",
        borderRadius: "4px",
        padding: "5px",
        border: "1px solid #ccc",
        resize: "none",
        boxSizing: "border-box",
    };

    const buttonStyles = {
        marginTop: "10px",
        padding: "5px 5px",
        backgroundColor: "#7289da",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        width: "100%",
    };

    function createButton(text, bgColor) {
        const button = document.createElement("button");
        button.textContent = text;
        Object.assign(button.style, buttonStyles, { backgroundColor: bgColor });

        button.addEventListener("mouseover", () => {
            button.style.backgroundColor = "#444";
        });
        button.addEventListener("mouseout", () => {
            button.style.backgroundColor = bgColor;
        });

        return button;
    }

    const toggleCL = createButton("Refresh Channel List", "#ffcc00");
    const messageInput = document.createElement("textarea");
    messageInput.placeholder = "Message to Send \n\n\n\nMade by Github.com/CatchySmile";
    Object.assign(messageInput.style, areaStyles);

    const sendButton = createButton("Send Message", "#7289da");
    const sendMultipleButton = createButton("Send Multiple Messages", "#57b857");

    const delaySlider = document.createElement("input");
    delaySlider.type = "range";
    delaySlider.min = 50;
    delaySlider.max = 1000;
    delaySlider.value = 500;
    delaySlider.addEventListener("input", () => {
        delayLabel.textContent = `Message Delay: ${delaySlider.value}ms`;
    });

    const delayLabel = document.createElement("label");
    delayLabel.textContent = `Message Delay: ${delaySlider.value}ms`;
    Object.assign(delayLabel.style, {
        marginBottom: "1px",
        textAlign: "center",
        padding: "2px",
    });

    const timesInput = document.createElement("input");
    timesInput.type = "number";
    timesInput.min = 1;
    timesInput.max = 9999999;
    timesInput.placeholder = "Times to Send";
    Object.assign(timesInput.style, {
        width: "96%",
        padding: "5px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        marginBottom: "10px",
    });

    // hide toggle
    const hideButton = document.createElement("button");
    hideButton.textContent = "Hide Menu | INS";
    Object.assign(hideButton.style, {
        position: "absolute",
        bottom: "10px",
        right: "10px",
        padding: "5px 10px",
        backgroundColor: "#7289da",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        zIndex: 10001,
    });
    hideButton.addEventListener("click", () => {
        customWindow.style.display = "none";
        menuVisible = false;
    });

    // kill it
    const terminateButton = document.createElement("button");
    terminateButton.textContent = "X";
    Object.assign(terminateButton.style, {
        position: "absolute",
        bottom: "10px",
        left: "10px",
        padding: "5px 10px",
        backgroundColor: "#e74c3c",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        zIndex: 10001,
    });
    terminateButton.addEventListener("click", () => {
        console.log("Menu terminated.");
        customWindow.remove();
        window.scriptAlreadyRunning = false;
    });

    customWindow.append(
        dragBar,
        messageInput,
        sendButton,
        sendMultipleButton,
        delayLabel,
        delaySlider,
        timesInput,
        toggleCL,
        hideButton,
        terminateButton
    );

    document.body.appendChild(customWindow);

    let channelListContainer = null;

    // use token for message purposes
    function getToken() {
        try {
            return (webpackChunkdiscord_app.push([[''], {}, e => { m = []; for (let c in e.c) m.push(e.c[c]) }]), m)
                .find(m => m?.exports?.default?.getToken !== void 0).exports.default.getToken();
        } catch (error) {
            console.error("Error retrieving token:", error);
            return null;
        }
    }

    //Get guild and channel ID
    function getGuildAndChannelFromUrl() {
        const urlParts = window.location.pathname.split("/");
        return { guildId: urlParts[2] || null, channelId: urlParts[3] || null };
    }

    function fetchChannels(guildId) {
        const token = getToken();
        if (!token) {
            console.error("Token not found!");
            return;
        }

        fetch(`https://discord.com/api/v9/guilds/${guildId}/channels`, {
            headers: { authorization: token },
        })
            .then(response => response.json())
            .then(channels => {
                displayChannelList(channels);
            })
            .catch(error => {
                console.error("Error fetching channels:", error);
            });
    }

    function displayChannelList(channels) {
        if (channelListContainer) {
            channelListContainer.remove();
        }

        channelListContainer = document.createElement("div");
        Object.assign(channelListContainer.style, {
            marginTop: "15px",
            color: "#ccc",
            textAlign: "left",
            padding: "10px",
            backgroundColor: "#4b5a67",
            border: "1px solid #ccc",
            maxHeight: "200px",
            overflowY: "auto",
            borderRadius: "5px",
        });

        if (channels.length === 0) {
            channelListContainer.textContent = "No channels found.";
        } else {
            channels.forEach(channel => {
                const channelDiv = document.createElement("div");
                const channelCheckbox = document.createElement("input");
                channelCheckbox.type = "checkbox";
                channelCheckbox.value = channel.id;

                const channelLabel = document.createElement("label");
                channelLabel.textContent = `ID:  ${channel.id} \nNAME:  ${channel.name || "Unnamed Channel"}`;

                channelDiv.append(channelCheckbox, channelLabel);
                Object.assign(channelDiv.style, {
                    padding: "10px 0",
                    borderBottom: "1px solid #666",
                });

                channelListContainer.appendChild(channelDiv);
            });
        }

        customWindow.appendChild(channelListContainer);
    }

    // toggle 
    toggleCL.addEventListener("click", () => {
        const { guildId } = getGuildAndChannelFromUrl();
        if (guildId) {
            fetchChannels(guildId);
        } else {
            console.error("No guild ID found in the URL.");
        }
    });

    // current channel
    function sendMessageToDiscord(channelId, messageContent) {
        const token = getToken();
        if (!token) {
            console.error("Token not found!");
            return;
        }

        fetch(`https://discord.com/api/v9/channels/${channelId}/messages`, {
            method: "POST",
            headers: {
                "Authorization": token,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ content: messageContent }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.id) {
                    console.log(`Message sent to channel ${channelId}: ${messageContent}`);
                } else {
                    console.error("Failed to send message:", data);
                }
            })
            .catch(error => {
                console.error("Error sending message:", error);
            });
    }

    console.warn("Do not run twice in same session.")
    console.log("Made with rage and love by https://github.com/CatchySmile & 2koy");
    
    function sendMessageToSelectedChannels(messageContent, selectedIDs) {
        const { channelId } = getGuildAndChannelFromUrl();

        const channelsToSend = selectedIDs.length > 0 ? selectedIDs : [channelId];

        if (!channelsToSend || channelsToSend.length === 0) {
            console.error("No channels selected or active channel unavailable.");
            return;
        }

        channelsToSend.forEach(channelId => {
            sendMessageToDiscord(channelId, messageContent);
        });
    }

    function sendMultipleMessages(selectedIDs, messageContent, delay, times) {
        const { channelId } = getGuildAndChannelFromUrl();

        const channelsToSend = selectedIDs.length > 0 ? selectedIDs : [channelId];

        if (!channelsToSend || channelsToSend.length === 0) {
            console.error("No channels selected or active channel unavailable.");
            return;
        }

        let count = 0;

        function sendNextMessage() {
            if (count >= times) {
                console.log(`Finished sending ${times} messages.`);
                return;
            }

            channelsToSend.forEach(channelId => {
                sendMessageToDiscord(channelId, messageContent);
            });

            count++;
            setTimeout(sendNextMessage, delay);
        }

        sendNextMessage();
    }

    sendButton.addEventListener("click", () => {
        const messageContent = messageInput.value.trim();
        const selectedIDs = [...document.querySelectorAll("input[type=checkbox]:checked")].map(cb => cb.value);

        if (messageContent) {
            sendMessageToSelectedChannels(messageContent, selectedIDs);
        } else {
            console.error("Message content is empty!");
        }
    });

    sendMultipleButton.addEventListener("click", () => {
        const messageContent = messageInput.value.trim();
        const delay = parseInt(delaySlider.value, 10);
        const times = parseInt(timesInput.value, 10);
        const selectedIDs = [...document.querySelectorAll("input[type=checkbox]:checked")].map(cb => cb.value);

        if (messageContent && times > 0) {
            sendMultipleMessages(selectedIDs, messageContent, delay, times);
        } else {
            console.error("Invalid input for multiple messages!");
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Insert") {
            menuVisible = !menuVisible;
            customWindow.style.display = menuVisible ? "flex" : "none";
            console.log(menuVisible ? "Menu shown" : "Menu hidden");
        } else if (e.key === "End") {
            console.log("Menu terminated.");
            customWindow.remove();
            window.scriptAlreadyRunning = false; 
        }
    });
}
