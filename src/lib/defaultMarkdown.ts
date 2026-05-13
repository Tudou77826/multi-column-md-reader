export const defaultMarkdown = `
# The Architecture of Tomorrow

<span class="text-[11px] font-bold uppercase tracking-[0.3em] text-[hsl(var(--muted-foreground))] mb-4 block">Draft #04 — Design Essay</span>

The digital landscape is undergoing a silent transformation. We are moving away from the cluttered interfaces of the past decade toward a more intentional, editorial approach to content consumption.

Markdown has become the lingua franca of this movement. Its simplicity allows the writer to focus purely on the structural integrity of the message, leaving the presentation to be handled by sophisticated rendering engines that honor the legacy of print media.

## I. The Grid System

As we observe in classical layout design, the use of a strict grid provides a sense of comfort and predictability. In a multi-column reader, the vertical rhythm is preserved, allowing the eye to scan text without the fatigue associated with long line lengths.

Modern typography on the web now rivals the quality of traditional offset printing. With the advent of variable fonts and advanced CSS properties like \`shape-outside\` and \`text-wrap: balance\`, the web is finally becoming a first-class medium for long-form reading.

> "Design is not just what it looks like and feels like. Design is how it works in the context of the human mind."

By treating digital documents as physical objects, we respect the user's attention. The lack of distracting animations and the focus on high-contrast, legible type is a rebellion against the attention economy that defines much of our contemporary experience.

---

### II. Typographic Rhythm

Lists and syntax elements should support, rather than break, vertical rhythm:

- **Hierarchy:** Establish clear relationships between primary, secondary, and tertiary elements.
- **Contrast:** Utilize weight, size, and style to differentiate structural components.
- **Whitespace:** Emptiness is an active structural element, not simply the absence of content.

\`\`\`css
/* Minimalist Typographic Rules */
body {
  font-family: var(--font-serif);
  line-height: 1.7;
}

pre, code {
  font-family: var(--font-mono);
  font-size: 0.9em;
}
\`\`\`

| Attribute     | Classical Setting | Digital Equivalent |
| ------------- | :------------- | :---------------- |
| Margins       | Golden Ratio | vw/vh CSS units |
| Leading       | 1.2 to 1.5 | 1.6 to 1.8 |
| Tracking      | Modest | Letter-spacing |

### III. Complex Data & Diagrams

We commonly need to understand the relationships between different data points. Here is a large table summarizing browser statistics:

| Browser | Engine | Developer | CSS Support | JavaScript Engine | Market Share | Notes |
|---------|--------|-----------|-------------|-------------------|--------------|-------|
| Chrome  | Blink  | Google    | Excellent   | V8                | ~65%         | Standard setting browser for modern web APIs. |
| Safari  | WebKit | Apple     | Good        | JavaScriptCore    | ~18%         | Deeply integrated into the Apple ecosystem. |
| Edge    | Blink  | Microsoft | Excellent   | V8                | ~5%          | Default on Windows, strong enterprise adoption. |
| Firefox | Gecko  | Mozilla   | Excellent   | SpiderMonkey      | ~3%          | Champion of privacy and open web standards. |

And visualizing complex architectures requires diagramming tools like Mermaid:

\`\`\`mermaid
flowchart TD
    A[Client Request] -->|REST API| B(Load Balancer)
    B --> C{Web Server}
    C -->|Static Assets| D[CDN]
    C -->|Dynamic Data| E[App Server]
    E --> F[(Primary Database)]
    E -.->|Cache| G[Redis Cluster]
    F --> H[(Read Replica)]
\`\`\`

As we continue to build tools for thought, reading, and publishing, let us remember that formatting is transient, but the structure is enduring.
`;
