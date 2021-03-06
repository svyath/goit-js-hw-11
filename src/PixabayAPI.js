const axios = require('axios');
const API_KEY = '24968349-1653370cf59648d875f9b5b88';
const imageType = 'photo';
const orientation = 'horizontal';
const safeSearch = true;

export default class API_service {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.imagePerPage = 40;
  }

  async fetchData() {
    const response = await axios.get(
      `https://pixabay.com/api/?key=${API_KEY}&q=${this.searchQuery}&image_type=${imageType}&orientation=${orientation}&safesearch=${safeSearch}&page=${this.page}&per_page=${this.imagePerPage}`,
    );
    this.page += 1;
    return response.data;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
