const uiChips = document.getElementById("ui-chips");

const toolbar = document.getElementById("toolbar");
const toolbarBtnCopy = document.getElementById("toolbar-btn-copy");
const toolbarBtnDelete = document.getElementById("toolbar-btn-delete");

const chipsContainer = document.getElementById("chips-container");

//chipsHiddenInput is not required, you'll need it if you want to send data using form
//<input id="chips-hidden-input" type="hidden" name="chips">
const chipsInput = document.getElementById("chips-input");
const chipsHiddenInput = document.getElementById("chips-hidden-input");

const chipsCounter = document.getElementById("chips-counter");

const chipsUIElements = [];
const chips = [];



chipsInput.addEventListener("input", () => {
	if (chipsInput.value.indexOf(",") != -1){
		let slices = chipsInput.value.split(",");

		slices.map( slice => addTag(slice.trim()) );
	}
});


toolbarBtnCopy.addEventListener("click", (e) => {
	//prevent focus on chips text input
	e.stopPropagation();

	let tempInput = document.createElement("input");
	tempInput.style.opacity = 0;
	tempInput.value = chipsHiddenInput.value;
	document.body.append(tempInput);

	tempInput.select();
	document.execCommand("copy");

	document.body.removeChild(tempInput);

	Animate(uiChips, "CopyToClipboardAnim", "600ms", "ease-out");

});


toolbarBtnDelete.addEventListener("click", (e) => {
	//prevent focus on chips text input
	e.stopPropagation();

	while (chipsContainer.hasChildNodes()){
		chipsContainer.lastChild.removeEventListener("click", removeTag);
		chipsContainer.removeChild(chipsContainer.lastChild);
	}

	let count = chips.length;
	chipsUIElements.splice(0, count);
	chips.splice(0, count);

	hideToolbar();
});


uiChips.addEventListener("click", () => {
	chipsInput.focus();
});


function addTag(chipText){
	let chipIndex = chips.indexOf(chipText);
	if ( chipIndex != -1){
		//tag already exists
		Animate(chipsUIElements[chipIndex], "AlreadyExistErrorTagAnim", "1.5s", "ease-out");
		Animate(uiChips, "AlreadyExistErrorInputAnim", "600ms", "ease-out");
		chipsInput.value = chipText;
		return;
	}

	if (chipText.length > 0){
		let chipUI = document.createElement("div");
		chipUI.className = "chip"; 

		let chipTextUI = document.createElement("span");
		chipTextUI.append(chipText);
		chipUI.append(chipTextUI);

		let chipButtonUI = document.createElement("button");
		chipButtonUI.addEventListener("click", removeTag);
		chipUI.append(chipButtonUI);

		chipsContainer.append(chipUI);

		chipsUIElements.push(chipUI);
		chips.push(chipText);

		updateHiddenInputData();
		updateCounterUI();

		chipsInput.value = "";
	}

	if (chips.length > 0)
		showToolbar();
}

function removeTag(e){
	e.target.removeEventListener("click", removeTag);

	let chipText = e.target.previousSibling.textContent;

	let index = chips.indexOf(chipText);
	chipsContainer.removeChild(e.target.parentNode);
	chipsUIElements.splice(index, 1);
	chips.splice(index ,1);

	updateHiddenInputData();
	updateCounterUI();

	if (chips.length == 0)
		hideToolbar();
}

function updateCounterUI(){
	chipsCounter.innerText = chips.length;
}

function updateHiddenInputData(){
	chipsHiddenInput.value = chips.join(",");
}

function showToolbar(){
	toolbar.style.display = "flex";
} 

function hideToolbar(){
	toolbar.style.display = "none";
} 

function Animate(element, animName, duration, ease="linear"){
	element.style.animation = "none";
	setTimeout(()=>{ element.style.animation = `${animName} ${ease} ${duration}`; },0);
}





// Testing functions ------------------------------------------


function generateRandomChipsForTesting(){
	addTag("Hello world!");
	addTag("Bonjour");
	addTag("Hola");
	addTag("Esta bueno");
}
generateRandomChipsForTesting();