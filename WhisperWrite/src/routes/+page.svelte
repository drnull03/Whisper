<script>
    const generateEmail = () => {
        if(!contextInputValue || !promptInputValue) {
            alert("Input valid data");
            return;
        }
        isGenerating = true;
        email = "";
        fetch("../generate", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ context: contextInputValue, prompt: promptInputValue })
        })
        .then(res => res.json())
        .then(json => {
            isGenerating = false;
            console.log(json);
            if(!json.status) {
                console.log("Something went wrong");
                return;
            }
            contextInputValue = "";
            promptInputValue = "";
            email = json.data?.generatedEmail || "";
        })
        .catch(err => console.log(err));
    }

    let contextInputValue = "";
    let promptInputValue = "";
    let isGenerating = false;

    let email = ``;
</script>

<main class="fs-300">
    <h1>Email generation service w/ DeepSeek API</h1>
    <textarea rows="5" bind:value={contextInputValue} placeholder="Enter context"></textarea>
    <textarea rows="5" bind:value={promptInputValue} placeholder="Enter prompt"></textarea>
    {#if isGenerating}
        <div>
            <p>Generating ...</p>
            <p>It might take a minute, be patient.</p>
        </div>
    {:else}
        <button on:click={generateEmail}>Generate Email</button>
    {/if}
    {#if email}
        <h2>Generated email</h2>
        <textarea rows="20" bind:value={email} placeholder="Email goes here"></textarea>
    {/if}

    <div class="documentation">
        <h2 class="fs-500">API Documentation</h2>
        
        <h3>Endpoint</h3>
        <pre class="fs-xs">POST /generate</pre>
        
        <h3>Request</h3>
        <pre class="fs-xs">&#123
    "context": "string (required) - Context and instructions for email generation",
    "prompt": "string (required) - Specific instructions for the email content"
&#125</pre>

        <h3>Response</h3>
        <pre class="fs-xs">&#123
    "status": "boolean - Indicates success/failure",
    "data": &#123
        "rawCompletion": "object - Full API response from DeepSeek",
        "generatedEmail": "string - The generated email content",
        "usage": "object - Token usage statistics"
    &#125,
    "message": "string - Error message (if status is false)"
&#125</pre>

        <h3>Headers</h3>
        <pre class="fs-xs">Content-Type: application/json</pre>
        
        <h3 class="fs-400">Example Request Body</h3>
        <pre class="fs-xs">&#123
    "context": "You're an email writing specialist, write an email about a subject which the user will provide, do not use placeholders, do not just provide a template, generate a full professional email",
    "prompt": "Write a professional email to a potential client about accepting their project and wanting to move forward with it"
&#125</pre>
    </div>
</main>

<style>
    main {
        padding: 1rem;
        max-width: 600px;
        margin-inline: auto;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .documentation {
        margin-top: 2rem;
        padding-top: 1rem;
        border-top: 1px solid #a1a1a166;
    }

    .documentation h2, .documentation h3 {
        margin: 1rem 0 0.5rem 0;
    }

    pre {
        background-color: #1a1a1a;
        padding: 0.75rem;
        overflow-x: auto;
        border: 1px solid #a1a1a166;
        margin: 0.5rem 0 1rem 0;
    }
</style>