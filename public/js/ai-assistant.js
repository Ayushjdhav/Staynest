document.addEventListener("DOMContentLoaded", () => {
  const widgetToggle = document.getElementById("ai-widget-toggle");
  const chatWindow = document.getElementById("ai-chat-window");
  const chatClose = document.getElementById("ai-chat-close");
  const chatClear = document.getElementById("ai-chat-clear");
  const chatForm = document.getElementById("ai-chat-form");
  const userInput = document.getElementById("ai-user-input");
  const messagesContainer = document.getElementById("ai-messages");
  const suggestionsBar = document.getElementById("ai-suggestions");

  if (!widgetToggle || !chatWindow) return;

  // Detect if user is on a listing details page to pass listingId context
  const pathParts = window.location.pathname.split("/").filter(Boolean);
  let currentListingId = null;
  if (pathParts.length === 2 && pathParts[0] === "listings" && pathParts[1] !== "new") {
    currentListingId = pathParts[1];
    // Add specific chip if on a listing page
    if (suggestionsBar) {
      const listingChip = document.createElement("button");
      listingChip.type = "button";
      listingChip.className = "ai-chip ai-chip-highlight";
      listingChip.dataset.prompt = "Tell me the verified amenities, pricing, and rules for this stay.";
      listingChip.innerHTML = "✨ Ask about this stay";
      suggestionsBar.prepend(listingChip);
    }
  }

  // Toggle chat window open / close
  function toggleChat(forceOpen = null) {
    const isVisible = chatWindow.style.display !== "none";
    const shouldOpen = forceOpen !== null ? forceOpen : !isVisible;

    if (shouldOpen) {
      chatWindow.style.display = "flex";
      widgetToggle.classList.add("is-active");
      userInput.focus();
      scrollChatToBottom();
    } else {
      chatWindow.style.display = "none";
      widgetToggle.classList.remove("is-active");
    }
  }

  widgetToggle.addEventListener("click", () => toggleChat());
  chatClose.addEventListener("click", () => toggleChat(false));

  // Suggestion chips
  if (suggestionsBar) {
    suggestionsBar.addEventListener("click", (e) => {
      const chip = e.target.closest(".ai-chip");
      if (!chip) return;
      const promptText = chip.dataset.prompt;
      if (promptText) {
        userInput.value = promptText;
        submitUserQuery(promptText);
      }
    });
  }

  // Clear chat
  chatClear.addEventListener("click", () => {
    messagesContainer.innerHTML = `
      <div class="ai-msg ai-msg-bot">
        <div class="ai-bubble">
          <p class="mb-1">Chat cleared! What destination or stay can I help you explore today?</p>
          <p class="mb-0 text-muted small">Ask for verified prices, locations, amenities, or capacity.</p>
        </div>
      </div>
    `;
  });

  // Scroll helper
  function scrollChatToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Safe markdown to HTML formatter
  function formatMarkdown(text) {
    if (!text) return "";
    let html = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    // Italics
    html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");
    // Links [text](url)
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="ai-listing-link" target="_self">$1</a>');
    // Bullet points
    html = html.replace(/(?:^|\n)[•-]\s*(.+)/g, '<div class="ai-bullet-item"><i class="fa-solid fa-circle-check text-primary me-1"></i> $1</div>');
    // Numbered lists
    html = html.replace(/(?:^|\n)(\d+)\.\s*(.+)/g, '<div class="ai-numbered-item"><strong>$1.</strong> $2</div>');
    // Line breaks
    html = html.replace(/\n\n/g, "<br><br>").replace(/\n/g, "<br>");

    return html;
  }

  // Append user message bubble
  function appendUserMessage(msg) {
    const userMsgDiv = document.createElement("div");
    userMsgDiv.className = "ai-msg ai-msg-user";
    userMsgDiv.innerHTML = `<div class="ai-bubble">${msg.replace(/</g, "&lt;")}</div>`;
    messagesContainer.appendChild(userMsgDiv);
    scrollChatToBottom();
  }

  // Append loading indicator
  function appendLoadingIndicator() {
    const loaderDiv = document.createElement("div");
    loaderDiv.className = "ai-msg ai-msg-bot ai-loader-msg";
    loaderDiv.id = "ai-active-loader";
    loaderDiv.innerHTML = `
      <div class="ai-bubble">
        <div class="ai-typing-indicator">
          <span></span><span></span><span></span>
        </div>
        <span class="small text-muted ms-2">Checking verified StayNest stays...</span>
      </div>
    `;
    messagesContainer.appendChild(loaderDiv);
    scrollChatToBottom();
  }

  function removeLoadingIndicator() {
    const loader = document.getElementById("ai-active-loader");
    if (loader) loader.remove();
  }

  // Append assistant message with recommendations cards
  function appendBotMessage(replyText, recommendations = []) {
    removeLoadingIndicator();

    const botMsgDiv = document.createElement("div");
    botMsgDiv.className = "ai-msg ai-msg-bot";

    const defaultImg = "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80";
    let cardHtml = "";
    if (recommendations && recommendations.length > 0) {
      cardHtml = `
        <div class="ai-recommendations-carousel mt-2">
          ${recommendations.map(stay => `
            <a href="/listings/${stay._id || stay.id}" class="ai-rec-card d-block p-2 border rounded-3 text-decoration-none mb-2 bg-white">
              <div class="d-flex align-items-center gap-2">
                <img src="${stay.image?.url || stay.images?.[0]?.url || defaultImg}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;" alt="${stay.title}" onerror="this.src='${defaultImg}'">
                <div class="ai-rec-info flex-grow-1">
                  <div class="fw-bold small text-truncate text-dark" style="max-width: 200px;">${stay.title}</div>
                  <div class="small text-primary fw-bold">₹${(stay.price || 0).toLocaleString("en-IN")} <span class="text-muted fw-normal">/ night</span></div>
                </div>
              </div>
            </a>
          `).join("")}
        </div>
      `;
    }

    botMsgDiv.innerHTML = `
      <div class="ai-bubble">
        <div class="ai-text-content">${formatMarkdown(replyText)}</div>
        ${cardHtml}
      </div>
    `;

    messagesContainer.appendChild(botMsgDiv);
    scrollChatToBottom();
  }

  // Form submit handler
  async function submitUserQuery(text) {
    if (!text || !text.trim()) return;
    const query = text.trim();
    userInput.value = "";

    appendUserMessage(query);
    appendLoadingIndicator();

    try {
      const response = await fetch("/api/v1/ai/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          listingId: currentListingId,
        }),
      });

      const data = await response.json();
      if (response.ok && data.reply) {
        appendBotMessage(data.reply, data.recommendations || []);
      } else {
        removeLoadingIndicator();
        appendBotMessage(data.reply || data.message || "I apologize, but I could not retrieve verified listing data at this moment. Please try again.");
      }
    } catch (err) {
      removeLoadingIndicator();
      appendBotMessage("Connection interrupted. Please ensure the server is active and try again.");
    }
  }

  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    submitUserQuery(userInput.value);
  });
});
