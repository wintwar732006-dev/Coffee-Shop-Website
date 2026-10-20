const filterButtons = document.querySelectorAll(".filter-btn"); 
const card = document.querySelectorAll(".a1stCard"); 

filterButtons.forEach(Buttons =>{
    Buttons.addEventListener('click', () => {
        const selectedCategory = Buttons.getAttribute('data-category'); 

        card.forEach(card => {
            const selectedCard = card.getAttribute('data-category'); 

            if(selectedCategory === 'all'){
                card.style.display = ''; 
            }
            else if(selectedCategory === 'flagship'){
                if(selectedCard === 'flagship'){
                    card.style.display = ''; 
                }
                else{
                    card.style.display = 'none'; 
                }
            }
            else if(selectedCategory === 'concept'){
                if(selectedCard === 'concept'){
                    card.style.display = ''; 
                }
                else{
                    card.style.display = 'none'; 
                }
            }
            else{
                card.style.display = 'none'; 
            }
        });
    });
}); 

let toastTimeout; 

function showToast(){
    const toast = document.getElementById('toastNotification'); 

    //Clear any active timer so rapid clicks do not hide it prematurely
    clearTimeout(toastTimeout); 
    toast.classList.add('show'); 

    //Automatically  hide after 2.5 seconds
    toastTimeout = setTimeout(() => {
        toast.classList.remove('show'); 
    }, 2500); 
}



function copyToClipBoard(text) {
    if(navigator.clipboard && window.isSecureContext ) {
        navigator.clipboard.writeText(text)
        .then(() => {
            showToast(); 
        })
        .catch(err => {
            console.error('Failed to copy: ', err); 
        }); 
    }
    else{
        //Fallback for older browsers or non-HTTPS environments 

        const textArea = document.createElement('textarea'); 
        textArea.value = text; 
        textArea.style.position = 'fixed'; 
        textArea.style.left = '-9999px'; 
        document.body.appendChild(textArea); 
        textArea.focus(); 
        textArea.select(); 
        try{
            document.execCommand('copy'); 
            showToast(); 

        }
        catch (err) {
            console.error('Fallback copy failed: ', err); 

        }
        document.body.removeChild(textArea); 
    };
};

const buttons = document.querySelectorAll(".filter-btn"); 

buttons.forEach(button => {
    button.addEventListener("click", function(){
        buttons.forEach(btn => button.classList.remove("active")); 

        this.classList.add("active"); 
    })
})