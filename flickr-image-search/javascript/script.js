let obj = (function () {
    function getEleId(id) {
        return document.getElementById(id);
    }

    function getEleClass(className) {
        return document.getElementsByClassName(className)
    }

    function getAPI(search, pageNumber) {
        return `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${API key}&text=${search}&page=${pageNumber}&format=json&nojsoncallback=1`;
    }

    async function fetchData(url) {
        let response = await fetch(url)
        return await response.json();
    }


    function renderContent(flickr) {
        //console.log(flickr.photos.photo);
        var myModal = new bootstrap.Modal(document.getElementById('imageModal'), {
            keyboard: false
        })
        let searchedImages = flickr.photos.photo.map((photos, index) => {
            return `<div class="col">
                          <div class="card" style="width: 18rem; margin-left: 100px;">
                                <button type="button" data-index="${index}" value="${photos.server}/${photos.id}_${photos.secret}" class="btn btn-secondary imagePopover selectImage" data-bs-container="body" data-bs-toggle="popover modal" data-bs-target="#imageModal" data-bs-placement="right" data-bs-content="Right popover">
                                <img src="https://live.staticflickr.com/${photos.server}/${photos.id}_${photos.secret}_b.jpg" class="card-img-top" alt="...">
                                </button>        
                               
                          </div>
                        </div>`;
        });

        getEleId('render-content').innerHTML = searchedImages.join('');
//Image button
        let imagePopover = getEleClass('imagePopover');
        // let doubleClickFlag = false;
        let click;
        for (let i = 0; i < imagePopover.length; i++) {
            imagePopover[i].addEventListener('click', function (e) {
                click = window.setTimeout(function () {
                    myModal.show();
                    let modalBody = getEleId('modal-body');
                    modalBody.innerHTML = `<img style="width: 100%;" src="https://live.staticflickr.com/${imagePopover[i].value}_b.jpg" title="Flickr Image" frameBorder="0" >`;
                    //previous and next image button
                    let navigateImage = getEleClass('navigate');
                    for (let j = 0; j < navigateImage.length; j++) {
                        navigateImage[j].addEventListener('click', function (e) {
                            e.preventDefault();
                            let change = parseInt(this.dataset.value);
                            let newIndex = parseInt(imagePopover[i].dataset.index) + parseInt(change);
                            //handle -ve index
                            if (newIndex < 0) {
                                alert("First Image");
                            } else {
                                modalBody.innerHTML = `<img style="width: 100%;" src="https://live.staticflickr.com/${imagePopover[newIndex].value}_b.jpg" title="Flickr Image" frameBorder="0" >`;
                                //update index of the modal
                                i = newIndex;
                            }

                        })
                    }
                }, 300);


            });
        }
        //double click to select image
        let imageIndex = [];
        let doubleClick = getEleClass('selectImage');
        for (let i = 0; i < doubleClick.length; i++) {
            doubleClick[i].addEventListener('dblclick', function (e) {
                e.preventDefault();
                console.log(doubleClick[i]);
                doubleClick[i].style.backgroundColor = 'green';
                window.clearTimeout(click);
                // doubleClickFlag = true;
                console.log(imageIndex);
                if (!(imageIndex.includes(parseInt(doubleClick[i].dataset.index))))
                    imageIndex.push(parseInt(doubleClick[i].dataset.index));
                let downloadBtn = getEleId('downloadBtn');
                console.log(downloadBtn);
                downloadBtn.innerHTML = `<button type="button" class="download" style="margin-left: 100px; margin-top: 20px;">
                                                   DOWNLOAD
                                                </button>`
            });
        }
//download image
        let download = getEleClass('download');
        for (let i = 0; i < download.length; i++) {
            download[i].addEventListener('click', (e) => {
                e.preventDefault();
                console.log(e);
                console.log(imageIndex);
            });
        }
    }

//calling function
    function init() {
        let pageNumber = 1;
        let search = getEleId('search-input');
        let searchBtn = getEleId('search-btn');
        searchBtn.addEventListener('click', async function (e) {
            e.preventDefault();
            let flikrApi = await fetchData(getAPI(search.value, pageNumber));
            renderContent(flikrApi);
        });
//pagination
        let pageBtn = getEleClass('page-item');
        for (let i = 0; i < pageBtn.length; i++) {
            pageBtn[i].addEventListener('click', async function (e) {
                e.preventDefault();
                pageNumber += pageBtn[i].value;
                if (pageNumber < 1) {
                    alert("Already on the 1st page");
                } else {
                    let flikrApi = await fetchData(getAPI(search.value, pageNumber));
                    renderContent(flikrApi);
                }
            });
        }
    }

    return {
        init
    }
})();
//loader
window.addEventListener('load', function () {
    obj.init();
})
