const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');

let bookmarks = {};


// Show Modal, Focus on Input
function showModal() {
   modal.classList.add('show-modal');
   websiteNameEl.focus();
}


// Validate Form
function validateUrl(nameValue, urlValue) {
   const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
   const regex = new RegExp(expression);

   if(!nameValue || !urlValue) {
      alert('Please submit values for both fields');
      return false;
   }

   if(!urlValue.match(regex)) {
      alert('Please provide a valid URL');
      return false;
   }
   return true;
}


// Delete Bookmark
function deleteBookmark(id) {
   if(bookmarks[id]) {
      delete bookmarks[id];
   };
   // Update bookmarks array in localstorage, re-populate DOM
   localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
   fetchBookmarks();
}


// Create Bookmark Element
function createBookmark(name, url) {
   // Item
   const item = document.createElement('div');
   item.classList.add('item');
   // Close Icon
   const closeIcon = document.createElement('i');
   closeIcon.classList.add('fas', 'fa-times');
   closeIcon.setAttribute('title','Delete Bookmark');
   closeIcon.setAttribute('onclick', `deleteBookmark('${url}')`)
   // Favicon / Link Container
   const linkInfo = document.createElement('div');
   linkInfo.classList.add('name');
   // Favicon
   const favicon = document.createElement('img');
   favicon.setAttribute('src', `https://www.google.com/s2/favicons?domain=${url}`);
   favicon.setAttribute('alt', 'Favicon');
   // Link
   const link = document.createElement('a');
   link.setAttribute('href', `${url}`);
   link.setAttribute('target', '_blank');
   link.textContent =name;

   // Append to bookmarks container
   linkInfo.append(favicon, link);
   item.append(closeIcon, linkInfo);
   bookmarksContainer.appendChild(item);
}


// Build Bookmark DOM
function buildBookmarks() {
   // Remove all bookmark elements
   bookmarksContainer.textContent = '';

   // Build items
   Object.keys(bookmarks).forEach((id) => {
      const { name, url } = bookmarks[id];
      createBookmark(name, url);
   })
}


// Fetch Bookmarks
function fetchBookmarks() {
   // Get bookmarks from localstorage if avaliable
   if(localStorage.getItem('bookmarks')) {
      bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
   } else {
      // Create bookmarks array in localstorage
      bookmarks['https://google.com'] = {
            name: 'Google',
            url: 'https://google.com'
      };
      localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
   }
   buildBookmarks();
}


// Handle Data from Form
function storeBookmark(event) {
   event.preventDefault();
   const nameValue = websiteNameEl.value;
   let urlValue = websiteUrlEl.value;
   if(!urlValue.includes('http://') && !urlValue.includes('https://')) {
      urlValue = `https://${urlValue}`;
   }
   if(!validateUrl(nameValue, urlValue)) {
      return false;
   }

   const bookmark = {
      name: nameValue,
      url: urlValue
   };
   bookmarks[urlValue] = bookmark;

   // Localstorage setItem can only store string
   localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
   fetchBookmarks();
   bookmarkForm.reset();
   websiteNameEl.focus();
}


// Modal Event Listeners
modalShow.addEventListener('click', showModal);
modalClose.addEventListener('click', () => modal.classList.remove('show-modal'));
window.addEventListener('click', event => {
   event.target === modal ? modal.classList.remove('show-modal') : false;
});


// Event Listener Submit
bookmarkForm.addEventListener('submit', storeBookmark)

// On Load Fetch Bookmarks
fetchBookmarks();