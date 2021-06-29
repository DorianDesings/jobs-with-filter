const main = document.getElementById('main');
const filter = document.getElementById('filter');
let tagsInFilter = [];

const drawCardsInDOM = data => {
  const fragment = document.createDocumentFragment();
  for (cardData of data) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.languages = cardData.languages;
    // START CARD HEADER
    const cardHeader = document.createElement('div');
    cardHeader.classList.add('card__header');
    const cardImg = document.createElement('img');
    cardImg.classList.add('card__img');
    cardImg.src = cardData.logo;
    const cardTitle = document.createElement('h2');
    cardTitle.classList.add('card__title');
    cardTitle.textContent = cardData.company;
    cardHeader.appendChild(cardImg);
    cardHeader.appendChild(cardTitle);

    if (cardData.new) {
      const cardNew = document.createElement('span');
      cardNew.classList.add('card__label');
      cardNew.textContent = 'NEW';
      cardHeader.appendChild(cardNew);
    }
    if (cardData.featured) {
      const cardFeatured = document.createElement('span');
      cardFeatured.classList.add('card__label', 'card__label--black');
      cardFeatured.textContent = 'FEATURED';
      cardHeader.appendChild(cardFeatured);
    }
    card.appendChild(cardHeader);
    fragment.appendChild(card);
    // END CARD HEADER

    //START CARD BODY
    const cardBody = document.createElement('div');
    cardBody.classList.add('card__body');
    const cardPosition = document.createElement('p');
    cardPosition.classList.add('card__position');
    cardPosition.textContent = cardData.position;
    const cardInfo = document.createElement('div');
    cardInfo.classList.add('card__info');
    let cardSpan = document.createElement('span');
    cardSpan.classList.add('card__job-info');
    cardSpan.textContent = cardData.postedAt;
    cardInfo.appendChild(cardSpan);
    cardSpan = document.createElement('span');
    cardSpan.classList.add('card__job-info');
    cardSpan.textContent = cardData.contract;
    cardInfo.appendChild(cardSpan);
    cardSpan = document.createElement('span');
    cardSpan.classList.add('card__job-info');
    cardSpan.textContent = cardData.location;
    cardInfo.appendChild(cardSpan);

    cardBody.appendChild(cardPosition);
    cardBody.appendChild(cardInfo);

    card.appendChild(cardBody);

    //END CARD BODY

    //START CARD FOOTER
    const cardFooter = document.createElement('div');
    cardFooter.classList.add('card__footer');
    for (language of cardData.languages) {
      const cardFooterSpan = document.createElement('span');
      cardFooterSpan.classList.add('tag');
      cardFooterSpan.textContent = language;
      cardFooter.appendChild(cardFooterSpan);
    }
    card.appendChild(cardFooter);
    //END CARD FOOTER
  }

  main.appendChild(fragment);
};

const getData = async () => {
  try {
    const request = await fetch('./data/data.json');
    const data = await request.json();
    drawCardsInDOM(data);
  } catch (e) {
    console.log('ERROR', e);
  }
};

getData();

const createTag = title => {
  const fragment = document.createDocumentFragment();
  const tag = document.createElement('div');
  tag.classList.add('tag', 'tag--with-close');
  const tagTitle = document.createElement('div');
  tagTitle.classList.add('tag__title');
  tagTitle.textContent = title;
  const tagClose = document.createElement('img');
  tagClose.classList.add('tag__close');
  tagClose.src = './assets/images/icon-remove.svg';

  tag.appendChild(tagTitle);
  tag.appendChild(tagClose);

  fragment.appendChild(tag);

  filter.appendChild(fragment);
};

const checkCards = () => {
  const allCards = [...document.querySelectorAll('.card')];
  allCards.forEach(card => card.classList.add('card--hide'));

  for (card of allCards) {
    const languages = card.dataset.languages.split(',');

    const validation = tagsInFilter.every(language =>
      languages.includes(language)
    );

    validation && card.classList.remove('card--hide');
  }
};

const removeTags = () => {
  const allFilterTags = [...document.querySelectorAll('.tag--with-close')];

  allFilterTags.forEach(tag => tag.remove());
};

main.addEventListener('click', e => {
  if (e.target.classList.contains('tag')) {
    const tagInUse = tagsInFilter.find(tag => e.target.textContent === tag);
    if (tagInUse === undefined) {
      tagsInFilter.push(e.target.textContent.trim());
      createTag(e.target.textContent);
      checkCards();
    }
  }
});

filter.addEventListener('click', e => {
  if (e.target.classList.contains('filter__clear')) {
    tagsInFilter.length = 0;
    removeTags();
  } else if (e.target.classList.contains('tag__close')) {
    e.target.parentElement.remove();
    tagsInFilter = tagsInFilter.filter(
      tag => tag !== e.target.parentElement.textContent
    );
  }
  checkCards();
});
