import hiragana from './hiragana.json' assert {type: 'json'};

// set some constants for colors
const primaryColor = "#007bff";
const white = "rgb(255,255,255)";

let picked = new Set(); // store all types picked

window.onload = function() {
    // parse the hiragana json, creating a button for each type

    let selectGroupsDiv = document.getElementById("selectGroups");

    for(let i=0;i<hiragana.groups.length;i++) {
        // iterate over all the groups

        let group = hiragana.groups[i];
        
        // create button
        let select = document.createElement("span");
        select.className = "selectLetter col-md-4";
        select.id = i; // name the id using the index
        select.value = false;
        select.style.cursor = "pointer";

        // when the button is clicked, opposite the value and change the colors

        select.onclick = () => {
            let self = document.getElementById(select.id);
            if (select.value == false) {
                // set it to true
                picked.add(self.id); // add the group to the set
                self.style.backgroundColor = primaryColor;
                self.style.color = white;
            } else {
                // set it to false
                picked.delete(self.id); // remove the group from the set
                self.style.backgroundColor = white;
                self.style.color = primaryColor;
            }

            self.value = !self.value; // switch the values
        };

        select.innerHTML = group.header;

        // render the button to the screen
        selectGroupsDiv.appendChild(select);
    }
}

function startMultipleChoice() {
    if(picked.size > 0) {
        // store the "picked" var values to localstorage
        let str = "";
        picked.forEach(groupIdx => {
            str += groupIdx + ";" // separated by ";", eg: "2;3;"
        });
        localStorage['picked'] = str;
    
        // redirect to multiple-choice.html
        window.location.href = "./multiple-choice.html";
    } else {
        // warn the user to pick
        alert("Make a selection to continue");
    }
}

document.getElementById("multipleChoiceButton").addEventListener("click", startMultipleChoice);

