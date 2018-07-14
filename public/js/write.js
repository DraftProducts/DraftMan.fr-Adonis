const simplemde = new SimpleMDE({ 
    element: document.getElementById("markdown"),
    autosave: {
        enabled: true,
        uniqueId: "writer_mde",
        delay: 1000,
    },
    showIcons: ["code", "table","horizontal-rule","strikethrough"],
    hideIcons: ["heading"],
    spellChecker: false,
    renderingConfig: {
        singleLineBreaks: false,
        codeSyntaxHighlighting: true
     }
});