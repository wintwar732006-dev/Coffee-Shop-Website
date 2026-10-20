const cards = document.querySelectorAll('.Graphof3Section_1'); 
let currentIndex = 0; 

function slideNextCard() {
    const currentCard = cards[currentIndex]; 

    currentCard.classList.remove('active'); 
    currentCard.classList.add('prev'); 

    currentIndex = (currentIndex + 1) % cards.length; 
    const nextCard = cards[currentIndex]; 

    nextCard.classList.remove('prev'); 
    nextCard.classList.add('active'); 

    setTimeout(() =>{
        currentCard.classList.remove('prev'); 
    }, 700); 
}
    setInterval(slideNextCard, 4000); 