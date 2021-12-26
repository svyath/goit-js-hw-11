import './sass/main';
import API_service from './PixabayAPI';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

const Pixabay = new API_service();
const lightbox = new SimpleLightbox('.gallery a');
let counter = 0;

const searchRequest = event => {
  event.preventDefault();
  Pixabay.searchQuery = event.currentTarget.elements.searchQuery.value;

  if (Pixabay.searchQuery.trim() === '') {
    loadMoreBtn.classList.add('hidden');
    return Notify.failure('Search field can not be empty!');
  } else {
    gallery.innerHTML = '';
    Pixabay.resetPage();
    Pixabay.fetchData().then(({ totalHits, hits }) => {
      counter += hits.length;
      if (totalHits === 0) {
        return Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.',
        );
      } else {
        renderData(hits);
        lightbox.refresh();
        loadMoreBtn.classList.remove('hidden');

        return Notify.success(`Hooray! We found ${totalHits} images.`);
      }
    });
  }
};

searchForm.addEventListener('submit', searchRequest);

const renderData = array => {
  const renderedItems = array.map(item => {
    return `<div class="photo-card">
    <a href=${item.largeImageURL}><img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" /></a>
    <div class="info">
      <p class="info-item">
        <b>Likes </b> <span>${item.likes}</span>
      </p>
      <p class="info-item">
        <b>Views </b> <span>${item.views}</span>
      </p>
      <p class="info-item">
        <b>Comments </b> <span>${item.comments}</span>
      </p>
      <p class="info-item">
        <b>Downloads </b> <span>${item.downloads}</span>
      </p>
    </div>
  </div>`;
  });
  gallery.insertAdjacentHTML('beforeEnd', renderedItems);
};

const loadMoreData = () => {
  Pixabay.fetchData().then(({ totalHits, hits }) => {
    renderData(hits);
    lightbox.refresh();
    counter += hits.length;
    pageScroll();
    if (counter >= totalHits) {
      Notify.warning('We are sorry, but you have reached the end of search results.');
      loadMoreBtn.classList.add('hidden');
    }
  });
};

loadMoreBtn.addEventListener('click', loadMoreData);

const pageScroll = () => {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
};