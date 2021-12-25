import './sass/main';
import API_service from './PixabayAPI';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';

const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

const Pixabay = new API_service();

//loadMoreBtn.addEventListener('click', loadMoreData);

const searchRequest = event => {
  event.preventDefault();
  Pixabay.searchQuery = event.currentTarget.elements.searchQuery.value;

  if (Pixabay.searchQuery.trim() === '') {
    loadMoreBtn.classList.add('hidden');
    return Notify.failure('Search field can not be empty!');
  } else {
    Pixabay.fetchData().then(({ totalHits, hits }) => {
      if (totalHits === 0) {
        return Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.',
        );
      } else {
        renderData(hits);
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
