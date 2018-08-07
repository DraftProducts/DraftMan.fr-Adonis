window.addEventListener('DOMContentLoaded', function () {
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
    [].forEach.call(document.getElementsByClassName('tags-section'), function (el) {

        const mainInput = document.getElementById('main-input'),
            tags = [];

        let enteredTags = mainInput.value.split(',');
        if (enteredTags.length > 1) {
            enteredTags.forEach(function (t) {
                let filteredTag = filterTag(t);
                if (filteredTag.length > 0)
                    addTag(filteredTag);
            });
            mainInput.value = '';
        }

        mainInput.addEventListener('input', function () {
            let enteredTags = mainInput.value.split(',');
            if (enteredTags.length > 1) {
                enteredTags.forEach(function (t) {
                    let filteredTag = filterTag(t);
                    if (filteredTag.length > 0)
                        addTag(filteredTag);
                });
                mainInput.value = '';
            }
        });

        mainInput.addEventListener('keydown', function (e) {
            let keyCode = e.which || e.keyCode;
            if (keyCode === 8 && mainInput.value.length === 0 && tags.length > 0) {
                removeTag(tags.length - 1);
            }
        });

        function addTag(text) {
            let tag = {
                text: text,
                element: document.createElement('span'),
            };

            tag.element.classList.add('tag');
            tag.element.textContent = tag.text;

            let closeBtn = document.createElement('span');
            closeBtn.classList.add('close');
            closeBtn.addEventListener('click', function () {
                removeTag(tags.indexOf(tag));
            });
            tag.element.appendChild(closeBtn);

            tags.push(tag);

            el.insertBefore(tag.element, mainInput);

            refreshTags();
        }

        function removeTag(index) {
            let tag = tags[index];
            tags.splice(index, 1);
            el.removeChild(tag.element);
            refreshTags();
        }

        function refreshTags() {
            let tagsList = [];
            tags.forEach(function (t) {
                tagsList.push(t.text);
            });
            document.getElementById("hidden-input").value = tagsList.join(',');
        }

        function filterTag(tag) {
            return tag.replace(/[^\w -]/g, '').trim().replace(/\W+/g, '-');
        }
    });
})