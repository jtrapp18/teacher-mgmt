function createTabMenuListener(){
    const tabMenu = document.querySelector('.tab-names');
    tabMenu.addEventListener("click", handleTabSelectionEvent)
}

function handleTabSelectionEvent(e){
    //only listen to clicks within an h2 element
    if(e.target.tagName == "H2"){
        switchToTab(e.target.innerText)
    }    
}

function switchToTab(tabName){
    const activeTabName = document.querySelector('.tab-names h2.active-tab');
    activeTabName.classList.remove('active-tab')
    
    const activeTabContent = document.querySelector(`#${activeTabName.innerText.toLowerCase()}`);
    activeTabContent.classList.remove('active-tab')

    const selectedTabName = document.querySelector(`.tab-names h2[data-name="${tabName.toLowerCase()}"]`);
    selectedTabName.classList.add('active-tab');
    
    const selectedTabContent = document.querySelector(`#${tabName.toLowerCase()}`);
    selectedTabContent.classList.add('active-tab')    
}

window.onload = function () {
    const images = ['classroom', 'library', 'books_stacked', 'desk'];
    let index = 0;
    
    function change() {
        const imgElement = document.querySelector('#home img');
        imgElement.src = `./img/home/${images[index]}.jpg`;
        index > 2 ? index = 0 : index++;
    }

    setInterval(change, 5000);
};

function addScrollEvents() {
    document.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        const scrollPosition = window.scrollY;
    
        if (scrollPosition > 100) { // Adjust the threshold as needed
        header.classList.add('minimized');
        } else {
        header.classList.remove('minimized');
        }
    })
}

createTabMenuListener()
addScrollEvents();
