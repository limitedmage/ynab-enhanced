var originalentries = null;

function ynabEnhancedAutocomplete() {
    var prevTxt = null;
    var input = document.createElement("input");
    input.type = "text";
    input.name = "autocomplete-move-money";
    input.id = "autocomplete-move-money";
    input.className = "autocomplete-move-money";
    input.title = "Search for a category";
    var dropdown = document.getElementsByClassName("options-shown")[0];
    var selectLabel = document.getElementsByClassName("ynab-select-label")[0];
    selectLabel.className = selectLabel.className + " autocomplete-override";
    var list = document.getElementsByClassName("ynab-select-options");
    var options = document.getElementsByClassName("is-selectable");
    o = options.length;
    for (var i = 0; i < o; i++) {
        var option = options[i];
        option.tabIndex = 0;
        option.onkeydown = function(event) {
            var e = event || window.event;
            if (e.keyCode == 40 && e.target.nextElementSibling != null) {
                e.target.nextElementSibling.focus();
            } else if (e.keyCode == 38 && e.target.previousElementSibling != null) {
                e.target.previousElementSibling.focus();
            } else if (e.keyCode == 13) {
                e.stopPropagation();
                e.preventDefault();
                e.target.click();
            }
        }
    }
    dropdown.insertBefore(input, list[0]);
    var label = document.createElement("label");
    label.setAttribute("for", "autocomplete-move-money");
    label.innerHTML = "Search:";
    label.id = "autocomplete-label";
    dropdown.insertBefore(label, input);
    input.focus();
    var txt = document.getElementsByName('autocomplete-move-money');
    if (txt != null) {
        txt[0].onkeyup = function(event) {
            var e = event || window.event;
            if (e.keyCode == 40) {
                document.getElementsByClassName("is-selectable")[0].focus();
            }
            var curTxt = txt[0].value;
            ynabEnhancedAutocompleteHandleKeyPress(prevTxt, curTxt);
            prevTxt = curTxt;
            return true;
        }
        txt[0].onkeydown = function(event) {
            var e = event || window.event;
            if (e.keyCode == 13) {
                e.stopPropagation();
                e.preventDefault();
                document.getElementsByClassName("is-selectable")[0].click();
                document.getElementsByClassName('modal-budget-move-money')[0].getElementsByClassName('button-primary')[0].click();
            }
            return true;
        }
    }
    setTimeout(ynabEnhancedAutocompleteRemoved, 250);
}

function ynabEnhancedAutocompleteFocus() {
    var selectLabel = document.getElementsByClassName("ynab-select")[0];
    selectLabel.className += " autocomplete-focus";
    selectLabel.onfocus = function(event) {
        event.target.click();
    }
}

function ynabEnhancedAutocompleteHandleKeyPress(oldVal, newVal) {
    var components = document.getElementsByClassName('ynab-select-options');
    var select = components[0];

    if (originalentries === null) {
        originalentries = new Array();
        for (c = 0; c < select.children.length; c++) {
            originalentries.push(select.children[c]);
        }
    }

    if (oldVal !== null && (newVal.length < oldVal.length)) {
        for (c = 0; c < originalentries.length; c++) {
            select.appendChild(originalentries[c]);
        }
    }

    var parts = newVal.split(' ');

    var toremove = new Array();
    for (i = 0; i < select.children.length; i++) {
        var entry = select.children[i];
        var match = true;
        var entryTxt = entry.innerText;
        for (p = 0; p < parts.length; p++) {
            var part = parts[p].toUpperCase();
            if (entryTxt.toUpperCase().lastIndexOf(part) < 0) {
                match = false;
                break;
            }
        }

        if (match == false) {
            toremove.push(entry);
        }
    }

    if (toremove != null) {
        for (t = 0; t < toremove.length; t++) {
            var entryTxt = toremove[t].text;
            select.removeChild(toremove[t]);
        }
    }
}

function ynabEnhancedAutocompleteInit() {
    var dialog = document.getElementsByClassName('ynab-select-options');
    var label = document.getElementsByClassName('ynab-select-label');
    var focus = document.getElementsByClassName('autocomplete-focus');
    if (label.length > 0 && focus.length == 0) {
        ynabEnhancedAutocompleteFocus();
    }
    if (dialog.length > 0) {
        ynabEnhancedAutocomplete();
    } else {
        setTimeout(ynabEnhancedAutocompleteInit, 250);
    }
}

function ynabEnhancedAutocompleteRemoved() {
    var autocomplete = document.getElementsByClassName('autocomplete-move-money');
    if (autocomplete.length == 0) {
        var selectLabel = document.getElementsByClassName("ynab-select-label")[0];
        if (selectLabel != undefined) {
            selectLabel.className = "ynab-select-label";
        }
        setTimeout(ynabEnhancedAutocompleteInit, 250);
    } else {
        setTimeout(ynabEnhancedAutocompleteRemoved, 250);
    }
}

function ynabEnhancedAutocompleteSelectOption(target) {
    target.click();
}

setTimeout(ynabEnhancedAutocompleteInit, 250);
